import {
    ADD_QUOCTE, QUOCTE_PENDING, QUOCTE_CHANGE_FAIL,
    QUOCTE_CHANGE_SUCCESS, QUOCTE_CHANGE,
    QUOCTE_LOADED_SQLITE, QUOCTE_LIST_LOADED_SQLITE, QUOCTE_DELETE_SUCCESS,
    RESET_QUOCTE_FORM, QUOCTE_DETAIL_CHANGE, SELECTED_PRODUCT_TO_QUOCTE_DETAIL
} from '../actions/types';

const INITIAL_STATE = {
    Id: '',
    customerId: '',
    customerGroupId: '',
    date: '',
    quocteDetails: [],
    loading: false,
    loaded: false,
    error: '',
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case QUOCTE_PENDING:
            return { ...state, loading: true, error: '' };
        case RESET_QUOCTE_FORM:
            return {
                ...state,
                customerId: '',
                customerGroupId: '',
                date: '',
                quocteDetails: [],
                error: ''
            };
        case QUOCTE_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case QUOCTE_LIST_LOADED_SQLITE: {
           
        }
        case QUOCTE_DETAIL_CHANGE: {
           
        }
        case SELECTED_PRODUCT_TO_QUOCTE_DETAIL: {
           return {
               ...state,
               quocteDetails: action.payload
           };
        }

        case QUOCTE_LOADED_SQLITE:
            return {
                ...state,
                
                error: '',
                loading: false,
                loaded: true
            };
        case QUOCTE_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false };
        case QUOCTE_CHANGE_SUCCESS:
            // console.log(action.payload);
            return {
                ...state,
                
                error: '',
                loading: false,
            };
        case QUOCTE_DELETE_SUCCESS:
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
