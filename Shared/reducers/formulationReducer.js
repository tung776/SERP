import {
    ADD_FORMULATION, FORMULATION_PENDING, FORMULATION_CHANGE_FAIL,
    FORMULATION_CHANGE_SUCCESS, FORMULATION_CHANGE, 
    FORMULATION_LOADED_SERVER, FORMULATION_LIST_LOADED_SERVER, FORMULATION_DELETE_SUCCESS,
    RESET_FORMULATION_FORM, FORMULATION_DETAIL_CHANGE, SELECTED_PRODUCT_TO_FORMULATION_DETAIL
} from '../actions/types';
import moment from '../utils/moment';

const INITIAL_STATE = {
    id: '',
    productId: '',
    isActive: true,
    date: '',
    title: '',
    unitId: '',
    quantity: 0,
    totalPrice: 0,
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
                productId: '',
                date: '',
                title: '',
                unitId: '',
                quantity: 0,
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
                    quantity: item.quantity,
                    isActive: item.isActive,
                    unitId: item.unitId,
                    key: item.id
                });
            });
            return {
                ...state,
                isSave: false,
                id: action.payload.formulation[0].id,
                productId: action.payload.formulation[0].productId,
                date: action.payload.formulation[0].date,
                isActive: action.payload.formulation[0].isActive,
                title: action.payload.formulation[0].title,
                quantity: action.payload.formulation[0].quantity,
                unitId: action.payload.formulation[0].unitId,
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
                productId: '',
                date: '',
                title: '',
                isActive: true,
                quantity: 0,
                unitId: '',
                formulationDetails: [],
                error: '',
                loading: false,
            };
        
        default:
            return state;
    }
};
