import {
    ADD_CATEGORY, CATEGORY_PENDING, CATEGORY_CHANGE,
    CATEGORY_CHANGE_FAIL, CATEGORY_CHANGE_SUCCESS,
    ADD_FLASH_MESSAGE, SUCCESS_MESSAGE, ERROR_MESSAGE, CATEGORY_LOADED_SQLITE
} from './index';
import { URL } from '../../env';
import axios from 'axios';
import { NewCategoryValidator } from '../validators';
import { AsyncStorage } from 'react-native';

import SqlService from '../database/sqliteService';

export const loadCategoriesDataFromSqlite = () => async (dispatch) => {
    dispatch({
        type: CATEGORY_PENDING
    });
    await SqlService.select('categories', '*').then(
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
            debugger;
            SqlService.query(
                `UPDATE dataVersions 
                    SET categories = '${res.data.dataversion[0].categories}',                    
                    WHERE id = 1;`
            );
            SqlService.query(
                `DELETE categories 
                WHERE id = ${categoryId};`
            )

            SqlService.select('categories', '*').then(
                result => {
                    dispatch({
                        type: CATEGORY_LOADED_SQLITE,
                        payload: result
                    });
                }
            );

            dispatch({
                type: CATEGORY_CHANGE_SUCCESS,
                payload: res.data.category[0]
            });
            dispatch({
                type: ADD_FLASH_MESSAGE,
                payload: { message: 'Bạn đã tạo nhóm sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
            });
            alert("Bạn đã lưu dữ liệu thành công");
        }
    ).catch(
        err => {
            console.log("error: ", err);
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

export const CategoryUpdate = (category) => async (dispatch) => {
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
        // console.log("ImageUrl = ", category.ImageUrl);

        const uriParts = category.ImageUrl.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('categoryImage', {
            uri: category.ImageUrl,
            name: `category.${fileType}`,
            filename: `category.${fileType}`,
            type: `image/${fileType}`,
        });

        formData.append('category', JSON.stringify(category));
        const options = {
            headers: {
                Accept: 'application/json',
            },
        };

        axios.post(apiUrl, formData).then(
            (res) => {
                debugger;
                // console.log("data = ", data);
                SqlService.query(
                    `UPDATE dataVersions 
                    SET categories = '${res.data.dataversion[0].categories}',                    
                    WHERE id = 1;`
                );
                SqlService.query(
                    `UPDATE categories 
                    SET name = '${res.data.category[0].name}',
                    description = '${res.data.category[0].description}' 
                    WHERE id = ${res.data.category[0].id};`
                )

                SqlService.select('categories', '*').then(
                    result => {
                        dispatch({
                            type: CATEGORY_LOADED_SQLITE,
                            payload: result
                        });
                    }
                );

                dispatch({
                    type: CATEGORY_CHANGE_SUCCESS,
                    payload: res.data.category[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo nhóm sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
                });
                alert("Bạn đã lưu dữ liệu thành công");
            }
        ).catch(
            err => {
                console.log("error: ", err);
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
}

export const AddNewCategory = (category) => async (dispatch) => {
    // console.log("categoru =", category);
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
        // console.log("ImageUrl = ", category.ImageUrl);

        const uriParts = category.ImageUrl.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('categoryImage', {
            uri: category.ImageUrl,
            name: `category.${fileType}`,
            filename: `category.${fileType}`,
            type: `image/${fileType}`,
        });

        formData.append('category', JSON.stringify(category));
        const options = {
            headers: {
                Accept: 'application/json',
            },
        };

        axios.post(apiUrl, formData).then(
            (res) => {
                debugger;
                // console.log("data = ", data);
                SqlService.query(
                    `UPDATE dataVersions 
                    SET categories = '${res.data.dataversion[0].categories}',                    
                    WHERE id = 1;`
                );
                SqlService.insert('categories', ['id', 'name', 'description'],
                    [res.data.category[0].id, res.data.category[0].name, res.data.category[0].description])


                SqlService.select('categories', '*').then(
                    result => {
                        dispatch({
                            type: CATEGORY_LOADED_SQLITE,
                            payload: result
                        });
                    }
                );

                dispatch({
                    type: CATEGORY_CHANGE_SUCCESS,
                    payload: res.data.category[0]
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo nhóm sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
                });
                alert("Bạn đã lưu dữ liệu thành công");
            }
        ).catch(
            err => {
                console.log("error: ", err);
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

}