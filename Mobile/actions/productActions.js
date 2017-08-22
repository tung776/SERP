import { URL } from '../../env';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { ProductFormValidator } from '../validators';
import { AsyncStorage, Alert } from 'react-native';
import SqlService from '../database/sqliteService';
import {
    PRODUCT_LOADED_SQLITE,
    PRODUCT_LIST_LOADED_SQLITE,
    PRODUCT_PENDING,
    PRODUCT_CHANGE,
    RESET_PRODUCT_FORM,
    PRODUCT_CHANGE_SUCCESS,
    PRODUCT_DELETE_SUCCESS,
    LOAD_TYPE_CARGO_SUCCESS,
    LOAD_UNIT_SUCCESS,
    PRODUCT_CHANGE_FAIL,
    ADD_FLASH_MESSAGE,
    ERROR_MESSAGE,
    SUCCESS_MESSAGE,
    TOGGLE_PRODUCT_TO_SELECT_LIST,
    RESET_SELECTED_PRODUCT
} from './index';
import db from '../database/sqliteConfig';

export const resetData = (selectedProducts) => async (dispatch) => {
    dispatch({
        type: RESET_PRODUCT_FORM,
        payload: { selectedProducts }
    });
};
export const resetSelectedProducts = () => async (dispatch) => {
    dispatch({
        type: RESET_SELECTED_PRODUCT
    });
};
export const toggleProductToSelectList = (product) => async (dispatch) => {
    dispatch({
        type: TOGGLE_PRODUCT_TO_SELECT_LIST,
        payload: product
    });
};

export const loadTypeCargo = () => async (dispatch) => {
    SqlService.query('select * from typeCargoes').then(
        result => {
            console.log('result = ', result);
            dispatch({
                type: LOAD_TYPE_CARGO_SUCCESS,
                payload: result
            });
        }
    );
};
export const loadUnits = () => async (dispatch) => {
    SqlService.query('select * from units').then(
        result => {
            dispatch({
                type: LOAD_UNIT_SUCCESS,
                payload: result
            });
        }
    );
};

export const ProductChange = ({ prop, value }) => ({
    type: PRODUCT_CHANGE,
    payload: { prop, value }
});
export const loadProductListDataFromSqlite = (categoryId) => async (dispatch) => {
    dispatch({
        type: PRODUCT_PENDING
    });

    SqlService.query(`select * from products where categoryId = ${categoryId}`).then(
        result => {
            const products = [];
            result.forEach((item) => {
                const convertedData = { ...item, key: item.id, quantity: 0 };
                products.push(convertedData);
            });
            dispatch({
                type: PRODUCT_LIST_LOADED_SQLITE,
                payload: products
            });
        }
    );
};

export const loadProductByIdFromSqlite = (productId) => async (dispatch) => {
    /**
     * Phương thức này sẽ load sản phẩm dựa trên id của sản phẩm được cung cấp
     */

    dispatch({
        type: PRODUCT_PENDING
    });
    
    SqlService.query(`select * from products where id = ${productId}`).then(
        result => {
            dispatch({
                type: PRODUCT_LOADED_SQLITE,
                payload: result[0]
            });
        }
    );
};

export const loadProductByNameFromSqlite = (name) => (dispatch) => {
    /*
        Phương thức này sẽ trả về danh sách các sản phẩm có tên gần nhất với tên sản phẩm được cung cấp
    */
    dispatch({
        type: PRODUCT_PENDING
    });
    SqlService.query(`select * from products where name like '%${name}%'`).then(
        result => {
            dispatch({
                type: PRODUCT_LIST_LOADED_SQLITE,
                payload: result
            });
        }
    );
};

export const ProductDelete = (productId) => async (dispatch) => {
    dispatch({
        type: PRODUCT_PENDING
    });

    const apiUrl = `${URL}/api/product/delete`;

    axios.post(apiUrl, { Id: productId }).then(
        (res) => {
            //Dữ liệu đã được lưu thành công trên server,
            //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
            db.transaction(
                tx => {
                    tx.executeSql(`
                        UPDATE dataVersions 
                        SET products = '${res.data.dataversion[0].products}'                  
                        WHERE id = '1';
                    `);
                    tx.executeSql(
                        `DELETE FROM products 
                        WHERE id = '${productId}';`
                    );
                    tx.executeSql('select * from products',
                        null,
                        (_, { rows: { _array } }) => {
                            dispatch({
                                type: PRODUCT_LIST_LOADED_SQLITE,
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
            Actions.productList();
            dispatch({
                type: PRODUCT_DELETE_SUCCESS
            });
            dispatch({
                type: ADD_FLASH_MESSAGE,
                payload: { message: 'Bạn đã tạo sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
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
                    type: PRODUCT_CHANGE_FAIL,
                    payload: err.response.data.error
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Tạo sản phẩm thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                });
            } else {
                dispatch({
                    type: PRODUCT_CHANGE_FAIL,
                    payload: err
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Tạo sản phẩm thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const ProductUpdate = (product) => async (dispatch) => {
    dispatch({
        type: PRODUCT_PENDING
    });
    const { isValid, errors } = ProductFormValidator(product);
    if (!isValid) {
        dispatch({
            type: PRODUCT_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/product/update`;        

        axios.post(apiUrl, product).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                try {
                    db.transaction(
                        tx => {
                            tx.executeSql(`
                                update dataVersions 
                                set products = ${res.data.dataversion[0].products} 
                                where id = 1`,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update dataVersions = ', e);
                                }
                            );
                            tx.executeSql(`
                                update products 
                                set 
                                    unitId = ${res.data.product[0].unitId},
                                    typeCargoId = ${res.data.product[0].typeCargoId},
                                    categoryId = ${res.data.product[0].categoryId},
                                    isAvaiable = '${res.data.product[0].isAvaiable}',
                                    isPublic = '${res.data.product[0].isPublic}',
                                    purchasePrice = ${res.data.product[0].purchasePrice},
                                    salePrice = ${res.data.product[0].salePrice},
                                    name = '${res.data.product[0].name}', 
                                    description = '${res.data.product[0].description}', 
                                    minQuantity = '${res.data.product[0].minQuantity}'
                                where id = ${res.data.product[0].id}
                            `,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update products = ', e);
                                }
                            );
                            tx.executeSql('select * from products',
                                null,
                                (_, { rows: { _array } }) => {
                                    dispatch({
                                        type: PRODUCT_LIST_LOADED_SQLITE,
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
                Actions.categoryList();
                dispatch({
                    type: PRODUCT_CHANGE_SUCCESS,
                    payload: res.data.product[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: PRODUCT_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo sản phẩm thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: PRODUCT_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo sản phẩm thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const AddNewProduct = (product) => async (dispatch) => {
    const {
        CategoryId,
        UnitId,
        TypeCargoId,
        IsPublic,
        PurchasePrice,
        SalePrice,
        MinQuantity,
        IsAvaiable,
        Name,
        Description
        } = product
    dispatch({
        type: PRODUCT_PENDING
    });
    const { isValid, errors } = ProductFormValidator(product);
    if (!isValid) {
        dispatch({
            type: PRODUCT_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/product/new`;  
        axios.post(apiUrl, product).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                db.transaction(
                    tx => {
                        
                        tx.executeSql(`UPDATE dataVersions 
                            SET products = '${res.data.dataversion[0].products}'                    
                            WHERE id = 1;`
                        );
                        let strSql = `insert into products 
                                    (
                                        id, 
                                        unitId, 
                                        typeCargoId, 
                                        categoryId, 
                                        isAvaiable, 
                                        isPublic, 
                                        purchasePrice, 
                                        salePrice, 
                                        name, 
                                        description, 
                                        minQuantity
                                    ) 
                                    values (
                                        ${res.data.product[0].id},
                                        ${res.data.product[0].unitId},
                                        ${res.data.product[0].typeCargoId},
                                        ${res.data.product[0].categoryId},
                                        '${res.data.product[0].isAvaiable}',
                                        '${res.data.product[0].isPublic}',
                                        ${res.data.product[0].purchasePrice},
                                        ${res.data.product[0].salePrice},
                                        '${res.data.product[0].name}', 
                                        '${res.data.product[0].description}', 
                                        ${res.data.product[0].minQuantity}
                                    )
                                    `;

                        tx.executeSql(strSql);
                        
                        tx.executeSql(
                            'select * from products',
                            null,
                            (_, { rows: { _array } }) => {
                                dispatch({
                                    type: PRODUCT_LIST_LOADED_SQLITE,
                                    payload: _array
                                });
                            },
                            (e) => {
                                console.log('error read products data from sqlite = ', e);
                            }
                        );
                    },
                    (e) => console.log('Lỗi update sqlite: ', e),
                    null
                );

                dispatch({
                    type: PRODUCT_CHANGE_SUCCESS,
                    payload: res.data.product[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: PRODUCT_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo sản phẩm thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: PRODUCT_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo sản phẩm thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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
