import {
    ADD_CATEGORY, CATEGORY_PENDING, CATEGORY_CHANGE,
    CATEGORY_CHANGE_FAIL, CATEGORY_CHANGE_SUCCESS,
    ADD_FLASH_MESSAGE, SUCCESS_MESSAGE, ERROR_MESSAGE, 
    CATEGORY_LOADED_SQLITE, CATEGORY_DELETE_SUCCESS
} from './index';
import { URL } from '../../env';
import axios from 'axios';
import { NewCategoryValidator } from '../validators';
import { AsyncStorage } from 'react-native';
import { SQLite } from 'expo';
import SqlService from '../database/sqliteService';
const db = SQLite.openDatabase("SERP1.1.0.db", "1.1", "SERP Database", 200000);
import { Actions } from 'react-native-router-flux';

export const loadCategoriesDataFromSqlite = () => async (dispatch) => {
    dispatch({
        type: CATEGORY_PENDING
    });
    SqlService.select('categories', '*').then(
        result => {
            dispatch({
                type: CATEGORY_LOADED_SQLITE,
                payload: result
            });
        }
    );
};

export const CategoryChange = ({ prop, value }) => ({
    type: CATEGORY_CHANGE,
    payload: { prop, value }
});

export const CategoryDelete = (categoryId) => async (dispatch) => {
    dispatch({
        type: CATEGORY_PENDING
    });

    const apiUrl = `${URL}/api/category/delete`;

    axios.post(apiUrl, { Id: categoryId }).then(
        (res) => {
            //Dữ liệu đã được lưu thành công trên server,
            //Tiến hàng lưu dữ liệu lên sqlite cho mục đích offline
            db.transaction(
                tx => {
                    tx.executeSql(`
                        UPDATE dataVersions 
                        SET categories = '${res.data.dataversion[0].categories}'                  
                        WHERE id = '1';
                    `);
                    tx.executeSql(
                        `DELETE FROM categories 
                        WHERE id = '${categoryId}';`
                    )
                    tx.executeSql(`select * from categories`,
                        null,
                        (_, { rows: { _array } }) => {
                            dispatch({
                                type: CATEGORY_LOADED_SQLITE,
                                payload: _array
                            });
                        },
                        (e) => {
                            console.log('error = ', e)
                        }
                    );
                },
                err => console.log('Đã có lỗi: ', err),
                null
            );
            Actions.categoryList();
            dispatch({
                type: CATEGORY_DELETE_SUCCESS
            });
            dispatch({
                type: ADD_FLASH_MESSAGE,
                payload: { message: 'Bạn đã tạo nhóm sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
            });
            alert('Bạn đã lưu dữ liệu thành công');
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
            alert(`Lưu dữ liệu thất bại: ${err}`);
        }
        );
};

export const CategoryUpdate = (category, isImageChanged) => async (dispatch) => {
    dispatch({
        type: CATEGORY_PENDING
    });
    const { isValid, errors } = NewCategoryValidator(category);
    if (!isValid) {
        dispatch({
            type: CATEGORY_CHANGE_FAIL,
            payload: errors
        });
        alert(`Lưu dữ liệu thất bại: ${errors}`);
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
                                () => {
                                    console.log('success')
                                },
                                (e) => {
                                    console.log('lỗi update dataVersions = ', e)
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
                                () => {
                                    console.log('success')
                                },
                                (e) => {
                                    console.log('lỗi update categories = ', e)
                                }
                            );
                            tx.executeSql(`select * from categories`,
                                null,
                                (_, { rows: { _array } }) => {
                                    dispatch({
                                        type: CATEGORY_LOADED_SQLITE,
                                        payload: _array
                                    });
                                },
                                (e) => {
                                    console.log('error = ', e)
                                }
                            );
                        },
                        (e) => console.log('error ?????', e),
                        console.log('success ????')
                    );
                }
                catch (e) {
                    console.log(e);
                }

                dispatch({
                    type: CATEGORY_CHANGE_SUCCESS,
                    payload: res.data.category[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo nhóm sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
                });
                alert('Bạn đã lưu dữ liệu thành công');
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
                alert(`Lưu dữ liệu thất bại: ${err}`);
            }
            );
    }
};

export const AddNewCategory = (category) => async (dispatch) => {
    dispatch({
        type: CATEGORY_PENDING
    });
    const { isValid, errors } = NewCategoryValidator(category);
    if (!isValid) {
        dispatch({
            type: CATEGORY_CHANGE_FAIL,
            payload: errors
        });
        alert(`Lưu dữ liệu thất bại: ${errors}`);
    } else {
        const apiUrl = `${URL}/api/category/new`;
        const formData = new FormData();
        console.log('category.ImageUrl = ', category.ImageUrl);
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
                        console.log('res.data.category[0].imageUrl = ', res.data.category[0].imageUrl.length);
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
                            `select * from categories`,
                            null,
                            (_, { rows: { _array } }) => {
                                dispatch({
                                    type: CATEGORY_LOADED_SQLITE,
                                    payload: _array
                                });
                            },
                            (e) => {
                                console.log('error read categories data from sqlite = ', e)
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
                alert('Bạn đã lưu dữ liệu thành công');
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
                alert(`Lưu dữ liệu thất bại: ${err}`);
            }
            );
    }
};
