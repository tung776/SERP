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
    paymentCustomerList: []
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PAYMENT_CUSTOMER_PENDING:
            return { ...state, loading: true, error: '' };
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
            const paymentCustomerList = [];

            if (action.payload) {
                action.payload.forEach((payment) => {
                    const temp = { ...payment, key: payment.id }
                    paymentCustomerList.push(temp);
                })
                return {
                    ...state,
                    paymentCustomerList,
                    loading: false,
                    loaded: true
                }
            }
            return {
                ...state,
                paymentCustomerList: null,
                loading: false,
                loaded: true
            }
        }        

        case PAYMENT_CUSTOMER_LOADED_SERVER:
            
            return {
                ...state,
                isSave: false,
                id: action.payload.paymentCustomer[0].id,
                customerId: action.payload.paymentCustomer[0].customerId,
                createdDate: action.payload.paymentCustomer[0].createdDate,
                title: action.payload.paymentCustomer[0].title,
                debtCustomerId: action.payload.paymentCustomer[0].debtCustomerId,
                newDebt: action.payload.paymentCustomer[0].newDebt,
                oldDebt: action.payload.paymentCustomer[0].oldDebt,
                pay: action.payload.paymentCustomer[0].minus,
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
                id: action.payload.paymentCustomer[0].id,
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
