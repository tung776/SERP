import {
    ADD_SALE_ORDER, SALE_ORDER_PENDING, SALE_ORDER_CHANGE_FAIL,
    SALE_ORDER_CHANGE_SUCCESS, SALE_ORDER_CHANGE,
    SALE_ORDER_LOADED_SQLITE, SALE_ORDER_LIST_LOADED_SQLITE, SALE_ORDER_DELETE_SUCCESS,
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
    newDebt:'',
    oldDebt: '',
    pay: '',
    saleOrderDetails: [],
    saleOrderList: [],
    loading: false,
    loaded: false,
    error: '',
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SALE_ORDER_PENDING:
            return { ...state, loading: true, error: '' };
        case RESET_SALE_ORDER_FORM:
            return {
                ...state,
                customerId: '',
                date: '',
                title: '',
                saleOrderDetails: [],
                error: ''
            };
        case SALE_ORDER_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case SALE_ORDER_LIST_LOADED_SQLITE: {
            const saleOrderList = [];
            
            if (action.payload) {
                action.payload.forEach((order) => {
                    const temp = {...order, key: order.id}
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

        case SALE_ORDER_LOADED_SQLITE:
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
            const date = moment(action.payload.saleOrder[0].date, 'YYYY-MM-DD').toDate();
            console.log(date);
            return {
                ...state,
                id: action.payload.saleOrder[0].id,
                customerId: action.payload.saleOrder[0].customerId,
                date,
                title: action.payload.saleOrder[0].title,
                total: action.payload.saleOrder[0].total,
                totalIncludeVat: action.payload.saleOrder[0].totalIncludeVat,
                vat: action.payload.saleOrder[0].vat,
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
            return { ...state, error: action.payload, loading: false };
        case SALE_ORDER_CHANGE_SUCCESS:
            return {
                ...state,
                id: action.payload.saleOrder[0].id,
                customerId: '',
                date: '',
                title: '',
                saleOrderDetails: [],
                error: '',
                loading: false,
            };
        case SALE_ORDER_DELETE_SUCCESS:
            return {
                ...state,
                error: '',
                loading: false,
            };
        default:
            return state;
    }
}
    ;
