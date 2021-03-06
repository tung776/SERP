import { combineReducers } from 'redux';
import SignupFormReducer from '../../Shared/reducers/SignupFormReducer';
import FlashMessageReducer from '../../Shared/reducers/flashMessageReducer';
import LoginFormReducer from '../../Shared/reducers/LoginFormReducer';
import AuthReducer from '../../Shared/reducers/authReducer';
import categoryReducer from '../../Shared/reducers/categoryReducer';
import menuReducer from './menuReducer';
import productReducer from '../../Shared/reducers/productReducer';
import customerGroups from '../../Shared/reducers/customerGroupReducer';
import customers from '../../Shared/reducers/customerReducer';
import quoctes from '../../Shared/reducers/quocteReducer';
import saleOrders from '../../Shared/reducers/saleOrderReducer';
import paymentCustomerReducer from '../../Shared/reducers/paymentCustomerReducer';
import suppliers from '../../Shared/reducers/supplierReducer';
import purchaseOrders from '../../Shared/reducers/purchaseOrderReducer';
import paymentSupplierReducer from '../../Shared/reducers/paymentSupplierReducer';
import formulationsReducer from '../../Shared/reducers/formulationReducer';

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
    customerGroups: customerGroups,
    customers: customers,
    quoctes: quoctes,
    saleOrders: saleOrders,
    paymentCustomer: paymentCustomerReducer,
    suppliers: suppliers,
    purchaseOrders: purchaseOrders,
    paymentSupplier: paymentSupplierReducer,
    formulations: formulationsReducer,

});
export default reducers;
