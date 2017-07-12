// import firebase from 'firebase';
import axios from 'axios';
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
    SUCCESS_MESSAGE,
    LOGOUT_REQUEST,  

    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAIL,
    SIGNUP_USER_PENDING,
    SIGNUPFORM_CHANGED,
 } from './types';
import {URL} from '../../env';
import {LoginValidator} from '../validators';
import {setAuthorizationToken} from '../utils/setAuthorizationToken';
import {SignupValidator} from '../validators';

export const loginUser = (url, user, callback)=> {
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
            console.log("begin post data = ", `${URL}/api/users/login`);
            axios.post(url, user)
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
                     
                    setAuthorizationToken(token);

                    dispatch(SetCurrentUser( user ));

                    callback(token);

                    // AsyncStorage.setItem('jwtToken', token)
                    //  Actions.main();  
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

export const logout = (callback) => {
    return dispatch => {
        
        setAuthorizationToken(false);
        dispatch(SetCurrentUser({}));
        dispatch({
            type: LOGOUT_REQUEST
        });

        callback();
    }
}

const loginUserSuccess = (dispatch, user, callback) => {
    dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: user
    });

    // Actions.main();
    callback();
}



export const SetCurrentUser = (user) => {
    return {
        type: SET_CURRENT_USER,
        payload: user
    }
}


export const emailChanged = (text)=> {
    return {
        type: EMAIL_CHANGED,
        payload: text
    }
}
export const passwordChanged = (text)=> {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    }
}

export const LoginFormChanged = ({prop, value}) => {
    return {
        type: LOGIN_FORM_CHANGED,
        payload: {prop, value}
    }
}


const loginUserFail = (dispatch, err)=> {
    dispatch({
        type: LOGIN_USER_FAIL,
        payload: `Lỗi đăng nhập: ${err}`
    })
}

//==================== Sign up ===========================================================================

export const SignupFormChanged = ({prop, value}) => {
    return {
        type: SIGNUPFORM_CHANGED,
        payload: {prop, value}
    }
}

export const SignupFormSubmit = (url, user, callback) => {
    // console.log(user);
     return (dispatch)=> {
         dispatch({
             type: SIGNUP_USER_PENDING
         });
         const {errors, isValid} = SignupValidator(user);
        if(!isValid) {
            dispatch ({
                type: SIGNUP_USER_FAIL,
                payload: errors
            })
        } else {
            axios.post(url, user)
            .then(
                res => {
                    dispatch({
                        type: SIGNUP_USER_SUCCESS,
                        payload: res.data
                    })
                    dispatch({
                        type: ADD_FLASH_MESSAGE,
                        payload: { message: "Chúc mừng bạn đã tạo người dùng thành công", TypeMessage: SUCCESS_MESSAGE}
                    })                 
                    callback();                   
                }
            )
            .catch(
                err=> {
                    // console.log("err = ", err);
                    dispatch({
                        type: SIGNUP_USER_FAIL,
                        payload: err.response.data
                    })
            });
        }         
     }
     
}