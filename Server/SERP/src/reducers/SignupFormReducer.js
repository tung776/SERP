import {    
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER_PENDING,
    SIGNUPFORM_CHANGED
 } from '../actions/types';

const INITIAL_STATE = {
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    gender: "",
    role: '',
    phone: "",
    user: null,
    error: '',
    loading: false
}

export default (state = INITIAL_STATE, action)=> {
    switch (action.type) {
        case SIGNUPFORM_CHANGED:            
             const newState = {...state, [action.payload.prop]: action.payload.value };
            return newState;        
        case LOGIN_USER_PENDING:
            return {...state, loading: true, error: ''}
        case LOGIN_USER_FAIL:
            return {...state, error: action.payload, password: '', email: '', username: '', passwordConfirm: '', loading: false}
        case LOGIN_USER_SUCCESS:
            return {...state, user: action.payload, error: '', loading: false}
        default:
            return state;
    }

}