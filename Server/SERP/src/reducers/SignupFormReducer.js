import {    
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAIL,
    SIGNUP_USER_PENDING,
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
        case SIGNUP_USER_PENDING:
            return {...state, loading: true, error: ''}
        case SIGNUP_USER_FAIL:
            return {...state, error: action.payload, loading: false}
        case SIGNUP_USER_SUCCESS:
            return {...state, user: action.payload, error: '', loading: false}
        default:
            return state;
    }

}