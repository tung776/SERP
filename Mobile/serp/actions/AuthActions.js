// import firebase from 'firebase';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import { 
    EMAIL_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER_PENDING
 } from './types';
import {URL} from '../env';


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

export const loginUser = ({ email, password })=> {
    return (dispatch)=> {
        dispatch({
            type: LOGIN_USER_PENDING
        })
        axios.post(`${URL}/register`, {email, password})
        .then(function(res){
            console.log(res)
            // dispatch({
            //     type: LOGIN_USER_SUCCESS,
            //     payload: res.data
            // })
        })
        .catch(function(err){
            console.log(err);
            dispatch({
                type: LOGIN_USER_FAIL,
                payload: err
            })
        })
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