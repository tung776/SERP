// import firebase from 'firebase';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { 
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER_PENDING,
    LOGIN_FORM_CHANGED,
    SET_CURRENT_USER,
    ADD_FLASH_MESSAGE,
    ERROR_MESSAGE,
    WARNING_MESSAGE,
    SUCCESS_MESSAGE
 } from './index';
import {URL} from '../../env';
import {setAuthorizationToken} from '../../Shared/utils';
import {LoginValidator} from '../../Shared/validators';
// import jwt from 'jsonwebtoken';
import {AsyncStorage} from 'react-native';
import { SetCurrentUser} from './index';


export const loginUser = (user)=> {
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
            axios.post(`${URL}/api/users/login`, user)
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

                    // localStorage.setItem('jwtToken', token);
                     AsyncStorage.setItem('jwtToken', token)
                    setAuthorizationToken(token);

                    dispatch(SetCurrentUser( user ));
                    
                     Actions.main();  
                }
            )
            .catch(
                err => {
                    console.log("err = ", err);
                    if(err.response) {
                        dispatch({
                            type: LOGIN_USER_FAIL,
                            payload: err.response.data.error
                        })
                        dispatch({
                            type: ADD_FLASH_MESSAGE,
                            payload: { message: `Đăng nhập thất bại: ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE}
                        })
                    }
                    else {
                        dispatch({
                            type: LOGIN_USER_FAIL,
                            payload: err
                        })
                        dispatch({
                            type: ADD_FLASH_MESSAGE,
                            payload: { message: `Đăng nhập thất bại: ${err}`, TypeMessage: ERROR_MESSAGE}
                        })
                    }
                }
            )
        }
        
    }
}
const loginUserSuccess = (dispatch, user) => {
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: user
    });

    Actions.main();
}

const loginUserFail = (dispatch, err)=> {
    dispatch({
        type: LOGIN_USER_FAIL,
        payload: `Lỗi đăng nhập: ${err}`
    })
}