import {
    ADD_PURCHASE_ORDER, PURCHASE_ORDER_PENDING, PURCHASE_ORDER_CHANGE_FAIL,
    PURCHASE_ORDER_CHANGE_SUCCESS, PURCHASE_ORDER_CHANGE, LOAD_TAX_SUCCESS,
    PURCHASE_ORDER_LOADED_SERVER, PURCHASE_ORDER_LIST_LOADED_SERVER, PURCHASE_ORDER_DELETE_SUCCESS,
    RESET_PURCHASE_ORDER_FORM, PURCHASE_ORDER_DETAIL_CHANGE, SELECTED_PRODUCT_TO_PURCHASE_ORDER_DETAIL
} from '../actions/types';
import moment from '../utils/moment';

const INITIAL_STATE = {
    id: '',
    supplierId: '',
    date: '',
    total: '',
    totalIncludeVat: '',
    vat: '',
    tax:'',
    taxId: 0,
    newDebt: '',
    oldDebt: '',
    pay: '',
    purchaseOrderDetails: [],
    purchaseOrderList: [],
    units: [],
    loading: false,
    loaded: false,
    error: '',
    isSave: false,
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PURCHASE_ORDER_PENDING:
            return { ...state, loading: true, error: '' };
        case RESET_PURCHASE_ORDER_FORM:
            return {
                ...state,
                isSave: false,
                supplierId: '',
                date: '',
                taxId: 0,
                purchaseOrderDetails: [],
                error: ''
            };
        case PURCHASE_ORDER_CHANGE:
            return { ...state, isSave: false, [action.payload.prop]: action.payload.value };
        case PURCHASE_ORDER_LIST_LOADED_SERVER: {
            const purchaseOrderList = [];

            if (action.payload) {
                action.payload.forEach((order) => {
                    const temp = { ...order, key: order.id }
                    purchaseOrderList.push(temp);
                })
                return {
                    ...state,
                    purchaseOrderList,
                    loading: false,
                    loaded: true
                }
            }
            return {
                ...state,
                purchaseOrderList: null,
                loading: false,
                loaded: true
            }
        }
        case SELECTED_PRODUCT_TO_PURCHASE_ORDER_DETAIL: {
            return {
                ...state,
                purchaseOrderDetails: action.payload
            };
        }

        case PURCHASE_ORDER_LOADED_SERVER:
            let purchaseOrderDetails = [];
            action.payload.purchaseOrderDetails.forEach((item) => {
                purchaseOrderDetails.push({
                    id: item.id,
                    unitId: item.unitId,
                    productId: item.productId,
                    purchasePrice: item.purchasePrice,
                    quantity: item.quantity,
                    name: item.name,
                    key: item.id
                });
            });
            return {
                ...state,
                isSave: false,
                id: action.payload.purchaseOrder[0].id,
                supplierId: action.payload.purchaseOrder[0].supplierId,
                date: action.payload.purchaseOrder[0].date,
                total: action.payload.purchaseOrder[0].total,
                totalIncludeVat: action.payload.purchaseOrder[0].totalIncludeVat,
                vat: action.payload.purchaseOrder[0].vat,
                taxId: action.payload.purchaseOrder[0].taxId,
                debtSupplierId: action.payload.purchaseOrder[0].debtSupplierId,
                newDebt: action.payload.purchaseOrder[0].newDebt,
                oldDebt: action.payload.purchaseOrder[0].oldDebt,
                pay: action.payload.purchaseOrder[0].minus,
                purchaseOrderDetails: purchaseOrderDetails,
                error: '',
                loading: false,
                loaded: true
            };
        case PURCHASE_ORDER_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false, isSave: false };
        case ADD_PURCHASE_ORDER:
            return {
                ...state,
                isSave: true,
                id: action.payload.purchaseOrder[0].id,
                error: '',
                loading: false,
            };
        case PURCHASE_ORDER_CHANGE_SUCCESS:
            return {
                ...state,
                isSave: true,
                error: '',
                loading: false,
            };
        case PURCHASE_ORDER_DELETE_SUCCESS:
            return {
                ...state,
                id: "",
                supplierId: '',
                date: '',
                purchaseOrderDetails: [],
                error: '',
                loading: false,
            };
        case LOAD_TAX_SUCCESS:
            return { ...state, tax: action.payload };
        default:
            return state;
    }
};
