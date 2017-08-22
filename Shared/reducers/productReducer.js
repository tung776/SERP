import {
    ADD_PRODUCT, PRODUCT_PENDING, PRODUCT_CHANGE_FAIL,
    PRODUCT_CHANGE_SUCCESS, PRODUCT_CHANGE,
    PRODUCT_LOADED_SQLITE, PRODUCT_LIST_LOADED_SQLITE,
    LOAD_UNIT_SUCCESS, LOAD_TYPE_CARGO_SUCCESS,
    RESET_PRODUCT_FORM, TOGGLE_PRODUCT_TO_SELECT_LIST,
    RESET_SELECTED_PRODUCT
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
    typeCargoes: [],
    selectedProducts: []
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RESET_PRODUCT_FORM: {
            console.log('action.payload.selectedProducts = ', action.payload.selectedProducts);
            let convertedData = [];
            if (action.payload && action.payload.selectedProducts) {
                convertedData = toggleSelectDataSource([...action.payload.selectedProducts], action.payload.selectedProducts);
            } 
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
                products: convertedData || [],
                selectedProducts: action.payload.selectedProducts || [],
                loading: false,
                loaded: false,
                error: '',
            };
        }
        case RESET_SELECTED_PRODUCT: 
            return {
                ...state,
                selectedProducts: []
            }
        case PRODUCT_PENDING:
            return { ...state, loading: true, loaded: false, error: '' };

        case PRODUCT_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };

        case PRODUCT_LIST_LOADED_SQLITE: {
            console.log('state.selectedProducts', state.selectedProducts);
            const convertedData = toggleSelectDataSource([...action.payload], state.selectedProducts);
            console.log('cenvertedData = ', convertedData);
            return { ...state, products: convertedData, loaded: true, loading: false };
        }
        case TOGGLE_PRODUCT_TO_SELECT_LIST: {
            const newSelectedProductsList = addOrRemoveToSelectedProducts(action.payload, state.selectedProducts);
            console.log('selectedProducts = ', newSelectedProductsList);
            const convertedData = toggleSelectDataSource([...state.products], [...newSelectedProductsList]);
            
            return {
                ...state,
                products: convertedData,
                selectedProducts: newSelectedProductsList,
                loaded: true,
                loading: false
            };
        }
        case PRODUCT_LOADED_SQLITE:
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
                loaded: true,
                loading: false
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
};

const toggleSelectDataSource = (source, selectedData) => {
    let convertedData = [];
    let convert;
    source.forEach((item) => {
        convert = { ...item, key: item.id, isSelected: false, quantity: 0 };
        selectedData.forEach((el) => {
            if ((el.id === item.id) ) {

                convert = { ...item, key: item.id, isSelected: true, quantity: 0 };
            }
        });
        convertedData.push(convert);
    });
    return convertedData;
};

const addOrRemoveToSelectedProducts = (product, selectedList) => {
    //xác định sản phẩm này đã tồn tại trong danh sách chọn chưa
    const temp = selectedList.filter((item) => {

        if (product.id === item.id) {
            return item;
        }
    });
    if (temp[0]) {
        //Nếu sp đã tồn tại, thì loại bọ sản phẩm
        const newList =  selectedList.filter((item) => {
            if (product.id !== item.id) {
                    return item;
            }
        });
        return newList;
    } else {
        //nếu chưa tồn tại trong ds chọn thì thêm vào
        let clone = [...selectedList];
        clone.push(product);
        console.log('clone = ', clone);
        return clone;
    }
}