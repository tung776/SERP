import { combineReducers } from 'redux';
import SignupFormReducer from './SignupFormReducer';
import FlashMessageReducer from './flashMessageReducer';
import LoginFormReducer from './LoginFormReducer';
import AuthReducer from './authReducer';
import categoryReducer from './categoryReducer';
import paymentCustomerReducer from './paymentCustomerReducer';

const reducers = combineReducers({
    main: () => null,
    flashMessage: FlashMessageReducer,
    signupForm: SignupFormReducer,
    loginForm: LoginFormReducer,
    auth: AuthReducer,
    newCategory: categoryReducer,
    paymentCustomer: paymentCustomerReducer,

});
export default reducers;
