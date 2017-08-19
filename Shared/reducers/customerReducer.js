import {
    ADD_CUSTOMER, CUSTOMER_PENDING, CUSTOMER_CHANGE_FAIL,
    CUSTOMER_CHANGE_SUCCESS, CUSTOMER_CHANGE,
    CUSTOMER_LOADED_SQLITE, CUSTOMER_LIST_LOADED_SQLITE, CUSTOMER_DELETE_SUCCESS,
    RESET_CUSTOMER_FORM, CUSTOMER_DEBT_LOADED_SQLITE
} from '../actions/types';

const INITIAL_STATE = {
    Id: '',
    CustomerGroupId: 6,
    Name: '',
    Address: '',
    Phone: '',
    Email: '',
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
    customers: []
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CUSTOMER_PENDING:
            return { ...state, debt: action.payload[0] };
        case RESET_CUSTOMER_FORM:
            return {
                ...state,
                Id: '',
                CustomerGroupId: 6,
                Name: '',
                Address: '',
                Phone: '',
                Email: '',
                Overdue: '',
                ExcessDebt: '',
                CompanyName: '',
                CompanyAdress: '',
                DirectorName: '',
                BankNumber: '',
                BankName: '',
                TaxCode: '',
                Fax: '',
                error: ''
            };
        case CUSTOMER_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case CUSTOMER_DEBT_LOADED_SQLITE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case CUSTOMER_LIST_LOADED_SQLITE: {
            const convertedData = [];
            action.payload.forEach((item) => {
                const convert = { ...item, key: item.id };
                convertedData.push(convert);
            });
            return { ...state, customers: convertedData, loaded: true, loading: false };
        }

        case CUSTOMER_LOADED_SQLITE:
            return {
                ...state,
                CustomerGroupId: action.payload.customerGroupId,
                Name: action.payload.name,
                Address: action.payload.address,
                Phone: action.payload.phone,
                Email: action.payload.email,
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
        case CUSTOMER_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false };
        case CUSTOMER_CHANGE_SUCCESS:
            // console.log(action.payload);
            return {
                ...state,
                Id: '',
                CustomerGroupId: 6,
                Name: '',
                Address: '',
                Phone: '',
                Email: '',
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
        case CUSTOMER_DELETE_SUCCESS:
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
