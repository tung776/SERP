import {
    ADD_PAYMENT_CUSTOMER, PAYMENT_CUSTOMER_PENDING, PAYMENT_CUSTOMER_CHANGE_FAIL,
    PAYMENT_CUSTOMER_CHANGE_SUCCESS, PAYMENT_CUSTOMER_CHANGE,
    PAYMENT_CUSTOMER_LOADED_SERVER, PAYMENT_CUSTOMER_LIST_LOADED_SERVER, PAYMENT_CUSTOMER_DELETE_SUCCESS,
    RESET_PAYMENT_CUSTOMER_FORM, PAYMENT_CUSTOMER_DETAIL_CHANGE,
} from '../actions/types';
import moment from '../utils/moment';

const INITIAL_STATE = {
    id: '',
    customerId: '',
    createdDate: '',
    title: '',
    newDebt: '',
    oldDebt: '',
    pay: '',
    loading: false,
    loaded: false,
    error: '',
    isSave: false,
    paymentSupplierList: []
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PAYMENT_CUSTOMER_PENDING:
            return { ...state, loading: true, loaded: false, error: '' };
        case RESET_PAYMENT_CUSTOMER_FORM:
            return {
                ...state,
                isSave: false,
                customerId: '',
                createdDate: '',
                title: '',
                error: ''
            };
        case PAYMENT_CUSTOMER_CHANGE:
            return { ...state, isSave: false, [action.payload.prop]: action.payload.value };
        case PAYMENT_CUSTOMER_LIST_LOADED_SERVER: {
            const paymentSupplierList = [];

            if (action.payload) {
                action.payload.forEach((payment) => {
                    const temp = { ...payment, key: payment.id }
                    paymentSupplierList.push(temp);
                })
                return {
                    ...state,
                    paymentSupplierList,
                    loading: false,
                    loaded: true
                }
            }
            return {
                ...state,
                paymentSupplierList: null,
                loading: false,
                loaded: true
            }
        }        

        case PAYMENT_CUSTOMER_LOADED_SERVER:
            console.log('action.payload.paymentSupplier = ', action.payload.paymentSupplier);
            return {
                ...state,
                isSave: false,
                id: action.payload.paymentSupplier[0].id,
                customerId: action.payload.paymentSupplier[0].customerId,
                createdDate: action.payload.paymentSupplier[0].createdDate,
                title: action.payload.paymentSupplier[0].title,
                debtSupplierId: action.payload.paymentSupplier[0].debtSupplierId,
                newDebt: action.payload.paymentSupplier[0].newDebt,
                oldDebt: action.payload.paymentSupplier[0].oldDebt,
                pay: action.payload.paymentSupplier[0].amount,
                error: '',
                loading: false,
                loaded: true
            };
        case PAYMENT_CUSTOMER_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false, isSave: false };
        case ADD_PAYMENT_CUSTOMER:
            return {
                ...state,
                isSave: true,
                id: action.payload.paymentSupplier[0].id,
                error: '',
                loading: false,
            };
        case PAYMENT_CUSTOMER_CHANGE_SUCCESS:
            return {
                ...state,
                isSave: true,
                error: '',
                loading: false,
            };
        case PAYMENT_CUSTOMER_DELETE_SUCCESS:
            return {
                ...state,
                id: "",
                customerId: '',
                createdDate: '',
                title: '',
                error: '',
                loading: false,
            };
        
        default:
            return state;
    }
};
