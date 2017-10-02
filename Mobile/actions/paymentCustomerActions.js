import { Alert } from 'react-native';
import {
    PAYMENT_CUSTOMER_PENDING, PAYMENT_CUSTOMER_CHANGE,
    PAYMENT_CUSTOMER_CHANGE_FAIL, PAYMENT_CUSTOMER_CHANGE_SUCCESS,
    ADD_FLASH_MESSAGE, SUCCESS_MESSAGE, ERROR_MESSAGE,
    PAYMENT_CUSTOMER_LOADED_SERVER, PAYMENT_CUSTOMER_DELETE_SUCCESS,
    RESET_PAYMENT_CUSTOMER_FORM, PAYMENT_CUSTOMER_LIST_LOADED_SERVER,
    ADD_PAYMENT_CUSTOMER,
} from './index';
import { URL } from '../../env';
import axios from 'axios';
import { NewPaymentCustomerValidator } from '../validators';
import { AsyncStorage } from 'react-native';
import { SQLite } from 'expo';
import SqlService from '../database/sqliteService';
import { Actions } from 'react-native-router-flux';
import db from '../database/sqliteConfig';

export const loadPaymentCustomerListDataFromServerByCustomerId = (customerId) => async (dispatch) => {
    dispatch({
        type: PAYMENT_CUSTOMER_PENDING
    });

    axios.post(`${URL}/api/payment/getByCustomerId`, { customerId }).then(
        res => {
            dispatch({
                type: PAYMENT_CUSTOMER_LIST_LOADED_SERVER,
                payload: res.data.payment
            });
        }
    );
};

export const loadPaymentCustomerById = (paymentId) => async (dispatch) => {
    dispatch({
        type: PAYMENT_CUSTOMER_PENDING
    });

    axios.post(`${URL}/api/payment/getById`, { paymentId }).then(
        res => {
            console.log('res = ', res.data);
            dispatch({
                type: PAYMENT_CUSTOMER_LOADED_SERVER,
                payload: res.data
            });            
        }
    );
};

export const resetData = () => (dispatch) => {
    dispatch({
        type: RESET_PAYMENT_CUSTOMER_FORM
    });
};

export const PaymentCustomerChange = ({ prop, value }) => ({
    type: PAYMENT_CUSTOMER_CHANGE,
    payload: { prop, value }
});

export const PaymentCustomerDelete = (payment) => async (dispatch) => {
    dispatch({
        type: PAYMENT_CUSTOMER_PENDING
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
                        SET debtCustomers = '${res.data.dataversion[0].debtCustomers}'                    
                        WHERE id = 1;`
                    );
                    tx.executeSql(`delete from debtCustomers where id = ${payment.debtCustomerId}`);
                    const strSql = `insert into debtCustomers 
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
                                        ${res.data.debtCustomers[0].id},
                                        ${res.data.debtCustomers[0].customerId}, 
                                        '${res.data.debtCustomers[0].createdDate}', 
                                        '${res.data.debtCustomers[0].title}', 
                                        ${res.data.debtCustomers[0].newDebt}, 
                                        ${res.data.debtCustomers[0].oldDebt},
                                        ${res.data.debtCustomers[0].minus}, 
                                        ${res.data.debtCustomers[0].plus}
                                    )
                                `;

                    tx.executeSql(strSql);
                },
                err => console.log('Đã có lỗi: ', err),
                null;
                });
            Actions.pop();
            dispatch({
                type: PAYMENT_CUSTOMER_DELETE_SUCCESS
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
                    type: PAYMENT_CUSTOMER_CHANGE_FAIL,
                    payload: err.response.data.error
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa Phiếu Thu thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                });
            } else {
                dispatch({
                    type: PAYMENT_CUSTOMER_CHANGE_FAIL,
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

export const PaymentCustomerUpdate = (payment) => async (dispatch) => {
    dispatch({
        type: PAYMENT_CUSTOMER_PENDING
    });
    const { isValid, errors } = NewPaymentCustomerValidator(payment);
    if (!isValid) {
        dispatch({
            type: PAYMENT_CUSTOMER_CHANGE_FAIL,
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
                            SET debtCustomers = '${res.data.dataversion[0].debtCustomers}'                    
                            WHERE id = 1;`
                            );
                        

                        tx.executeSql(`
                        update debtCustomers 
                        set customerId = ${res.data.debtCustomers[0].customerId},
                        createdDate = '${res.data.debtCustomers[0].createdDate}',
                        title = '${res.data.debtCustomers[0].title}',
                        newDebt = ${res.data.debtCustomers[0].newDebt},
                        oldDebt = ${res.data.debtCustomers[0].oldDebt},
                        minus = ${res.data.debtCustomers[0].minus},
                        plus = ${res.data.debtCustomers[0].plus}
                        where id = ${res.data.debtCustomers[0].id} 
                        `,
                            null,
                            null,
                            (e) => {
                                console.log('lỗi update debtCustomers = ', e);
                            }
                        );
                    })
                } catch (e) {
                    console.log(e);
                }
                dispatch({
                    type: PAYMENT_CUSTOMER_CHANGE_SUCCESS,
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
                        type: PAYMENT_CUSTOMER_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo Phiếu Thu thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: PAYMENT_CUSTOMER_CHANGE_FAIL,
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

export const AddNewPaymentCustomer = (payment) => async (dispatch) => {
    dispatch({
        type: PAYMENT_CUSTOMER_PENDING
    });
    const { isValid, errors } = NewPaymentCustomerValidator(payment);
    if (!isValid) {
        dispatch({
            type: PAYMENT_CUSTOMER_CHANGE_FAIL,
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
                            SET debtCustomers = '${res.data.dataversion[0].debtCustomers}'                    
                            WHERE id = 1;`
                        );
                        tx.executeSql(`delete from debtCustomers where id = ${payment.debtCustomerId}`);
                        const strSql = `insert into debtCustomers 
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
                                            ${res.data.debtCustomers[0].id},
                                            ${res.data.debtCustomers[0].customerId}, 
                                            '${res.data.debtCustomers[0].createdDate}', 
                                            '${res.data.debtCustomers[0].title}', 
                                            ${res.data.debtCustomers[0].newDebt}, 
                                            ${res.data.debtCustomers[0].oldDebt},
                                            ${res.data.debtCustomers[0].minus}, 
                                            ${res.data.debtCustomers[0].plus}
                                        )
                                    `;

                        tx.executeSql(strSql);
                    },
                    (e) => console.log('Lỗi update sqlite: ', e),
                    null
                );

                dispatch({
                    type: ADD_PAYMENT_CUSTOMER,
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
                        type: PAYMENT_CUSTOMER_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo Phiếu Thu thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: PAYMENT_CUSTOMER_CHANGE_FAIL,
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
