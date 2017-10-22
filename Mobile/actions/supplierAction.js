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
    await SqlService.query('select * from suppliers').then(
        result => {
            dispatch({
                type: SUPPLIER_LIST_LOADED_SQLITE,
                payload: result
            });
        }
    );
};
export const loadDebtSuppliersFromSqlite = (supplierId) => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
    });
    await SqlService.query(`select * from debtSuppliers where supplierId = ${supplierId}`).then(
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
    SqlService.query(`select * from suppliers where name like '%${name}%'`).then(
        result => {
            console.log('loadSupplierByNameFromSqlite result = ', result);
            dispatch({
                type: SUPPLIER_LIST_LOADED_SQLITE,
                payload: result
            });
        }
    );
};

export const loadSupplierDataFromSqlite = (supplierId) => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
    });

    SqlService.query(`select * from suppliers where id = ${supplierId}`).then(
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

export const SupplierDelete = (supplierId) => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
    });

    const apiUrl = `${URL}/api/supplier/delete`;

    axios.post(apiUrl, { Id: supplierId }).then(
        (res) => {
            //Dữ liệu đã được lưu thành công trên server,
            //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
            db.transaction(
                tx => {
                    tx.executeSql(`
                        UPDATE dataVersions 
                        SET suppliers = '${res.data.dataversion[0].suppliers}'                  
                        WHERE id = '1';
                    `);
                    tx.executeSql(
                        `DELETE FROM suppliers 
                        WHERE id = '${supplierId}';`
                    );
                    tx.executeSql('select * from suppliers',
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

export const SupplierUpdate = (supplier) => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
    });
    const { isValid, errors } = NewSupplierValidator(supplier);
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
        const apiUrl = `${URL}/api/supplier/update`;

        axios.post(apiUrl, supplier).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                try {
                    db.transaction(
                        tx => {
                            tx.executeSql(`
                            update dataVersions 
                            set suppliers = ${res.data.dataversion[0].suppliers} 
                            where id = 1`,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update dataVersions = ', e);
                                }
                            );

                            tx.executeSql(`
                            update suppliers 
                            set name = '${res.data.supplier[0].name}',
                            phone = '${res.data.supplier[0].phone}',
                            email = '${res.data.supplier[0].email}',
                            curentDebt = '${res.data.supplier[0].curentDebt}',
                            overdue = ${res.data.supplier[0].overdue},
                            excessDebt = ${res.data.supplier[0].excessDebt},
                            companyName = '${res.data.supplier[0].companyName}',
                            companyAdress = '${res.data.supplier[0].companyAdress}',
                            directorName = '${res.data.supplier[0].directorName}',
                            bankNumber = '${res.data.supplier[0].bankNumber}',
                            bankName = '${res.data.supplier[0].bankName}',
                            taxCode = '${res.data.supplier[0].taxCode}',
                            fax = '${res.data.supplier[0].fax}'
                            where id = ${res.data.supplier[0].id}
                            `,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update suppliers = ', e);
                                }
                            );
                            console.log('res.data.supplierDebt =', res.data.supplierDebt);
                            tx.executeSql(`
                            update debtSuppliers 
                            set supplierId = ${res.data.supplierDebt.supplierId},
                            createdDate = '${res.data.supplierDebt.createdDate}',
                            title = '${res.data.supplierDebt.title}',
                            newDebt = ${res.data.supplierDebt.newDebt},
                            oldDebt = ${res.data.supplierDebt.oldDebt},
                            minus = ${res.data.supplierDebt.minus},
                            plus = ${res.data.supplierDebt.plus}
                            where id = ${res.data.supplierDebt.id} 
                            `,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update debtSuppliers = ', e);
                                }
                            );


                            tx.executeSql('select * from suppliers',
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
                    payload: res.data.supplier[0]
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

export const AddNewSupplier = (supplier) => async (dispatch) => {
    dispatch({
        type: SUPPLIER_PENDING
    });
    const { isValid, errors } = NewSupplierValidator(supplier);
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
        const apiUrl = `${URL}/api/supplier/new`;

        axios.post(apiUrl, supplier).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                db.transaction(
                    tx => {
                        tx.executeSql(`UPDATE dataVersions 
                            SET suppliers = '${res.data.dataversion[0].suppliers}'                    
                            WHERE id = 1;`
                        );
                        const strSql = `insert into suppliers 
                                    (
                                        id,
                                        name,
                                        address,
                                        phone,
                                        email,
                                        curentDebt,
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
                                            ${res.data.supplier[0].id},
                                           '${res.data.supplier[0].name}', 
                                           '${res.data.supplier[0].address}', 
                                           '${res.data.supplier[0].phone}', 
                                           '${res.data.supplier[0].email}', 
                                           '${res.data.supplier[0].curentDebt}', 
                                            ${res.data.supplier[0].overdue}, 
                                            ${res.data.supplier[0].excessDebt}, 
                                           '${res.data.supplier[0].companyName}', 
                                           '${res.data.supplier[0].companyAdress}', 
                                           '${res.data.supplier[0].directorName}', 
                                           '${res.data.supplier[0].bankNumber}', 
                                           '${res.data.supplier[0].bankName}', 
                                           '${res.data.supplier[0].taxCode}', 
                                            '${res.data.supplier[0].fax}'
                                        )
                                    `;

                        tx.executeSql(strSql);
                        const strSqlDebt = `insert into debtSuppliers 
                                    (
                                        'id',
                                        'supplierId',
                                        'createdDate',
                                        'title',
                                        'newDebt',
                                        'oldDebt',
                                        'minus',
                                        'plus'
                                    ) 
                                    values (
                                            ${res.data.supplierDebt[0].id},
                                            '${res.data.supplierDebt[0].supplierId}', 
                                           '${res.data.supplierDebt[0].createdDate}', 
                                           '${res.data.supplierDebt[0].title}', 
                                           '${res.data.supplierDebt[0].newDebt}', 
                                           '${res.data.supplierDebt[0].oldDebt}', 
                                           '${res.data.supplierDebt[0].minus}', 
                                            ${res.data.supplierDebt[0].plus}
                                        )
                                    `;

                        tx.executeSql(strSqlDebt);

                        tx.executeSql(
                            'select * from suppliers',
                            null,
                            (_, { rows: { _array } }) => {
                                dispatch({
                                    type: SUPPLIER_LIST_LOADED_SQLITE,
                                    payload: _array
                                });
                            },
                            (e) => {
                                console.log('error read suppliers data from sqlite = ', e);
                            }
                        );
                    },
                    (e) => console.log('Lỗi update sqlite: ', e),
                    null
                );

                dispatch({
                    type: SUPPLIER_CHANGE_SUCCESS,
                    payload: res.data.supplier[0]
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
