import { Alert } from 'react-native';
import {
    CUSTOMER_PENDING, CUSTOMER_CHANGE,
    CUSTOMER_CHANGE_FAIL, CUSTOMER_CHANGE_SUCCESS,
    ADD_FLASH_MESSAGE, SUCCESS_MESSAGE, ERROR_MESSAGE,
    CUSTOMER_LOADED_SQLITE, CUSTOMER_DELETE_SUCCESS,
    RESET_CUSTOMER_FORM, CUSTOMER_LIST_LOADED_SQLITE
} from './index';
import { URL } from '../../env';
import axios from 'axios';
import { NewCustomerValidator } from '../validators';
import { AsyncStorage } from 'react-native';
import { SQLite } from 'expo';
import SqlService from '../database/sqliteService';
import { Actions } from 'react-native-router-flux';
import db from '../database/sqliteConfig';

export const loadCustomerListDataFromSqlite = () => async (dispatch) => {
    dispatch({
        type: CUSTOMER_PENDING
    });
    SqlService.query('select * from customers').then(
        result => {
            dispatch({
                type: CUSTOMER_LIST_LOADED_SQLITE,
                payload: result
            });
        }
    );
};

export const loadCustomerByNameFromSqlite = (name) => (dispatch) => {
    /*
        Phương thức này sẽ trả về danh sách các sản phẩm có tên gần nhất với tên sản phẩm được cung cấp
    */
    dispatch({
        type: CUSTOMER_PENDING
    });
    console.log('go ro search actions');
    SqlService.query(`select * from customers where name like '%${name}%'`).then(
        result => {
            dispatch({
                type: CUSTOMER_LIST_LOADED_SQLITE,
                payload: result
            });
        }
    );
};

export const loadCustomerDataFromSqlite = (customerId) => async (dispatch) => {
    dispatch({
        type: CUSTOMER_PENDING
    });
    console.log(`go in load ${customerId} from sqlite`);

    SqlService.query(`select * from customers where id = ${customerId}`).then(
        result => {
            console.log(`customerId = ${customerId} and result = `, result);
            dispatch({
                type: CUSTOMER_LOADED_SQLITE,
                payload: result[0]
            });
        }
    );
};


export const resetData = () => (dispatch) => {
    dispatch({
        type: RESET_CUSTOMER_FORM
    });
};

export const CustomerChange = ({ prop, value }) => ({
    type: CUSTOMER_CHANGE,
    payload: { prop, value }
});

export const CustomerDelete = (customerId) => async (dispatch) => {
    dispatch({
        type: CUSTOMER_PENDING
    });

    const apiUrl = `${URL}/api/customer/delete`;

    axios.post(apiUrl, { Id: customerId }).then(
        (res) => {
            //Dữ liệu đã được lưu thành công trên server,
            //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
            db.transaction(
                tx => {
                    tx.executeSql(`
                        UPDATE dataVersions 
                        SET customers = '${res.data.dataversion[0].customers}'                  
                        WHERE id = '1';
                    `);
                    tx.executeSql(
                        `DELETE FROM customers 
                        WHERE id = '${customerId}';`
                    );
                    tx.executeSql('select * from customers',
                        null,
                        (_, { rows: { _array } }) => {
                            dispatch({
                                type: CUSTOMER_LIST_LOADED_SQLITE,
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
                type: CUSTOMER_DELETE_SUCCESS
            });
            dispatch({
                type: ADD_FLASH_MESSAGE,
                payload: { message: 'Bạn đã xóa khách hàng thành công', TypeMessage: SUCCESS_MESSAGE }
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
                    type: CUSTOMER_CHANGE_FAIL,
                    payload: err.response.data.error
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa khách hàng thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                });
            } else {
                dispatch({
                    type: CUSTOMER_CHANGE_FAIL,
                    payload: err
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa khách hàng thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const CustomerUpdate = (customer) => async (dispatch) => {
    dispatch({
        type: CUSTOMER_PENDING
    });
    const { isValid, errors } = NewCustomerValidator(customer);
    if (!isValid) {
        dispatch({
            type: CUSTOMER_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/customer/update`;

        axios.post(apiUrl, customer).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                try {
                    db.transaction(
                        tx => {
                            tx.executeSql(`
                            update dataVersions 
                            set customers = ${res.data.dataversion[0].customers} 
                            where id = 1`,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update dataVersions = ', e);
                                }
                            );

                            tx.executeSql(`
                            update customers 
                            set name = '${res.data.customer[0].name}',
                            customerGroupId = ${res.data.customer[0].customerGroupId},
                            phone = '${res.data.customer[0].phone}',
                            email = '${res.data.customer[0].email}',
                            overdue = ${res.data.customer[0].overdue},
                            excessDebt = ${res.data.customer[0].excessDebt},
                            companyName = '${res.data.customer[0].companyName}',
                            companyAdress = '${res.data.customer[0].companyAdress}',
                            directorName = '${res.data.customer[0].directorName}',
                            bankNumber = '${res.data.customer[0].bankNumber}',
                            bankName = '${res.data.customer[0].bankName}',
                            taxCode = '${res.data.customer[0].taxCode}',
                            fax = '${res.data.customer[0].fax}'
                            where id = ${res.data.customer[0].id}
                            `,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update customers = ', e);
                                }
                            );
                            tx.executeSql('select * from customers',
                                null,
                                (_, { rows: { _array } }) => {
                                    dispatch({
                                        type: CUSTOMER_LIST_LOADED_SQLITE,
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
                    type: CUSTOMER_CHANGE_SUCCESS,
                    payload: res.data.customer[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo khách hàng thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: CUSTOMER_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo khách hàng thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: CUSTOMER_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo khách hàng thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const AddNewCustomer = (customer) => async (dispatch) => {
    dispatch({
        type: CUSTOMER_PENDING
    });
    const { isValid, errors } = NewCustomerValidator(customer);
    if (!isValid) {
        dispatch({
            type: CUSTOMER_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/customer/new`;

        axios.post(apiUrl, customer).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                db.transaction(
                    tx => {
                        tx.executeSql(`UPDATE dataVersions 
                            SET customers = '${res.data.dataversion[0].customers}'                    
                            WHERE id = 1;`
                        );
                        console.log('res.data.customer[0] = ', res.data.customer[0]);
                        const strSql = `insert into customers 
                                    (
                                        id,
                                        customerGroupId,
                                        name,
                                        address,
                                        phone,
                                        email,
                                        overdue,
                                        excessDebt,
                                        companyName,
                                        companyAdress,
                                        directorName,
                                        bankNumber,
                                        bankName,
                                        taxCode,
                                        fax
                                    ) 
                                    values (
                                            ${res.data.customer[0].id},
                                            '${res.data.customer[0].customerGroupId}', 
                                           '${res.data.customer[0].name}', 
                                           '${res.data.customer[0].address}', 
                                           '${res.data.customer[0].phone}', 
                                           '${res.data.customer[0].email}', 
                                            ${res.data.customer[0].overdue}, 
                                            ${res.data.customer[0].excessDebt}, 
                                           '${res.data.customer[0].companyName}', 
                                           '${res.data.customer[0].companyAdress}', 
                                           '${res.data.customer[0].directorName}', 
                                           '${res.data.customer[0].bankNumber}', 
                                           '${res.data.customer[0].bankName}', 
                                           '${res.data.customer[0].taxCode}', 
                                            '${res.data.customer[0].fax}'
                                        )
                                    `;

                        tx.executeSql(strSql);

                        tx.executeSql(
                            'select * from customers',
                            null,
                            (_, { rows: { _array } }) => {
                                dispatch({
                                    type: CUSTOMER_LIST_LOADED_SQLITE,
                                    payload: _array
                                });
                            },
                            (e) => {
                                console.log('error read customers data from sqlite = ', e);
                            }
                        );
                    },
                    (e) => console.log('Lỗi update sqlite: ', e),
                    null
                );

                dispatch({
                    type: CUSTOMER_CHANGE_SUCCESS,
                    payload: res.data.customer[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo khách hàng thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: CUSTOMER_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo khách hàng thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: CUSTOMER_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo khách hàng thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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
