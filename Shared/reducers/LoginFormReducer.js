import {    
    LOGIN_FORM_CHANGED,
    LOGIN_USER_FAIL,
    LOGIN_USER_PENDING,
    LOGIN_USER_SUCCESS,
    LOGOUT_REQUEST
 } from '../actions/types';

const INITIAL_STATE = {
    identifier: '',
    password: '',
    loading: false,
    error: '',
    user: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOGIN_FORM_CHANGED:            
             const newState = { ...state, [action.payload.prop]: action.payload.value };
            return newState;        
        case LOGIN_USER_PENDING:
            return { ...state, loading: true, error: '' };
        case LOGIN_USER_FAIL:
            return { ...state, error: action.payload, loading: false };
        case LOGIN_USER_SUCCESS:
            return { ...state, user: action.payload.user, error: '', loading: false };
        case LOGOUT_REQUEST:
            return { ...state, user: null, error: '', loading: false, identifier: '', password: '' };
        default:
            return state;
    }
};
