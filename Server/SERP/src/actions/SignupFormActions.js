import axios from 'axios';
import { 
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAIL,
    SIGNUP_USER_PENDING,
    SIGNUPFORM_CHANGED
 } from './types';
import validateInput from '../../validators/SignupValidator';
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
         const {errors, isValid} = validateInput(user);
        if(!isValid) {
            dispatch ({
                type: SIGNUP_USER_FAIL,
                payload: errors
            })
        } else {
            axios.post('/api/users/signup', user)
            .then(
                data => {
                    dispatch({
                        type: SIGNUP_USER_SUCCESS,
                        payload: data
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
