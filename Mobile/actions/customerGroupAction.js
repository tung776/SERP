import { Alert } from 'react-native';
import {
    CUSTOMER_GROUP_PENDING, CUSTOMER_GROUP_CHANGE,
    CUSTOMER_GROUP_CHANGE_FAIL, CUSTOMER_GROUP_CHANGE_SUCCESS,
    ADD_FLASH_MESSAGE, SUCCESS_MESSAGE, ERROR_MESSAGE,
    CUSTOMER_GROUP_LOADED_SQLITE, CUSTOMER_GROUP_DELETE_SUCCESS,
    RESET_CUSTOMER_GROUP_FORM, CUSTOMER_GROUP_LIST_LOADED_SQLITE
} from './index';
import { URL } from '../../env';
import axios from 'axios';
import { NewCustomerGroupValidator } from '../validators';
import { AsyncStorage } from 'react-native';
import { SQLite } from 'expo';
import SqlService from '../database/sqliteService';
import { Actions } from 'react-native-router-flux';
import db from '../database/sqliteConfig';

export const loadCustomerGroupListDataFromSqlite = () => async (dispatch) => {
    dispatch({
        type: CUSTOMER_GROUP_PENDING
    });
    SqlService.query('select * from customerGroups').then(        
        result => {
            dispatch({
                type: CUSTOMER_GROUP_LIST_LOADED_SQLITE,
                payload: result
            });
        }
    );
};

export const loadCustomerGroupDataFromSqlite = (customerGroupId) => async (dispatch) => {
    dispatch({
        type: CUSTOMER_GROUP_PENDING
    });
    
    SqlService.query(`select * from customerGroups where id = ${customerGroupId}`).then(
        result => {
            console.log(`customerGroupId = ${customerGroupId} and result = `, result);
            dispatch({
                type: CUSTOMER_GROUP_LOADED_SQLITE,
                payload: result[0]
            });
        }
    );
};


export const resetData = () => (dispatch) => {
    dispatch({
        type: RESET_CUSTOMER_GROUP_FORM
    });
};

export const CustomerGroupChange = ({ prop, value }) => ({
    type: CUSTOMER_GROUP_CHANGE,
    payload: { prop, value }
});

export const CustomerGroupDelete = (customerGroupId) => async (dispatch) => {
    dispatch({
        type: CUSTOMER_GROUP_PENDING
    });

    const apiUrl = `${URL}/api/customerGroup/delete`;

    axios.post(apiUrl, { Id: customerGroupId }).then(
        (res) => {
            //Dữ liệu đã được lưu thành công trên server,
            //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
            db.transaction(
                tx => {
                    tx.executeSql(`
                        UPDATE dataVersions 
                        SET customerGroups = '${res.data.dataversion[0].customerGroups}'                  
                        WHERE id = '1';
                    `);
                    tx.executeSql(
                        `DELETE FROM customerGroups 
                        WHERE id = '${customerGroupId}';`
                    );
                    tx.executeSql('select * from customerGroups',
                        null,
                        (_, { rows: { _array } }) => {
                            dispatch({
                                type: CUSTOMER_GROUP_LIST_LOADED_SQLITE,
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
                type: CUSTOMER_GROUP_DELETE_SUCCESS
            });
            dispatch({
                type: ADD_FLASH_MESSAGE,
                payload: { message: 'Bạn đã tạo nhóm khách hàng thành công', TypeMessage: SUCCESS_MESSAGE }
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
                    type: CUSTOMER_GROUP_CHANGE_FAIL,
                    payload: err.response.data.error
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Tạo nhóm khách hàng thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                });
            } else {
                dispatch({
                    type: CUSTOMER_GROUP_CHANGE_FAIL,
                    payload: err
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Tạo nhóm khách hàng thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const CustomerGroupUpdate = (customerGroup) => async (dispatch) => {
    dispatch({
        type: CUSTOMER_GROUP_PENDING
    });
    const { isValid, errors } = NewCustomerGroupValidator(customerGroup);
    if (!isValid) {
        dispatch({
            type: CUSTOMER_GROUP_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/customerGroup/update`;

        axios.post(apiUrl, customerGroup).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                try {
                    db.transaction(
                        tx => {
                            tx.executeSql(`
                            update dataVersions 
                            set customerGroups = ${res.data.dataversion[0].customerGroups} 
                            where id = 1`,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update dataVersions = ', e);
                                }
                            );

                            tx.executeSql(`
                            update customerGroups 
                            set name = '${res.data.customerGroup[0].name}',
                            description = '${res.data.customerGroup[0].description}'
                            where id = ${res.data.customerGroup[0].id}
                            `,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update customerGroups = ', e);
                                }
                            );
                            tx.executeSql('select * from customerGroups',
                                null,
                                (_, { rows: { _array } }) => {
                                    dispatch({
                                        type: CUSTOMER_GROUP_LIST_LOADED_SQLITE,
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
                    type: CUSTOMER_GROUP_CHANGE_SUCCESS,
                    payload: res.data.customerGroup[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo nhóm khách hàng thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: CUSTOMER_GROUP_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nhóm khách hàng thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: CUSTOMER_GROUP_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nhóm khách hàng thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const AddNewCustomerGroup = (customerGroup) => async (dispatch) => {
    dispatch({
        type: CUSTOMER_GROUP_PENDING
    });
    const { isValid, errors } = NewCustomerGroupValidator(customerGroup);
    if (!isValid) {
        dispatch({
            type: CUSTOMER_GROUP_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/customerGroup/new`;

        axios.post(apiUrl, customerGroup).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                db.transaction(
                    tx => {
                        tx.executeSql(`UPDATE dataVersions 
                            SET customerGroups = '${res.data.dataversion[0].customerGroups}'                    
                            WHERE id = 1;`
                        );
                        const strSql = `insert into customerGroups 
                                    (id, name, description) 
                                    values (
                                            ${res.data.customerGroup[0].id},
                                           ' ${res.data.customerGroup[0].name}', 
                                            '${res.data.customerGroup[0].description}'
                                        )
                                    `;
                        
                        tx.executeSql(strSql);
                        
                        tx.executeSql(
                            'select * from customerGroups',
                            null,
                            (_, { rows: { _array } }) => {
                                dispatch({
                                    type: CUSTOMER_GROUP_LIST_LOADED_SQLITE,
                                    payload: _array
                                });
                            },
                            (e) => {
                                console.log('error read customerGroups data from sqlite = ', e);
                            }
                        );
                    },
                    (e) => console.log('Lỗi update sqlite: ', e),
                    null
                );

                dispatch({
                    type: CUSTOMER_GROUP_CHANGE_SUCCESS,
                    payload: res.data.customerGroup[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo nhóm khách hàng thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: CUSTOMER_GROUP_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nhóm khách hàng thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: CUSTOMER_GROUP_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nhóm khách hàng thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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
