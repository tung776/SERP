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
    SUCCESS_MESSAGE
 } from './types';
import {URL} from '../../env';
import {LoginValidator} from '../validators';

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