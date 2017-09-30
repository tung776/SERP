import {
    ADD_SALE_ORDER, SALE_ORDER_PENDING, SALE_ORDER_CHANGE_FAIL,
    SALE_ORDER_CHANGE_SUCCESS, SALE_ORDER_CHANGE, LOAD_TAX_SUCCESS,
    SALE_ORDER_LOADED_SERVER, SALE_ORDER_LIST_LOADED_SERVER, SALE_ORDER_DELETE_SUCCESS,
    RESET_SALE_ORDER_FORM, SALE_ORDER_DETAIL_CHANGE, SELECTED_PRODUCT_TO_SALE_ORDER_DETAIL
} from '../actions/types';
import moment from '../utils/moment';

const INITIAL_STATE = {
    id: '',
    customerId: '',
    date: '',
    title: '',
    total: '',
    totalIncludeVat: '',
    vat: '',
    tax:'',
    taxId: 0,
    newDebt: '',
    oldDebt: '',
    pay: '',
    saleOrderDetails: [],
    saleOrderList: [],
    units: [],
    loading: false,
    loaded: false,
    error: '',
    isSave: false,
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SALE_ORDER_PENDING:
            return { ...state, loading: true, error: '' };
        case RESET_SALE_ORDER_FORM:
            return {
                ...state,
                isSave: false,
                customerId: '',
                date: '',
                title: '',
                taxId: 0,
                saleOrderDetails: [],
                error: ''
            };
        case SALE_ORDER_CHANGE:
            return { ...state, isSave: false, [action.payload.prop]: action.payload.value };
        case SALE_ORDER_LIST_LOADED_SERVER: {
            const saleOrderList = [];

            if (action.payload) {
                action.payload.forEach((order) => {
                    const temp = { ...order, key: order.id }
                    saleOrderList.push(temp);
                })
                return {
                    ...state,
                    saleOrderList,
                    loading: false,
                    loaded: true
                }
            }
            return {
                ...state,
                saleOrderList: null,
                loading: false,
                loaded: true
            }
        }
        case SELECTED_PRODUCT_TO_SALE_ORDER_DETAIL: {
            return {
                ...state,
                saleOrderDetails: action.payload
            };
        }

        case SALE_ORDER_LOADED_SERVER:
            let saleOrderDetails = [];
            action.payload.saleOrderDetails.forEach((item) => {
                saleOrderDetails.push({
                    id: item.id,
                    unitId: item.unitId,
                    productId: item.productId,
                    salePrice: item.salePrice,
                    quantity: item.quantity,
                    name: item.name,
                    key: item.id
                });
            });
            return {
                ...state,
                isSave: false,
                id: action.payload.saleOrder[0].id,
                customerId: action.payload.saleOrder[0].customerId,
                date: action.payload.saleOrder[0].date,
                title: action.payload.saleOrder[0].title,
                total: action.payload.saleOrder[0].total,
                totalIncludeVat: action.payload.saleOrder[0].totalIncludeVat,
                vat: action.payload.saleOrder[0].vat,
                taxId: action.payload.saleOrder[0].taxId,
                debtCustomerId: action.payload.saleOrder[0].debtCustomerId,
                newDebt: action.payload.saleOrder[0].newDebt,
                oldDebt: action.payload.saleOrder[0].oldDebt,
                pay: action.payload.saleOrder[0].minus,
                saleOrderDetails: saleOrderDetails,
                error: '',
                loading: false,
                loaded: true
            };
        case SALE_ORDER_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false, isSave: false };
        case ADD_SALE_ORDER:
            return {
                ...state,
                isSave: true,
                id: action.payload.saleOrder[0].id,
                error: '',
                loading: false,
            };
        case SALE_ORDER_CHANGE_SUCCESS:
            return {
                ...state,
                isSave: true,
                error: '',
                loading: false,
            };
        case SALE_ORDER_DELETE_SUCCESS:
            return {
                ...state,
                id: "",
                customerId: '',
                date: '',
                title: '',
                saleOrderDetails: [],
                error: '',
                loading: false,
            };
        case LOAD_TAX_SUCCESS:
            return { ...state, tax: action.payload };
        default:
            return state;
    }
};
