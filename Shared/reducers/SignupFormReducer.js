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
    gender: '',
    role: '',
    phone: '',
    user: null,
    error: '',
    loading: false,
    message: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SIGNUPFORM_CHANGED:            
             const newState = { ...state, [action.payload.prop]: action.payload.value };
            return newState;        
        case SIGNUP_USER_PENDING:
            return { ...state, loading: true, error: '', message: '' };
        case SIGNUP_USER_FAIL:
            return { ...state, error: action.payload, loading: false, message: 'Tạo người dùng thất bại' };
        case SIGNUP_USER_SUCCESS:
            return { ...state, user: action.payload.user, message: 'Chúc mừng bạn đã tạo người thành công', error: '', loading: false };
        default:
            return state;
    }
};
