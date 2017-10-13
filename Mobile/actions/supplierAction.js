import { Alert } from 'react-native';
import {
    SUPPLIER_PENDING, SUPPLIER_CHANGE,
    SUPPLIER_CHANGE_FAIL, SUPPLIER_CHANGE_SUCCESS,
    ADD_FLASH_MESSAGE, SUCCESS_MESSAGE, ERROR_MESSAGE,
    SUPPLIER_LOADED_SQLITE, SUPPLIER_DELETE_SUCCESS,
    RESET_SUPPLIER_FORM, SUPPLIER_LIST_LOADED_SQLITE,
    SUPPLIER_DEBT_LOADED_SQLITE
} from './index';
import { URL } from '../../env';
import axios from 'axios';
import { NewSupplierValidator } from '../validators';
import { AsyncStorage } from 'react-native';
import { SQLite } from 'expo';
import SqlService from '../database/sqliteService';
import { Actions } from 'react-native-router-flux';
import db from '../database/sqliteConfig';

export const loadSupplierListDataFromSqlite = () => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
    });
    await SqlService.query('select * from customers').then(
        result => {
            dispatch({
                type: SUPPLIER_LIST_LOADED_SQLITE,
                payload: result
            });
        }
    );
};
export const loadDebtSuppliersFromSqlite = (customerId) => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
    });
    await SqlService.query(`select * from debtSuppliers where customerId = ${customerId}`).then(
        result => {
            dispatch({
                type: SUPPLIER_DEBT_LOADED_SQLITE,
                payload: result
            });
        }
    );
};
export const loadDebtSuppliersFromServer = () => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
    });
   
};

export const loadSupplierByNameFromSqlite = (name) => (dispatch) => {
    /*
        Phương thức này sẽ trả về danh sách các sản phẩm có tên gần nhất với tên sản phẩm được cung cấp
    */
    dispatch({
        type: SUPPLIER_PENDING
    });
    SqlService.query(`select * from customers where name like '%${name}%'`).then(
        result => {
            dispatch({
                type: SUPPLIER_LIST_LOADED_SQLITE,
                payload: result
            });
        }
    );
};

export const loadSupplierDataFromSqlite = (customerId) => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
    });

    SqlService.query(`select * from customers where id = ${customerId}`).then(
        result => {
            dispatch({
                type: SUPPLIER_LOADED_SQLITE,
                payload: result[0]
            });
        }
    );
};


export const resetData = () => (dispatch) => {
    dispatch({
        type: RESET_SUPPLIER_FORM
    });
};

export const SupplierChange = ({ prop, value }) => ({
    type: SUPPLIER_CHANGE,
    payload: { prop, value }
});

export const SupplierDelete = (customerId) => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
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
                                type: SUPPLIER_LIST_LOADED_SQLITE,
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
                type: SUPPLIER_DELETE_SUCCESS
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
                    type: SUPPLIER_CHANGE_FAIL,
                    payload: err.response.data.error
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa khách hàng thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                });
            } else {
                dispatch({
                    type: SUPPLIER_CHANGE_FAIL,
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

export const SupplierUpdate = (customer) => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
    });
    const { isValid, errors } = NewSupplierValidator(customer);
    if (!isValid) {
        dispatch({
            type: SUPPLIER_CHANGE_FAIL,
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
                            CurentDebt = '${res.data.customer[0].CurentDebt}',
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
                            console.log('res.data.customerDebt =', res.data.customerDebt);
                            tx.executeSql(`
                            update debtSuppliers 
                            set customerId = ${res.data.customerDebt.customerId},
                            createdDate = '${res.data.customerDebt.createdDate}',
                            title = '${res.data.customerDebt.title}',
                            newDebt = ${res.data.customerDebt.newDebt},
                            oldDebt = ${res.data.customerDebt.oldDebt},
                            minus = ${res.data.customerDebt.minus},
                            plus = ${res.data.customerDebt.plus}
                            where id = ${res.data.customerDebt.id} 
                            `,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update debtSuppliers = ', e);
                                }
                            );


                            tx.executeSql('select * from customers',
                                null,
                                (_, { rows: { _array } }) => {
                                    dispatch({
                                        type: SUPPLIER_LIST_LOADED_SQLITE,
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
                    type: SUPPLIER_CHANGE_SUCCESS,
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
                        type: SUPPLIER_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo khách hàng thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: SUPPLIER_CHANGE_FAIL,
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

export const AddNewSupplier = (customer) => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
    });
    const { isValid, errors } = NewSupplierValidator(customer);
    if (!isValid) {
        dispatch({
            type: SUPPLIER_CHANGE_FAIL,
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
                        const strSql = `insert into customers 
                                    (
                                        id,
                                        customerGroupId,
                                        name,
                                        address,
                                        phone,
                                        email,
                                        CurentDebt,
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
                                           '${res.data.customer[0].CurentDebt}', 
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
                        const strSqlDebt = `insert into debtSuppliers 
                                    (
                                        'id',
                                        'customerId',
                                        'createdDate',
                                        'title',
                                        'newDebt',
                                        'oldDebt',
                                        'minus',
                                        'plus'
                                    ) 
                                    values (
                                            ${res.data.customerDebt[0].id},
                                            '${res.data.customerDebt[0].customerId}', 
                                           '${res.data.customerDebt[0].createdDate}', 
                                           '${res.data.customerDebt[0].title}', 
                                           '${res.data.customerDebt[0].newDebt}', 
                                           '${res.data.customerDebt[0].oldDebt}', 
                                           '${res.data.customerDebt[0].minus}', 
                                            ${res.data.customerDebt[0].plus}
                                        )
                                    `;

                        tx.executeSql(strSqlDebt);

                        tx.executeSql(
                            'select * from customers',
                            null,
                            (_, { rows: { _array } }) => {
                                dispatch({
                                    type: SUPPLIER_LIST_LOADED_SQLITE,
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
                    type: SUPPLIER_CHANGE_SUCCESS,
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
                        type: SUPPLIER_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo khách hàng thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: SUPPLIER_CHANGE_FAIL,
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
