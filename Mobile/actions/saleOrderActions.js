import { Alert } from 'react-native';
import {
    SALE_ORDER_PENDING, SALE_ORDER_CHANGE,
    SALE_ORDER_CHANGE_FAIL, SALE_ORDER_CHANGE_SUCCESS,
    ADD_FLASH_MESSAGE, SUCCESS_MESSAGE, ERROR_MESSAGE,
    SALE_ORDER_LOADED_SQLITE, SALE_ORDER_DELETE_SUCCESS,
    RESET_SALE_ORDER_FORM, SALE_ORDER_LIST_LOADED_SQLITE,
    SALE_ORDER_DETAIL_CHANGE, RESET_PRODUCT_FORM, ADD_SALE_ORDER,
    LOAD_TAX_SUCCESS
} from './index';
import { URL } from '../../env';
import axios from 'axios';
import { NewSaleOrderValidator } from '../validators';
import { AsyncStorage } from 'react-native';
import { SQLite } from 'expo';
import SqlService from '../database/sqliteService';
import { Actions } from 'react-native-router-flux';
import db from '../database/sqliteConfig';

export const loadSaleOrderListDataFromServerByCustomerId = (customerId) => async (dispatch) => {
    dispatch({
        type: SALE_ORDER_PENDING
    });

    axios.post(`${URL}/api/order/getByCustomerId`, { customerId }).then(
        res => {
            dispatch({
                type: SALE_ORDER_LIST_LOADED_SQLITE,
                payload: res.data.orders
            });
        }
    );
};

export const loadSaleOrderByCustomerOrCustomerGroupIdFromServer = (customerId = null) => (dispatch) => {
    /*
        Phương thức này sẽ trả về danh sách các sản phẩm có tên gần nhất với tên sản phẩm được cung cấp
    */
    dispatch({
        type: SALE_ORDER_PENDING
    });
    let strSql = '';
    if (customerId !== null) {
        strSql = `select
         id, title, date, customerId, customerGroupId 
         from saleOrders 
         where id IN (
                    SELECT max(id) FROM saleOrders  
                    GROUP BY customerGroupId, customerId
                ) 
        and customerId = ${customerId}
         `;
    } else {
        strSql = `
        select id, title, date, customerId, customerGroupId 
        from saleOrders 
        where id IN (
                    SELECT max(id) FROM saleOrders  
                    GROUP BY customerGroupId, customerId
                ) 
        and customerGroupId = ${customerGroupId}
        `;
    }
    SqlService.query(strSql).then(
        result => {
            if (result[0]) {
                dispatch({
                    type: SALE_ORDER_LIST_LOADED_SQLITE,
                    payload: result[0]
                });
            } else {
                dispatch({
                    type: SALE_ORDER_LIST_LOADED_SQLITE,
                    payload: null
                });
            }
        }
    );
};

export const loadSaleOrderById = (orderId) => async (dispatch) => {
    dispatch({
        type: SALE_ORDER_PENDING
    });

    axios.post(`${URL}/api/order/getById`, { orderId }).then(
        res => {
            console.log('res = ', res.data);
            dispatch({
                type: SALE_ORDER_LOADED_SQLITE,
                payload: res.data
            });
            let selectedProducts = [];
            res.data.saleOrderDetails.forEach((item) => {
                
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
        type: RESET_SALE_ORDER_FORM
    });
    dispatch({
        type: RESET_PRODUCT_FORM,
        payload: { selectedProducts: null }
    });
};

export const SaleOrderChange = ({ prop, value }) => ({
    type: SALE_ORDER_CHANGE,
    payload: { prop, value }
});

export const SaleOrderDetailChange = ({ index, prop, value }) => ({
    type: SALE_ORDER_DETAIL_CHANGE,
    payload: { index, prop, value }
});


export const SaleOrderDelete = (order) => async (dispatch) => {
    dispatch({
        type: SALE_ORDER_PENDING
    });

    const apiUrl = `${URL}/api/order/delete`;

    axios.post(apiUrl, order).then(
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
                    tx.executeSql(`delete from debtCustomers where id = ${order.debtCustomerId}`);
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
                type: SALE_ORDER_DELETE_SUCCESS
            });
            dispatch({
                type: ADD_FLASH_MESSAGE,
                payload: { message: 'Bạn đã xóa hóa đơn bán thành công', TypeMessage: SUCCESS_MESSAGE }
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
                    type: SALE_ORDER_CHANGE_FAIL,
                    payload: err.response.data.error
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa hóa đơn bán thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                });
            } else {
                dispatch({
                    type: SALE_ORDER_CHANGE_FAIL,
                    payload: err
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Xóa hóa đơn bán thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const SaleOrderUpdate = (order) => async (dispatch) => {
    dispatch({
        type: SALE_ORDER_PENDING
    });
    const { isValid, errors } = NewSaleOrderValidator(order);
    if (!isValid) {
        dispatch({
            type: SALE_ORDER_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/order/update`;

        axios.post(apiUrl, order).then(
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
                    type: SALE_ORDER_CHANGE_SUCCESS,
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã lưu hóa đơn bán thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: SALE_ORDER_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo hóa đơn bán thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: SALE_ORDER_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo hóa đơn bán thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const AddNewSaleOrder = (order) => async (dispatch) => {
    dispatch({
        type: SALE_ORDER_PENDING
    });
    const { isValid, errors } = NewSaleOrderValidator(order);
    if (!isValid) {
        dispatch({
            type: SALE_ORDER_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/order/new`;

        axios.post(apiUrl, order).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                db.transaction(
                    tx => {
                        tx.executeSql(`UPDATE dataVersions 
                            SET debtCustomers = '${res.data.dataversion[0].debtCustomers}'                    
                            WHERE id = 1;`
                        );
                        tx.executeSql(`delete from debtCustomers where id = ${order.debtCustomerId}`);
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
                    type: ADD_SALE_ORDER,
                    payload: res.data
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo hóa đơn bán thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: SALE_ORDER_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo hóa đơn bán thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: SALE_ORDER_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo hóa đơn bán thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const loadTax = () => async (dispatch) => {
    SqlService.query('select * from tax').then(
        result => {
            dispatch({
                type: LOAD_TAX_SUCCESS,
                payload: result
            });
        }
    );
};
