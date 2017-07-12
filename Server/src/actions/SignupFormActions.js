import axios from 'axios';
import { 
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAIL,
    SIGNUP_USER_PENDING,
    SIGNUPFORM_CHANGED,
    ADD_FLASH_MESSAGE,
    SUCCESS_MESSAGE,
    WARNING_MESSAGE,
    ERROR_MESSAGE
 } from './index';
import {SignupValidator} from '../../../Shared/validators';
import { browserHistory } from 'react-router';

export const SignupFormChanged = ({prop, value}) => {
    return {
        type: SIGNUPFORM_CHANGED,
        payload: {prop, value}
    }
}

export const SignupFormSubmit = (user) => {
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
            axios.post('/api/users/signup', user)
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
                    browserHistory.push('/');                    
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
