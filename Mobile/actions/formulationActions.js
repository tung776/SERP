import { Alert } from 'react-native';
import {
    FORMULATION_PENDING, FORMULATION_CHANGE,
    FORMULATION_CHANGE_FAIL, FORMULATION_CHANGE_SUCCESS,
    ADD_FLASH_MESSAGE, SUCCESS_MESSAGE, ERROR_MESSAGE,
    FORMULATION_LOADED_SERVER, FORMULATION_DELETE_SUCCESS,
    RESET_FORMULATION_FORM, FORMULATION_LIST_LOADED_SERVER,
    FORMULATION_DETAIL_CHANGE, RESET_PRODUCT_FORM, ADD_FORMULATION,
    LOAD_TAX_SUCCESS
} from './index';
import { URL } from '../../env';
import axios from 'axios';
import { NewFormulationValidator } from '../validators';
import { AsyncStorage } from 'react-native';
import { SQLite } from 'expo';
import SqlService from '../database/sqliteService';
import { Actions } from 'react-native-router-flux';
import db from '../database/sqliteConfig';

export const loadFormulationListDataFromServerByProductId = (FormulationId) => async (dispatch) => {
    dispatch({
        type: FORMULATION_PENDING
    });

    axios.post(`${URL}/api/formulation/getByFormulationId`, { FormulationId }).then(
        res => {
            dispatch({
                type: FORMULATION_LIST_LOADED_SERVER,
                payload: res.data.formulations
            });
        }
    );
};

export const loadFormulationByFormulationOrFormulationGroupIdFromServer = (FormulationId = null) => (dispatch) => {
    /*
        Phương thức này sẽ trả về danh sách các sản phẩm có tên gần nhất với tên sản phẩm được cung cấp
    */
    dispatch({
        type: FORMULATION_PENDING
    });
    let strSql = '';
    if (FormulationId !== null) {
        strSql = `select
         id, title, date, FormulationId, FormulationGroupId 
         from formulations 
         where id IN (
                    SELECT max(id) FROM formulations  
                    GROUP BY FormulationGroupId, FormulationId
                ) 
        and FormulationId = ${FormulationId}
         `;
    } else {
        strSql = `
        select id, title, date, FormulationId, FormulationGroupId 
        from formulations 
        where id IN (
                    SELECT max(id) FROM formulations  
                    GROUP BY FormulationGroupId, FormulationId
                ) 
        and FormulationGroupId = ${FormulationGroupId}
        `;
    }
    SqlService.query(strSql).then(
        result => {
            if (result[0]) {
                dispatch({
                    type: FORMULATION_LIST_LOADED_SERVER,
                    payload: result[0]
                });
            } else {
                dispatch({
                    type: FORMULATION_LIST_LOADED_SERVER,
                    payload: null
                });
            }
        }
    );
};

export const loadFormulationById = (formulationId) => async (dispatch) => {
    dispatch({
        type: FORMULATION_PENDING
    });

    axios.post(`${URL}/api/formulation/getById`, { formulationId }).then(
        res => {
            console.log('res = ', res.data);
            dispatch({
                type: FORMULATION_LOADED_SERVER,
                payload: res.data
            });
            let selectedProducts = [];
            res.data.formulationDetails.forEach((item) => {
                
                const temp = {
                    id: item.productId,
                    detailId: item.id,
                    salePrice: item.salePrice,
                    unitId: item.unitId,
                    name: item.name,
                    key: item.productId,
                    quantity: item.quantity
                };
                selectedProducts.push(temp);
            });
            dispatch({
                type: RESET_PRODUCT_FORM,
                payload: {selectedProducts}
            });
        }
    );
};


export const resetData = () => (dispatch) => {
    dispatch({
        type: RESET_FORMULATION_FORM
    });
    dispatch({
        type: RESET_PRODUCT_FORM,
        payload: { selectedProducts: null }
    });
};

export const FormulationChange = ({ prop, value }) => ({
    type: FORMULATION_CHANGE,
    payload: { prop, value }
});

export const FormulationDetailChange = ({ index, prop, value }) => ({
    type: FORMULATION_DETAIL_CHANGE,
    payload: { index, prop, value }
});


export const FormulationDelete = (formulation) => async (dispatch) => {
    dispatch({
        type: FORMULATION_PENDING
    });

    const apiUrl = `${URL}/api/formulation/delete`;

    axios.post(apiUrl, formulation).then(
        (res) => {
            //Dữ liệu đã được lưu thành công trên server,
            //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
            db.transaction(
                tx => {
                    tx => {
                        tx.executeSql(`UPDATE dataVersions 
                        SET debtFormulations = '${res.data.dataversion[0].debtFormulations}'                    
                        WHERE id = 1;`
                    );
                    tx.executeSql(`delete from debtFormulations where id = ${formulation.debtFormulationId}`);
                    const strSql = `insert into debtFormulations 
                                (
                                    id,
                                    FormulationId,
                                    createdDate,
                                    title,
                                    newDebt,
                                    oldDebt,
                                    minus,
                                    plus
                                ) 
                                values (
                                        ${res.data.debtFormulations[0].id},
                                        ${res.data.debtFormulations[0].FormulationId}, 
                                        '${res.data.debtFormulations[0].createdDate}', 
                                        '${res.data.debtFormulations[0].title}', 
                                        ${res.data.debtFormulations[0].newDebt}, 
                                        ${res.data.debtFormulations[0].oldDebt},
                                        ${res.data.debtFormulations[0].minus}, 
                                        ${res.data.debtFormulations[0].plus}
                                    )
                                `;

                    tx.executeSql(strSql);
                },
                err => console.log('Đã có lỗi: ', err),
                null;
                });
            Actions.pop();
            dispatch({
                type: FORMULATION_DELETE_SUCCESS
            });
            dispatch({
                type: ADD_FLASH_MESSAGE,
                payload: { message: 'Bạn đã xóa nghiên cứu thực nghiệm thành công', TypeMessage: SUCCESS_MESSAGE }
            });
            Alert.alert(
                'Thông Báo',
                'Bạn đã xóa hóa đơn thành công',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]
            );
        }
    ).catch(
        err => {
            console.log('error: ', err);
            if (err.response) {
                dispatch({
                    type: FORMULATION_CHANGE_FAIL,
                    payload: err.response.data.error
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa nghiên cứu thực nghiệm thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                });
            } else {
                dispatch({
                    type: FORMULATION_CHANGE_FAIL,
                    payload: err
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa nghiên cứu thực nghiệm thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
                });
            }
            Alert.alert(
                'Báo Lỗi',
                `Lưu dữ liệu thất bại: ${err}`,
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]
            );
        }
        );
};

export const FormulationUpdate = (formulation) => async (dispatch) => {
    dispatch({
        type: FORMULATION_PENDING
    });
    const { isValid, errors } = NewFormulationValidator(formulation);
    if (!isValid) {
        dispatch({
            type: FORMULATION_CHANGE_FAIL,
            payload: errors
        });
        Alert.alert(
            'Báo Lỗi',
            `Lưu dữ liệu thất bại: ${errors}`,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]
        );
    } else {
        const apiUrl = `${URL}/api/formulation/update`;

        axios.post(apiUrl, formulation).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                try {
                    db.transaction(
                        tx => {
                            tx.executeSql(`UPDATE dataVersions 
                            SET debtFormulations = '${res.data.dataversion[0].debtFormulations}'                    
                            WHERE id = 1;`
                            );
                        

                        tx.executeSql(`
                        update debtFormulations 
                        set FormulationId = ${res.data.debtFormulations[0].FormulationId},
                        createdDate = '${res.data.debtFormulations[0].createdDate}',
                        title = '${res.data.debtFormulations[0].title}',
                        newDebt = ${res.data.debtFormulations[0].newDebt},
                        oldDebt = ${res.data.debtFormulations[0].oldDebt},
                        minus = ${res.data.debtFormulations[0].minus},
                        plus = ${res.data.debtFormulations[0].plus}
                        where id = ${res.data.debtFormulations[0].id} 
                        `,
                            null,
                            null,
                            (e) => {
                                console.log('lỗi update debtFormulations = ', e);
                            }
                        );
                    })
                } catch (e) {
                    console.log(e);
                }
                dispatch({
                    type: FORMULATION_CHANGE_SUCCESS,
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã lưu nghiên cứu thực nghiệm thành công', TypeMessage: SUCCESS_MESSAGE }
                });
                Alert.alert(
                    'Thông Báo',
                    'Bạn đã lưu dữ liệu thành công',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]
                );
            }
        ).catch(
            err => {
                console.log('error: ', err);
                if (err.response) {
                    dispatch({
                        type: FORMULATION_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nghiên cứu thực nghiệm thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: FORMULATION_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nghiên cứu thực nghiệm thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
                    });
                }
                Alert.alert(
                    'Báo Lỗi',
                    `Lưu dữ liệu thất bại: ${err}`,
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]
                );
            }
            );
    }
};

export const AddNewFormulation = (formulation) => async (dispatch) => {
    dispatch({
        type: FORMULATION_PENDING
    });
    const { isValid, errors } = NewFormulationValidator(formulation);
    if (!isValid) {
        dispatch({
            type: FORMULATION_CHANGE_FAIL,
            payload: errors
        });
        Alert.alert(
            'Báo Lỗi',
            `Lưu dữ liệu thất bại: ${errors}`,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]
        );
    } else {
        const apiUrl = `${URL}/api/formulation/new`;

        axios.post(apiUrl, formulation).then(
            (res) => {

                dispatch({
                    type: ADD_FORMULATION,
                    payload: res.data
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo nghiên cứu thực nghiệm thành công', TypeMessage: SUCCESS_MESSAGE }
                });
                Alert.alert(
                    'Thông Báo',
                    'Bạn đã lưu dữ liệu thành công',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]
                );
            }
        ).catch(
            err => {
                console.log('error: ', err);
                if (err.response) {
                    dispatch({
                        type: FORMULATION_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nghiên cứu thực nghiệm thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: FORMULATION_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nghiên cứu thực nghiệm thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
                    });
                }
                Alert.alert(
                    'Báo Lỗi',
                    `Lưu dữ liệu thất bại: ${err}`,
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ]
                );
            }
            );
    }
};


