import axios from 'axios';
import { 
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER_PENDING,
    SIGNUPFORM_CHANGED
 } from './types';

export const SignupFormChanged = ({prop, value}) => {
    return {
        type: SIGNUPFORM_CHANGED,
        payload: {prop, value}
    }
}