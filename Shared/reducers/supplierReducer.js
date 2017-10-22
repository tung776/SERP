import {
    ADD_SUPPLIER, SUPPLIER_PENDING, SUPPLIER_CHANGE_FAIL,
    SUPPLIER_CHANGE_SUCCESS, SUPPLIER_CHANGE,
    SUPPLIER_LOADED_SQLITE, SUPPLIER_LIST_LOADED_SQLITE, SUPPLIER_DELETE_SUCCESS,
    RESET_SUPPLIER_FORM, SUPPLIER_DEBT_LOADED_SQLITE
} from '../actions/types';

const INITIAL_STATE = {
    Id: '',
    Name: '',
    Address: '',
    Phone: '',
    Email: '',
    CurentDebt: '',
    Overdue: '',
    ExcessDebt: '',
    CompanyName: '',
    CompanyAdress: '',
    DirectorName: '',
    BankNumber: '',
    BankName: '',
    TaxCode: '',
    Fax: '',
    loading: false,
    loaded: false,
    error: '',
    debt: null,
    suppliers: []
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SUPPLIER_PENDING:
            return { ...state };
        case RESET_SUPPLIER_FORM:
            const debt = action.payload ? action.payload[0] : {}
            return {
                ...state,
                Id: '',
                Name: '',
                Address: '',
                Phone: '',
                Email: '',
                CurentDebt: '',
                Overdue: '',
                ExcessDebt: '',
                CompanyName: '',
                CompanyAdress: '',
                DirectorName: '',
                BankNumber: '',
                BankName: '',
                TaxCode: '',
                Fax: '',
                debt,
                error: ''
            };
        case SUPPLIER_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case SUPPLIER_DEBT_LOADED_SQLITE:
            return { ...state, debt: action.payload[0] };
        case SUPPLIER_LIST_LOADED_SQLITE: {
            const convertedData = [];
            action.payload.forEach((item) => {
                const convert = { ...item, key: item.id };
                convertedData.push(convert);
            });
            return { ...state, suppliers: convertedData, loaded: true, loading: false };
        }

        case SUPPLIER_LOADED_SQLITE:
            return {
                ...state,
                Name: action.payload.name,
                Address: action.payload.address,
                Phone: action.payload.phone,
                Email: action.payload.email,
                CurentDebt: `${action.payload.curentDebt}`,
                Overdue: `${action.payload.overdue}`,
                ExcessDebt: `${action.payload.excessDebt}`,
                CompanyName: action.payload.companyName,
                CompanyAdress: action.payload.companyAdress,
                DirectorName: action.payload.directorName,
                BankNumber: action.payload.bankNumber,
                BankName: action.payload.bankName,
                TaxCode: action.payload.taxCode,
                Fax: action.payload.fax,
                Id: action.payload.id,
                error: '',
                loading: false,
                loaded: true
            };
        case SUPPLIER_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false };
        case SUPPLIER_CHANGE_SUCCESS:
            return {
                ...state,
                Id: '',
                Name: '',
                Address: '',
                Phone: '',
                Email: '',
                CurentDebt: '',
                Overdue: '',
                ExcessDebt: '',
                CompanyName: '',
                CompanyAdress: '',
                DirectorName: '',
                BankNumber: '',
                BankName: '',
                TaxCode: '',
                Fax: '',
                error: '',
                loading: false,
            };
        case SUPPLIER_DELETE_SUCCESS:
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
