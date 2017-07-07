import { EMAIL_CHANGED, 
    PASSWORD_CHANGED,
    LOGIN_USER_FAIL,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_PENDING
 } from '../actions/types';

const INITIAL_STATE = { 
    email: '',
    password: '',
    user: null,
    error: '',
    loading: false
}

export default (state = INITIAL_STATE, action)=> {
    switch (action.type) {
        case EMAIL_CHANGED:            
            return {...state, email: action.payload}
        case PASSWORD_CHANGED:
            return {...state, password: action.payload}
        case LOGIN_USER_PENDING:
            return {...state, loading: true, error: ''}
        case LOGIN_USER_FAIL:
            return {...state, error: action.payload, password: '', email: '', loading: false}
        case LOGIN_USER_SUCCESS:
            return {...state, user: action.payload, password: '', email: '', error: '', loading: false}
        default:
            return state;
    }

}