import { combineReducers } from 'redux';
import SignupFormReducer from '../../Shared/reducers/SignupFormReducer';
import FlashMessageReducer from '../../Shared/reducers/flashMessageReducer';
import LoginFormReducer from '../../Shared/reducers/LoginFormReducer';
import AuthReducer from '../../Shared/reducers/authReducer';
import categoryReducer from '../../Shared/reducers/categoryReducer';
import menuReducer from './menuReducer';
import productReducer from '../../Shared/reducers/productReducer';

const reducers = combineReducers({
    main: () => null,
    flashMessage: FlashMessageReducer,
    signupForm: SignupFormReducer,
    loginForm: LoginFormReducer,
    auth: AuthReducer,
    newCategory: categoryReducer,
    userMenus: menuReducer,
    categories: categoryReducer,
    products: productReducer,

});
export default reducers;
