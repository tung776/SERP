import {combineReducers} from 'redux';
import SignupFormReducer from './SignupFormReducer';
import FlashMessageReducer from './flashMessageReducer';
import LoginFormReducer from './LoginFormReducer';

const reducers = combineReducers({
    main: ()=> null ,
    flashMessage: FlashMessageReducer,
    signupForm: SignupFormReducer,
    loginForm: LoginFormReducer
});
export default reducers;