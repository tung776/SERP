import {
    ADD_PRODUCT, PRODUCT_PENDING, PRODUCT_CHANGE_FAIL,
    PRODUCT_CHANGE_SUCCESS, PRODUCT_CHANGE,
    PRODUCT_LOADED_SQLITE, PRODUCT_LIST_LOADED_SQLITE,
    LOAD_UNIT_SUCCESS, LOAD_TYPE_CARGO_SUCCESS,
    RESET_PRODUCT_FORM, TOGGLE_PRODUCT_TO_SELECT_LIST
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
                selectedProducts: action.payload.selectedProducts || [],
                loading: false,
                loaded: false,
                error: '',
            };
        case PRODUCT_PENDING:
            return { ...state, loading: true, loaded: false, error: '' };

        case PRODUCT_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };

        case PRODUCT_LIST_LOADED_SQLITE: {
            const convertedData = toggleSelectDataSource([...action.payload], state.selectedProducts);
            console.log('convertedData = ', convertedData);

            return { ...state, products: convertedData, loaded: true, loading: false };
        }
        case TOGGLE_PRODUCT_TO_SELECT_LIST: {
            const newSelectedProductsList = addOrRemoveToSelectedProducts(action.payload, state.selectedProducts);
            const newProductsList = toggleSelectDataSource(action.payload, newSelectedProductsList);

            return {
                ...state,
                products: newProductsList,
                selectedProducts: newSelectedProductsList,
                loaded: true,
                loading: false
            };
        }
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
    console.log('source = ', source);
    console.log('selectedData = ', selectedData);
    let convertedData = [];
    let convert;
    source.forEach((item) => {
        console.log('item = ', item);
        convert = { ...item, key: item.id, isSelected: false };
        selectedData.forEach((el) => {
            if ((el.id === item.id) &&
                (el.customerId === item.customerId) &&
                (el.customerGroupId === item.customerGroupId) &&
                (el.productId === item.productId) &&
                (el.unitId === item.unitId)) {
                convert = { ...item, key: item.id, isSelected: true };
            }
        });
        console.log('convert = ', convert);
        convertedData.push(convert);
        console.log('converted = ', convertedData);
    });
    return convertedData;
};

const addOrRemoveToSelectedProducts = (product, selectedList) => {
    //xác định sản phẩm này đã tồn tại trong danh sách chọn chưa
    const temp = selectedList.filter((item) => {

        if ((product.id === item.id) &&
            (product.customerId === item.customerId) &&
            (product.customerGroupId === item.customerGroupId) &&
            (product.productId === item.productId) &&
            (product.unitId === item.unitId)) {
            return item;
        }
    });

    if (temp) {
        //Nếu sp đã tồn tại, thì loại bọ sản phẩm
        return selectedList.filter((item) => {
            if ((product.id !== item.id) &&
                (product.customerId !== item.customerId) &&
                (product.customerGroupId !== item.customerGroupId) &&
                (product.productId !== item.productId) &&
                (product.unitId !== item.unitId)) {
                return item;
            }
        });
    } else {
        //nếu chưa tồn tại trong ds chọn thì thêm vào
        let clone = [...selectedList];
        return clone.push(product);
    }
}