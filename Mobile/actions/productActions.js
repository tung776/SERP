import { URL } from '../../env';
import axios from 'axios';
import { NewCategoryValidator } from '../validators';
import { AsyncStorage } from 'react-native';
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
    LOAD_UNIT_SUCCESS
} from './index';
import db from '../database/sqliteConfig';

export const resetData = () => async (dispatch) => {
    dispatch({
        type: RESET_PRODUCT_FORM
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
    // db.transaction(
    //     tx=> {
    //         tx.executeSql('select * from typeCargoes')
    //     }
    // )
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
    console.log('begin load product list from sqlite, categoryId =', categoryId);

    SqlService.query(`select * from products where categoryId = ${categoryId}`).then(
        result => {
            console.log('result = ', result);
            const products = [];
            result.forEach((item) => {
                const convertedData = { ...item, key: item.id };
                products.push(convertedData);
            });
            console.log('products = ', products);
            dispatch({
                type: PRODUCT_LIST_LOADED_SQLITE,
                payload: products
            });
        }
    );
};

export const loadProductByIdFromSqlite = (productId) => async (dispatch) => {
    dispatch({
        type: PRODUCT_PENDING
    });
    SqlService.query(`select * from products where id = ${productId}`).then(
        result => {
            dispatch({
                type: PRODUCT_LOADED_SQLITE,
                payload: result
            });
        }
    );
};


export const CategoryDelete = (productId) => async (dispatch) => {
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
                payload: { message: 'Bạn đã tạo nhóm sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
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
                    type: CATEGORY_CHANGE_FAIL,
                    payload: err.response.data.error
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Tạo nhóm sản phẩm thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                });
            } else {
                dispatch({
                    type: CATEGORY_CHANGE_FAIL,
                    payload: err
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: `Tạo nhóm sản phẩm thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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

export const ProductUpdate = (category, isImageChanged) => async (dispatch) => {
    dispatch({
        type: CATEGORY_PENDING
    });
    const { isValid, errors } = NewCategoryValidator(category);
    if (!isValid) {
        dispatch({
            type: CATEGORY_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/category/update`;
        const formData = new FormData();

        if (isImageChanged) {
            const uriParts = category.ImageUrl.split('.');
            const fileType = uriParts[uriParts.length - 1];

            formData.append('categoryImage', {
                uri: category.ImageUrl,
                name: `category.${fileType}`,
                filename: `category.${fileType}`,
                type: `image/${fileType}`,
            });
        }

        formData.append('category', JSON.stringify(category));
        const options = {
            headers: {
                Accept: 'application/json',
            },
        };

        axios.post(apiUrl, formData).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                try {
                    db.transaction(
                        tx => {
                            tx.executeSql(`
                            update dataVersions 
                            set categories = ${res.data.dataversion[0].categories} 
                            where id = 1`,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update dataVersions = ', e);
                                }
                            );
                            tx.executeSql(`
                            update categories 
                            set name = '${res.data.category[0].name}',
                            description = '${res.data.category[0].description}',
                            imageUrl = '${res.data.category[0].imageUrl}' 
                            where id = ${res.data.category[0].id}
                            `,
                                null,
                                null,
                                (e) => {
                                    console.log('lỗi update categories = ', e);
                                }
                            );
                            tx.executeSql('select * from categories',
                                null,
                                (_, { rows: { _array } }) => {
                                    dispatch({
                                        type: CATEGORY_LOADED_SQLITE,
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
                }                catch (e) {
                    console.log(e);
                }
                Actions.categoryList();
                dispatch({
                    type: CATEGORY_CHANGE_SUCCESS,
                    payload: res.data.category[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo nhóm sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: CATEGORY_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nhóm sản phẩm thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: CATEGORY_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nhóm sản phẩm thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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
    dispatch({
        type: CATEGORY_PENDING
    });
    const { isValid, errors } = NewCategoryValidator(category);
    if (!isValid) {
        dispatch({
            type: CATEGORY_CHANGE_FAIL,
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
        const apiUrl = `${URL}/api/category/new`;
        const formData = new FormData();
        if (category.ImageUrl != '' && category.ImageUrl != undefined) {
            const uriParts = category.ImageUrl.split('.');
            const fileType = uriParts[uriParts.length - 1];
            formData.append('categoryImage', {
                uri: category.ImageUrl,
                name: `category.${fileType}`,
                filename: `category.${fileType}`,
                type: `image/${fileType}`,
            });
        }

        formData.append('category', JSON.stringify(category));
        const options = {
            headers: {
                Accept: 'application/json',
            },
        };

        axios.post(apiUrl, formData).then(
            (res) => {
                //Dữ liệu đã được lưu thành công trên server,
                //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
                db.transaction(
                    tx => {
                        tx.executeSql(`UPDATE dataVersions 
                            SET categories = '${res.data.dataversion[0].categories}'                    
                            WHERE id = 1;`
                        );
                        let strSql = '';

                        if (res.data.category[0].imageUrl.length > 1) {
                            strSql = `insert into categories 
                                    (id, name, description, imageUrl) 
                                    values (
                                        ${res.data.category[0].id},
                                        '${res.data.category[0].name}', 
                                        '${res.data.category[0].description}', 
                                        '${res.data.category[0].imageUrl}'
                                    )
                                    `;
                        } else {
                            strSql = `insert into categories 
                                    (id, name, description) 
                                    values (
                                            ${res.data.category[0].id},
                                           ' ${res.data.category[0].name}', 
                                            '${res.data.category[0].description}'
                                        )
                                    `;
                        }
                        tx.executeSql(strSql);
                        tx.executeSql(
                            'select * from categories',
                            null,
                            (_, { rows: { _array } }) => {
                                dispatch({
                                    type: CATEGORY_LOADED_SQLITE,
                                    payload: _array
                                });
                            },
                            (e) => {
                                console.log('error read categories data from sqlite = ', e);
                            }
                        );
                    },
                    (e) => console.log('Lỗi update sqlite: ', e),
                    null
                );

                dispatch({
                    type: CATEGORY_CHANGE_SUCCESS,
                    payload: res.data.category[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo nhóm sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
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
                        type: CATEGORY_CHANGE_FAIL,
                        payload: err.response.data.error
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nhóm sản phẩm thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE }
                    });
                } else {
                    dispatch({
                        type: CATEGORY_CHANGE_FAIL,
                        payload: err
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Tạo nhóm sản phẩm thất bại: ${err}`, TypeMessage: ERROR_MESSAGE }
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
