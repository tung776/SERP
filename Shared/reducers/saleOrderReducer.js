import {
    ADD_SALE_ORDER, SALE_ORDER_PENDING, SALE_ORDER_CHANGE_FAIL,
    SALE_ORDER_CHANGE_SUCCESS, SALE_ORDER_CHANGE,
    SALE_ORDER_LOADED_SQLITE, SALE_ORDER_LIST_LOADED_SQLITE, SALE_ORDER_DELETE_SUCCESS,
    RESET_SALE_ORDER_FORM, SALE_ORDER_DETAIL_CHANGE, SELECTED_PRODUCT_TO_SALE_ORDER_DETAIL
} from '../actions/types';

const INITIAL_STATE = {
    Id: '',
    customerId: '',
    date: '',
    title: '',
    quocteDetails: [],
    quocteList: [],
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
                quocteDetails: [],
                error: ''
            };
        case SALE_ORDER_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case SALE_ORDER_LIST_LOADED_SQLITE: {

            if (action.payload) {
                return {
                    ...state,
                    quocteList: [{ ...action.payload, key: action.payload.id }],
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
        case SELECTED_PRODUCT_TO_SALE_ORDER_DETAIL: {
            return {
                ...state,
                quocteDetails: action.payload
            };
        }

        case SALE_ORDER_LOADED_SQLITE:
        console.log('action.payload = ', action.payload);
            let quocteDetails = [];
            action.payload.forEach((item) => {
                quocteDetails.push({
                    detailId: item.detailId,
                    unitId: item.unitId,
                    productId: item.productId,
                    price: item.price,
                    name: item.name,
                    key: item.detailId
                });
            });
            return {
                ...state,
                id: action.payload[0].id,
                customerId: action.payload[0].customerId,
                date: action.payload[0].date,
                title: action.payload[0].title,
                quocteDetails: quocteDetails,
                error: '',
                loading: false,
                loaded: true
            };
        case SALE_ORDER_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false };
        case SALE_ORDER_CHANGE_SUCCESS:
            // console.log(action.payload);
            return {
                ...state,
                customerId: '',
                date: '',
                title: '',
                quocteDetails: [],
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
