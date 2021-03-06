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
    title: '',
    quocteDetails: [],
    quocteList: [],
    loading: false,
    loaded: false,
    error: '',
    isSave: false,
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
                title: '',
                quocteDetails: [],
                error: '',
                isSave: false
            };
        case QUOCTE_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value, isSave: false };
        case QUOCTE_LIST_LOADED_SQLITE: {
            const list = [];
            action.payload.forEach((quocte) => {
                const temp = {...quocte, key: quocte.id};
                list.push(temp);
            })
            if (action.payload) {
                return {
                    ...state,
                    quocteList: list,
                    loading: false,
                    loaded: true
                }
            }
            return {
                ...state,
                quocteList: null,
                loading: false,
                loaded: true
            }
        }
        case SELECTED_PRODUCT_TO_QUOCTE_DETAIL: {
            return {
                ...state,
                quocteDetails: action.payload
            };
        }

        case QUOCTE_LOADED_SQLITE:
            let quocteDetails = [];
            action.payload.forEach((item) => {
                quocteDetails.push({
                    detailId: item.detailId,
                    unitId: item.unitId,
                    productId: item.productId,
                    salePrice: item.salePrice,
                    name: item.name,
                    key: item.detailId,                    
                });
            });
            return {
                ...state,
                id: action.payload[0].id,
                customerId: action.payload[0].customerId,
                customerGroupId: action.payload[0].customerGroupId,
                date: action.payload[0].date,
                title: action.payload[0].title,
                quocteDetails: quocteDetails,
                error: '',
                loading: false,
                loaded: true,
                isSave:false,
            };
        case QUOCTE_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false, isSave: false };
        case QUOCTE_CHANGE_SUCCESS:
            return {
                ...state,
                loading: false,
                isSave: true,
            };
        case QUOCTE_DELETE_SUCCESS:
            return {
                ...state,
                error: '',
                loading: false,
                isSave: true,
            };
        default:
            return state;
    }
}
    ;
