import {
    ADD_PRODUCT, PRODUCT_PENDING, PRODUCT_CHANGE_FAIL,
    PRODUCT_CHANGE_SUCCESS, PRODUCT_CHANGE,
    PRODUCT_LOADED_SQLITE, PRODUCT_LIST_LOADED_SQLITE,
    LOAD_UNIT_SUCCESS, LOAD_TYPE_CARGO_SUCCESS,
    RESET_PRODUCT_FORM
} from '../actions/types';

const INITIAL_STATE = {
    Id: '',
    CategoryId: '',
    UnitId: '',
    TypeCargoId: '',
    IsPublic: false,
    PurchasePrice: '',
    SalePrice: '',
    MinQuantity: '',
    IsAvaiable: true,
    Name: '',
    Description: '',
    loading: false,
    loaded: false,
    error: '',
    products: [],
    units: [],
    typeCargoes: []
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RESET_PRODUCT_FORM:
            return {
                Id: '',
                CategoryId: '',
                UnitId: '',
                TypeCargoId: '',
                IsPublic: false,
                PurchasePrice: '',
                SalePrice: '',
                MinQuantity: '',
                IsAvaiable: true,
                Name: '',
                Description: '',
                loading: false,
                loaded: false,
                error: '',
            };
        case PRODUCT_PENDING:
            return { ...state, loading: true, error: '' };
        case PRODUCT_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case PRODUCT_LIST_LOADED_SQLITE:
            return { ...state, products: action.payload, loaded: true, loading: false };
        case PRODUCT_LOADED_SQLITE:
            return { ...state, products: action.payload, loaded: true, loading: false };
        case LOAD_UNIT_SUCCESS:
            return { ...state, units: action.payload };
        case LOAD_TYPE_CARGO_SUCCESS:
            return { ...state, typeCargoes: action.payload };
        case ADD_PRODUCT:

            return {
                ...payload,
                Id,
                CategoryId,
                UnitId,
                TypeCargoId,
                IsPublic,
                PurchasePrice,
                SalePrice,
                MinQuantity,
                IsAvaiable,
                Name,
                Description,
                error: '',
                loading: false,
            };
        case PRODUCT_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false };
        case PRODUCT_CHANGE_SUCCESS:

            return {
                ...payload,
                Id,
                CategoryId,
                UnitId,
                TypeCargoId,
                IsPublic,
                PurchasePrice,
                SalePrice,
                MinQuantity,
                IsAvaiable,
                Name,
                Description,
                error: '',
                loading: false,
            };
        default:
            return state;
    }
}
    ;
