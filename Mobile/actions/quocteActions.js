import { Alert } from 'react-native';
import {
    QUOCTE_PENDING, QUOCTE_CHANGE,
    QUOCTE_CHANGE_FAIL, QUOCTE_CHANGE_SUCCESS,
    ADD_FLASH_MESSAGE, SUCCESS_MESSAGE, ERROR_MESSAGE,
    QUOCTE_LOADED_SQLITE, QUOCTE_DELETE_SUCCESS,
    RESET_QUOCTE_FORM, QUOCTE_LIST_LOADED_SQLITE,
    QUOCTE_DETAIL_CHANGE
} from './index';
import { URL } from '../../env';
import axios from 'axios';
import { NewQuocteValidator } from '../validators';
import { AsyncStorage } from 'react-native';
import { SQLite } from 'expo';
import SqlService from '../database/sqliteService';
import { Actions } from 'react-native-router-flux';
import db from '../database/sqliteConfig';

export const loadQuocteListDataFromSqlite = () => async (dispatch) => {
    dispatch({
        type: QUOCTE_PENDING
    });
    SqlService.query('select id, customerId, customerGroupId from quoctes').then(
        result => {
            console.log('loadQuocteListDataFromSqlite result = ', result)
            dispatch({
                type: QUOCTE_LIST_LOADED_SQLITE,
                payload: result
            });
        }
    );
};

export const loadQuocteByCustomerOrCustomerGroupIdFromSqlite = (customerId = null, customerGroupId = null) => (dispatch) => {
    /*
        Phương thức này sẽ trả về danh sách các sản phẩm có tên gần nhất với tên sản phẩm được cung cấp
    */
    dispatch({
        type: QUOCTE_PENDING
    });
    console.log(`go to search actions, customerId = ${customerId} and groupId = ${customerGroupId}`);
    let strSql = '';
    if (customerId !== null) {
        strSql = `select
         id, title, date, customerId, customerGroupId 
         from quoctes 
         where id IN (
                    SELECT max(id) FROM quoctes  
                    GROUP BY customerGroupId, customerId
                ) 
        and customerId = ${customerId}
         `;
    } else {
        strSql = `
        select id, title, date, customerId, customerGroupId 
        from quoctes 
        where id IN (
                    SELECT max(id) FROM quoctes  
                    GROUP BY customerGroupId, customerId
                ) 
        and customerGroupId = ${customerGroupId}
        `;
    }
    SqlService.query(strSql).then(
        result => {
            console.log('search result = ', result);
            if (result[0]) {
                dispatch({
                    type: QUOCTE_LIST_LOADED_SQLITE,
                    payload: result[0]
                });
            } else {
                dispatch({
                    type: QUOCTE_LIST_LOADED_SQLITE,
                    payload: null
                });
            }
        }
    );
};

export const loadQuocteDataFromSqlite = (quocteId) => async (dispatch) => {
    dispatch({
        type: QUOCTE_PENDING
    });

    SqlService.query(`select * from quoctes where id = ${quocteId}`).then(
        result => {
            dispatch({
                type: QUOCTE_LOADED_SQLITE,
                payload: result
            });
        }
    );
};


export const resetData = () => (dispatch) => {
    dispatch({
        type: RESET_QUOCTE_FORM
    });
};

export const QuocteChange = ({ prop, value }) => ({
    type: QUOCTE_CHANGE,
    payload: { prop, value }
});

export const QuocteDetailChange = ({ index, prop, value }) => ({
    type: QUOCTE_DETAIL_CHANGE,
    payload: { index, prop, value }
});


export const QuocteDelete = (quocteId) => async (dispatch) => {
    dispatch({
        type: QUOCTE_PENDING
    });

    const apiUrl = `${URL}/api/quocte/delete`;

    axios.post(apiUrl, { Id: quocteId }).then(
        (res) => {
            //Dữ liệu đã được lưu thành công trên server,
            //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
            db.transaction(
                tx => {
                    tx.executeSql(`
                        UPDATE dataVersions 
                        SET quoctes = '${res.data.dataversion[0].quoctes}'                  
                        WHERE id = '1';
                    `);
                    tx.executeSql(
                        `DELETE FROM quoctes 
                        WHERE id = '${quocteId}';`
                    );
                    tx.executeSql('select * from quoctes',
                        null,
                        (_, { rows: { _array } }) => {
                            dispatch({
                                type: QUOCTE_LIST_LOADED_SQLITE,
                                payload: _array
                            });
                        },
                        (e) => {
                            console.log('error = ', e);
                        }
                    );
                },
                err => console.log('Đã có lỗi: ', err),
                null
            );
            Actions.pop();
            dispatch({
                type: QUOCTE_DELETE_SUCCESS
            });
            dispatch({
                type: ADD_FLASH_MESSAGE,
                payload: { message: 'Bạn đã xóa báo giá thành công', TypeMessage: SUCCESS_MESSAGE }
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
                    type: QUOCTE_CHANGE_FAIL,
                    payload: err.response.data.error
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa báo giá thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                });
            } else {
                dispatch({
                    type: QUOCTE_CHANGE_FAIL,
                    payload: err
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa báo giá thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const QuocteUpdate = (quocte) => async (dispatch) => {
    dispatch({
        type: QUOCTE_PENDING
    });
    const { isValid, errors } = NewQuocteValidator(quocte);
    if (!isValid) {
        dispatch({
            type: QUOCTE_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/quocte/update`;

        axios.post(apiUrl, quocte).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                try {
                    db.transaction(
                        tx => {
                            tx.executeSql(`
                            update dataVersions 
                            set quoctes = ${res.data.dataversion[0].quoctes} 
                            where id = 1`,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update dataVersions = ', e);
                                }
                            );

                            tx.executeSql(`
                            update quoctes 
                            set date = '${res.data.quocte[0].date}',
                            title = '${res.data.quocte[0].title}',
                            price = ${res.data.quocte[0].price}
                            where id = ${res.data.quocte[0].id} and 
                                    customerId = ${res.data.quocte[0].customerId} and
                                    customerGroupId = ${res.data.quocte[0].customerGroupId} and
                                    productId = ${res.data.quocte[0].productId} and
                                    unitId = ${res.data.quocte[0].unitId}
                            `,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update quoctes = ', e);
                                }
                            );
                            tx.executeSql('select * from quoctes',
                                null,
                                (_, { rows: { _array } }) => {
                                    dispatch({
                                        type: QUOCTE_LIST_LOADED_SQLITE,
                                        payload: _array
                                    });
                                },
                                (e) => {
                                    console.log('error = ', e);
                                }
                            );

                        },
                        (e) => console.log('error ?????', e),
                        null
                    );

                } catch (e) {
                    console.log(e);
                }
                Actions.pop({ reLoad: true });
                dispatch({
                    type: QUOCTE_CHANGE_SUCCESS,
                    payload: res.data.quocte[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo báo giá thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: QUOCTE_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo báo giá thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: QUOCTE_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo báo giá thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const AddNewQuocte = (quocte) => async (dispatch) => {
    dispatch({
        type: QUOCTE_PENDING
    });
    const { isValid, errors } = NewQuocteValidator(quocte);
    if (!isValid) {
        dispatch({
            type: QUOCTE_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/quocte/new`;

        axios.post(apiUrl, quocte).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                db.transaction(
                    tx => {
                        tx.executeSql(`UPDATE dataVersions 
                            SET quoctes = '${res.data.dataversion[0].quoctes}'                    
                            WHERE id = 1;`
                        );
                        console.log('res.data.quocte = ', res.data.quocte);
                        res.data.quocte.forEach((item) => {
                            const strSql = `insert into quoctes 
                                    (
                                        id,
                                        customerId,
                                        customerGroupId,
                                        title,
                                        date,
                                        detailId
                                        unitId,
                                        productId,
                                        price
                                    ) 
                                    values (
                                            ${item.id},
                                            ${item.customerId}, 
                                            ${item.customerGroupId}, 
                                            '${item.title}', 
                                            '${item.date}', 
                                            ${item.detailId},
                                            ${item.unitId}, 
                                            ${item.productId}, 
                                            ${item.price}
                                        )
                                    `;

                            tx.executeSql(strSql);
                        })


                        // tx.executeSql(
                        //     'select * from quoctes',
                        //     null,
                        //     (_, { rows: { _array } }) => {
                        //         dispatch({
                        //             type: QUOCTE_LIST_LOADED_SQLITE,
                        //             payload: _array
                        //         });
                        //     },
                        //     (e) => {
                        //         console.log('error read quoctes data from sqlite = ', e);
                        //     }
                        // );
                    },
                    (e) => console.log('Lỗi update sqlite: ', e),
                    null
                );

                dispatch({
                    type: QUOCTE_CHANGE_SUCCESS,
                    payload: res.data.quocte[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo báo giá thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: QUOCTE_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo báo giá thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: QUOCTE_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo báo giá thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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
