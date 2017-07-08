import {combineReducers} from 'redux';
import SignupFormReducer from './SignupFormReducer';

const reducers = combineReducers({
    signupForm: SignupFormReducer
});
export default reducers;