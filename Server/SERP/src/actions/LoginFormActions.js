import axios from 'axios';
import { 
    LOGIN_USER_FAIL,
    LOGIN_USER_PENDING,
    LOGIN_USER_SUCCESS,
    LOGIN_FORM_CHANGED,
    ADD_FLASH_MESSAGE,
    SUCCESS_MESSAGE,
    WARNING_MESSAGE,
    ERROR_MESSAGE
 } from './types';
import { browserHistory } from 'react-router';

export const SignupFormChanged = ({prop, value}) => {
    return {
        type: LOGIN_FORM_CHANGED,
        payload: {prop, value}
    }
}