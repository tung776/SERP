import {combineReducers} from 'redux';
import SignupFormReducer from './SignupFormReducer';
import FlashMessageReducer from '../../Shared/reducers/flashMessageReducer';
import LoginFormReducer from './LoginFormReducer';
import AuthReducer from '../../Shared/reducers/authReducer';

const reducers = combineReducers({
    main: ()=> null ,
    flashMessage: FlashMessageReducer,
    signupForm: SignupFormReducer,
    loginForm: LoginFormReducer,
    auth: AuthReducer

});
export default reducers;