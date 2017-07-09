import {combineReducers} from 'redux';
import SignupFormReducer from './SignupFormReducer';

const reducers = combineReducers({
    main: ()=> null ,
    signupForm: SignupFormReducer
});
export default reducers;