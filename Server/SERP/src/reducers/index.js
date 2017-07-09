import {combineReducers} from 'redux';
import SignupFormReducer from './SignupFormReducer';
import FlashMessageReducer from './flashMessageReducer';

const reducers = combineReducers({
    main: ()=> null ,
    flashMessage: FlashMessageReducer,
    signupForm: SignupFormReducer
});
export default reducers;