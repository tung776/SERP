import axios from 'axios';
import { 
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAIL,
    SIGNUP_USER_PENDING,
    SIGNUPFORM_CHANGED
 } from './types';
import validateInput from '../../validators/SignupValidator';

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
         axios.post('/api/users/signup', user)
        .then(
            data => {
                dispatch({
                    type: SIGNUP_USER_SUCCESS,
                    payload: data
                })
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

export const validateSignup = (data)=> {
    const {errors, isValid} = validateInput(data);
    if(!isValid) {
        return {
            type: SIGNUP_USER_FAIL,
            payload: errors
        }
    }
}