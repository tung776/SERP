import {
    ADD_PRODUCT, PRODUCT_PENDING, PRODUCT_CHANGE_FAIL,
    PRODUCT_CHANGE_SUCCESS, PRODUCT_CHANGE,
    PRODUCT_LOADED_SQLITE, PRODUCT_LIST_LOADED_SQLITE,
    LOAD_UNIT_SUCCESS, LOAD_TYPE_CARGO_SUCCESS,
    RESET_PRODUCT_FORM
} from '../actions/types';

const INITIAL_STATE = {
    Id: '',
    CategoryId: 1,
    UnitId: 1,
    TypeCargoId: 1,
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
                ...state,
                Id: '',
                CategoryId: 1,
                UnitId: 1,
                TypeCargoId: 1,
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
            return { ...state, loading: true, loaded: false, error: '' };
        case PRODUCT_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case PRODUCT_LIST_LOADED_SQLITE:
            let convertedData= [];
            action.payload.forEach((item) => {
                const convert = {...item, key: item.id};
                convertedData.push(convert);
            })
            return { ...state, products: convertedData, loaded: true, loading: false };
        case PRODUCT_LOADED_SQLITE:
            console.log('action.payload = ', action.payload);
            return { 
                ...state, 
                Id: action.payload.id,
                CategoryId: action.payload.categoryId,
                UnitId: action.payload.unitId,
                TypeCargoId: action.payload.typeCargoId,
                IsPublic: JSON.parse(action.payload.isPublic),
                PurchasePrice: `${action.payload.purchasePrice}`,
                SalePrice: `${action.payload.salePrice}`,
                MinQuantity: `${action.payload.minQuantity}`,
                IsAvaiable: JSON.parse(action.payload.isAvaiable),
                Name: action.payload.name,
                Description: action.payload.description,
                loaded: true, loading: false 
            };
        case LOAD_UNIT_SUCCESS:
            return { ...state, units: action.payload };
        case LOAD_TYPE_CARGO_SUCCESS:
            return { ...state, typeCargoes: action.payload };
        case ADD_PRODUCT:
           
        case PRODUCT_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false };
        case PRODUCT_CHANGE_SUCCESS:
            const {
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
            } = action.payload;
            return {
                ...state,
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
                loaded: false
            };
        default:
            return state;
    }
}
    ;
