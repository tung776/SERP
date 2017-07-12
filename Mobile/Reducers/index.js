import {combineReducers} from 'redux';
import SignupFormReducer from '../../Shared/reducers/SignupFormReducer';
import FlashMessageReducer from '../../Shared/reducers/flashMessageReducer';
import LoginFormReducer from '../../Shared/reducers/LoginFormReducer';
import AuthReducer from '../../Shared/reducers/authReducer';

const reducers = combineReducers({
    main: ()=> null ,
    flashMessage: FlashMessageReducer,
    signupForm: SignupFormReducer,
    loginForm: LoginFormReducer,
    auth: AuthReducer

});
export default reducers;