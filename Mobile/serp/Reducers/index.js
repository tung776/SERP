import {combineReducers} from 'redux';
import SignupFormReducer from './SignupFormReducer';
import FlashMessageReducer from './flashMessageReducer';
import LoginFormReducer from './LoginFormReducer';
import AuthReducer from './AuthReducer';

const reducers = combineReducers({
    main: ()=> null ,
    flashMessage: FlashMessageReducer,
    signupForm: SignupFormReducer,
    loginForm: LoginFormReducer,
    auth: AuthReducer

});
export default reducers;