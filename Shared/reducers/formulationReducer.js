import {
    ADD_FORMULATION, FORMULATION_PENDING, FORMULATION_CHANGE_FAIL,
    FORMULATION_CHANGE_SUCCESS, FORMULATION_CHANGE, LOAD_TAX_SUCCESS,
    FORMULATION_LOADED_SERVER, FORMULATION_LIST_LOADED_SERVER, FORMULATION_DELETE_SUCCESS,
    RESET_FORMULATION_FORM, FORMULATION_DETAIL_CHANGE, SELECTED_PRODUCT_TO_FORMULATION_DETAIL
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
    formulationDetails: [],
    formulationList: [],
    units: [],
    loading: false,
    loaded: false,
    error: '',
    isSave: false,
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FORMULATION_PENDING:
            return { ...state, loading: true, error: '' };
        case RESET_FORMULATION_FORM:
            return {
                ...state,
                isSave: false,
                customerId: '',
                date: '',
                title: '',
                taxId: 0,
                formulationDetails: [],
                error: ''
            };
        case FORMULATION_CHANGE:
            return { ...state, isSave: false, [action.payload.prop]: action.payload.value };
        case FORMULATION_LIST_LOADED_SERVER: {
            const formulationList = [];

            if (action.payload) {
                action.payload.forEach((formulation) => {
                    const temp = { ...formulation, key: formulation.id }
                    formulationList.push(temp);
                })
                return {
                    ...state,
                    formulationList,
                    loading: false,
                    loaded: true
                }
            }
            return {
                ...state,
                formulationList: null,
                loading: false,
                loaded: true
            }
        }
        case SELECTED_PRODUCT_TO_FORMULATION_DETAIL: {
            return {
                ...state,
                formulationDetails: action.payload
            };
        }

        case FORMULATION_LOADED_SERVER:
            let formulationDetails = [];
            action.payload.formulationDetails.forEach((item) => {
                formulationDetails.push({
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
                id: action.payload.formulation[0].id,
                customerId: action.payload.formulation[0].customerId,
                date: action.payload.formulation[0].date,
                title: action.payload.formulation[0].title,
                total: action.payload.formulation[0].total,
                totalIncludeVat: action.payload.formulation[0].totalIncludeVat,
                vat: action.payload.formulation[0].vat,
                taxId: action.payload.formulation[0].taxId,
                debtCustomerId: action.payload.formulation[0].debtCustomerId,
                newDebt: action.payload.formulation[0].newDebt,
                oldDebt: action.payload.formulation[0].oldDebt,
                pay: action.payload.formulation[0].minus,
                formulationDetails: formulationDetails,
                error: '',
                loading: false,
                loaded: true
            };
        case FORMULATION_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false, isSave: false };
        case ADD_FORMULATION:
            return {
                ...state,
                isSave: true,
                id: action.payload.formulation[0].id,
                error: '',
                loading: false,
            };
        case FORMULATION_CHANGE_SUCCESS:
            return {
                ...state,
                isSave: true,
                error: '',
                loading: false,
            };
        case FORMULATION_DELETE_SUCCESS:
            return {
                ...state,
                id: "",
                customerId: '',
                date: '',
                title: '',
                formulationDetails: [],
                error: '',
                loading: false,
            };
        case LOAD_TAX_SUCCESS:
            return { ...state, tax: action.payload };
        default:
            return state;
    }
};
