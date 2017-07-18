import {
    ADD_CATEGORY, CATEGORY_PENDING,
    CATEGORY_CHANGE_FAIL, CATEGORY_CHANGE_SUCCESS,
    ADD_FLASH_MESSAGE, SUCCESS_MESSAGE, ERROR_MESSAGE
} from './index';
import { URL } from '../../env';
import axios from 'axios';
import { NewCategoryValidator } from '../validators';
import { AsyncStorage } from 'react-native';

export const AddNewCategory = (category, uri) => async (dispatch) => {
    dispatch({
        type: CATEGORY_PENDING
    });
    const { isValid, errors } = NewCategoryValidator(category);
    if (!isValid) {
        dispatch({
            type: CATEGORY_CHANGE_FAIL,
            payload: errors
        });
    } else {
        const apiUrl = `${URL}/api/category/new`;
        const formData = new FormData();
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        console.log(apiUrl, uriParts, fileType)
        formData.append('categoryImage', {
            uri,
            name: `category.${fileType}`,
            filename: `category.${fileType}`,
            type: `image/${fileType}`,            
        });

        formData.append('category', JSON.stringify(category));
        // formData.append('Description', category.Description);
        console.log("formData = ", formData);
        const options = {
            headers: {
                Accept: 'application/json',
                // 'Content-Type': 'multipart/form-data',
            },
        };

        axios.post(apiUrl, formData).then(
            res => {
                dispatch({
                    type: CATEGORY_CHANGE_SUCCESS,
                    payload: res.data
                });
                dispatch({
                    type: ADD_FLASH_MESSAGE,
                    payload: { message: 'Bạn đã tạo nhóm sản phẩm thành công', TypeMessage: SUCCESS_MESSAGE }
                });
            }
        ).catch(
            err => {
                console.log(err);
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
            }
            );
    }

}