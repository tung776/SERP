import {
    ADD_PRODUCT, PRODUCT_PENDING, PRODUCT_CHANGE_FAIL,
    PRODUCT_CHANGE_SUCCESS, PRODUCT_CHANGE, PRODUCT_LOADED_SQLITE
} from '../actions/types';

const INITIAL_STATE = {
    Name: '',
    Description: '',
    ImageUrl: '',
    loading: false,
    loaded: false,
    error: '',
    products:[]
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PRODUCT_PENDING:
            return { ...state, loading: true, error: '' };
        case PRODUCT_CHANGE:
            // console.log(action.payload)
            return { ...state, [action.payload.prop]: action.payload.value };
        case PRODUCT_LOADED_SQLITE:
            // console.log(action.payload)
            return { ...state, products: action.payload, loaded: true, loading: false };
        case ADD_PRODUCT:
            return {
                ...state,
                Name: action.payload.Name,
                Description: action.payload.Description,
                ImageUrl: action.payload.Image,
                error: '',
                loading: false,
            };
        case PRODUCT_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false };
        case PRODUCT_CHANGE_SUCCESS:
            // console.log(action.payload);
            return {
                ...state,
                Name: action.payload.Name,
                Description: action.payload.Description,
                ImageUrl: action.payload.Image,
                error: '',
                loading: false,
            };
        default:
            return state;
    }
}
    ;
