import { Alert } from 'react-native';
import {
    PAYMENT_SUPPLIER_PENDING, PAYMENT_SUPPLIER_CHANGE,
    PAYMENT_SUPPLIER_CHANGE_FAIL, PAYMENT_SUPPLIER_CHANGE_SUCCESS,
    ADD_FLASH_MESSAGE, SUCCESS_MESSAGE, ERROR_MESSAGE,
    PAYMENT_SUPPLIER_LOADED_SERVER, PAYMENT_SUPPLIER_DELETE_SUCCESS,
    RESET_PAYMENT_SUPPLIER_FORM, PAYMENT_SUPPLIER_LIST_LOADED_SERVER,
    ADD_PAYMENT_SUPPLIER,
} from './index';
import { URL } from '../../env';
import axios from 'axios';
import { PaymentSupplierValidator } from '../validators';
import { AsyncStorage } from 'react-native';
import { SQLite } from 'expo';
import SqlService from '../database/sqliteService';
import { Actions } from 'react-native-router-flux';
import db from '../database/sqliteConfig';

export const loadPaymentSupplierListDataFromServerBySupplierId = (customerId) => async (dispatch) => {
    dispatch({
        type: PAYMENT_SUPPLIER_PENDING
    });

    axios.post(`${URL}/api/payment/getBySupplierId`, { customerId }).then(
        res => {
            dispatch({
                type: PAYMENT_SUPPLIER_LIST_LOADED_SERVER,
                payload: res.data.payment
            });
        }
    );
};

export const loadPaymentSupplierById = (paymentId) => async (dispatch) => {
    console.log('paymentId = ', paymentId);
    dispatch({
        type: PAYMENT_SUPPLIER_PENDING
    });

    axios.post(`${URL}/api/payment/getById`, { id: paymentId }).then(
        res => {
            dispatch({
                type: PAYMENT_SUPPLIER_LOADED_SERVER,
                payload: res.data
            });            
        }
    );
};

export const resetData = () => (dispatch) => {
    dispatch({
        type: RESET_PAYMENT_SUPPLIER_FORM
    });
};

export const PaymentSupplierChange = ({ prop, value }) => ({
    type: PAYMENT_SUPPLIER_CHANGE,
    payload: { prop, value }
});

export const PaymentSupplierDelete = (payment) => async (dispatch) => {
    dispatch({
        type: PAYMENT_SUPPLIER_PENDING
    });

    const apiUrl = `${URL}/api/payment/delete`;

    axios.post(apiUrl, payment).then(
        (res) => {
            //Dữ liệu đã được lưu thành công trên server,
            //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
            db.transaction(
                tx => {
                    tx => {
                        tx.executeSql(`UPDATE dataVersions 
                        SET debtSuppliers = '${res.data.dataversion[0].debtSuppliers}'                    
                        WHERE id = 1;`
                    );
                    tx.executeSql(`delete from debtSuppliers where id = ${payment.debtSupplierId}`);
                    const strSql = `insert into debtSuppliers 
                                (
                                    id,
                                    customerId,
                                    createdDate,
                                    title,
                                    newDebt,
                                    oldDebt,
                                    minus,
                                    plus
                                ) 
                                values (
                                        ${res.data.debtSuppliers[0].id},
                                        ${res.data.debtSuppliers[0].customerId}, 
                                        '${res.data.debtSuppliers[0].createdDate}', 
                                        '${res.data.debtSuppliers[0].title}', 
                                        ${res.data.debtSuppliers[0].newDebt}, 
                                        ${res.data.debtSuppliers[0].oldDebt},
                                        ${res.data.debtSuppliers[0].minus}, 
                                        ${res.data.debtSuppliers[0].plus}
                                    )
                                `;

                    tx.executeSql(strSql);
                },
                err => console.log('Đã có lỗi: ', err),
                null;
                });
            Actions.pop();
            dispatch({
                type: PAYMENT_SUPPLIER_DELETE_SUCCESS
            });
            dispatch({
                type: ADD_FLASH_MESSAGE,
                payload: { message: 'Bạn đã xóa Phiếu Thu thành công', TypeMessage: SUCCESS_MESSAGE }
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
                    type: PAYMENT_SUPPLIER_CHANGE_FAIL,
                    payload: err.response.data.error
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa Phiếu Thu thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                });
            } else {
                dispatch({
                    type: PAYMENT_SUPPLIER_CHANGE_FAIL,
                    payload: err
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa Phiếu Thu thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const PaymentSupplierUpdate = (payment) => async (dispatch) => {
    dispatch({
        type: PAYMENT_SUPPLIER_PENDING
    });
    const { isValid, errors } = PaymentSupplierValidator(payment);
    if (!isValid) {
        dispatch({
            type: PAYMENT_SUPPLIER_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/payment/update`;

        axios.post(apiUrl, payment).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                try {
                    db.transaction(
                        tx => {
                            tx.executeSql(`UPDATE dataVersions 
                            SET debtSuppliers = '${res.data.dataversion[0].debtSuppliers}'                    
                            WHERE id = 1;`
                            );
                        

                        tx.executeSql(`
                        update debtSuppliers 
                        set customerId = ${res.data.debtSuppliers[0].customerId},
                        createdDate = '${res.data.debtSuppliers[0].createdDate}',
                        title = '${res.data.debtSuppliers[0].title}',
                        newDebt = ${res.data.debtSuppliers[0].newDebt},
                        oldDebt = ${res.data.debtSuppliers[0].oldDebt},
                        minus = ${res.data.debtSuppliers[0].minus},
                        plus = ${res.data.debtSuppliers[0].plus}
                        where id = ${res.data.debtSuppliers[0].id} 
                        `,
                            null,
                            null,
                            (e) => {
                                console.log('lỗi update debtSuppliers = ', e);
                            }
                        );
                    })
                } catch (e) {
                    console.log(e);
                }
                dispatch({
                    type: PAYMENT_SUPPLIER_CHANGE_SUCCESS,
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã lưu Phiếu Thu thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: PAYMENT_SUPPLIER_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo Phiếu Thu thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: PAYMENT_SUPPLIER_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo Phiếu Thu thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const AddNewPaymentSupplier = (payment) => async (dispatch) => {
    dispatch({
        type: PAYMENT_SUPPLIER_PENDING
    });
    const { isValid, errors } = PaymentSupplierValidator(payment);
    if (!isValid) {
        dispatch({
            type: PAYMENT_SUPPLIER_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/payment/new`;

        axios.post(apiUrl, payment).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                db.transaction(
                    tx => {
                        tx.executeSql(`UPDATE dataVersions 
                            SET debtSuppliers = '${res.data.dataversion[0].debtSuppliers}'                    
                            WHERE id = 1;`
                        );
                        tx.executeSql(`delete from debtSuppliers where id = ${payment.debtSupplierId}`);
                        const strSql = `insert into debtSuppliers 
                                    (
                                        id,
                                        customerId,
                                        createdDate,
                                        title,
                                        newDebt,
                                        oldDebt,
                                        minus,
                                        plus
                                    ) 
                                    values (
                                            ${res.data.debtSuppliers[0].id},
                                            ${res.data.debtSuppliers[0].customerId}, 
                                            '${res.data.debtSuppliers[0].createdDate}', 
                                            '${res.data.debtSuppliers[0].title}', 
                                            ${res.data.debtSuppliers[0].newDebt}, 
                                            ${res.data.debtSuppliers[0].oldDebt},
                                            ${res.data.debtSuppliers[0].minus}, 
                                            ${res.data.debtSuppliers[0].plus}
                                        )
                                    `;

                        tx.executeSql(strSql);
                    },
                    (e) => console.log('Lỗi update sqlite: ', e),
                    null
                );

                dispatch({
                    type: ADD_PAYMENT_SUPPLIER,
                    payload: res.data
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo Phiếu Thu thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: PAYMENT_SUPPLIER_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo Phiếu Thu thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: PAYMENT_SUPPLIER_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo Phiếu Thu thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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
