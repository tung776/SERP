import axios from 'axios';
import { 
    LOGIN_USER_FAIL,
    LOGIN_USER_PENDING,
    LOGIN_USER_SUCCESS,
    LOGIN_FORM_CHANGED,
    ADD_FLASH_MESSAGE,
    SUCCESS_MESSAGE,
    WARNING_MESSAGE,
    ERROR_MESSAGE,
    SET_CURRENT_USER
 } from './types';
import { browserHistory } from 'react-router';
import {LoginValidator} from '../../validators';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwt from 'jsonwebtoken';

export const LoginFormChanged = ({prop, value}) => {
    return {
        type: LOGIN_FORM_CHANGED,
        payload: {prop, value}
    }
}

export const SetCurrentUser = (user) => {
    return {
        type: SET_CURRENT_USER,
        payload: user
    }
}

export const LoginFormSubmit = (user) => {
    console.log("user = ", user);
    return (dispatch) => {
        dispatch({
            type: LOGIN_USER_PENDING
        });

        const {errors, isValid} = LoginValidator(user);
        if(!isValid) {
            dispatch ({
                type: LOGIN_USER_FAIL,
                payload: errors
            })
        } else {
            axios.post('/api/users/login', user)
            .then(
                res => {
                    // console.log("res = ", res);
                    dispatch({
                        type: LOGIN_USER_SUCCESS,
                        payload: res.data
                    });
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: "Bạn đã đăng nhập thành công", TypeMessage: SUCCESS_MESSAGE }
                    });
                    const {token} = res.data;
                    localStorage.setItem('jwtToken', token);
                    setAuthorizationToken(token);
                    dispatch(setAuthorizationToken(jwt.decode(token)));
                    browserHistory.push('/');  
                }
            )
            .catch(
                err => {
                    console.log("err = ", err.response.data.error);
                    dispatch({
                        type: LOGIN_USER_FAIL,
                        payload: err.response.data.error
                    })
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: `Đăng nhập thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE}
                    })
                }
            )
        }
        
    }
}