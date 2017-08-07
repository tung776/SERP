import {
    ADD_CUSTOMER, CUSTOMER_PENDING, CUSTOMER_CHANGE_FAIL,
    CUSTOMER_CHANGE_SUCCESS, CUSTOMER_CHANGE,
    CUSTOMER_LOADED_SQLITE, CUSTOMER_LIST_LOADED_SQLITE, CUSTOMER_DELETE_SUCCESS,
    RESET_CUSTOMER_FORM
} from '../actions/types';

const INITIAL_STATE = {
    CustomerGroupId: '',
    BankId: '',
    CompanyId: '',
    Name: '',
    Address: '',
    Phone: '',
    Email: '',
    Overdue: '',
    ExcessDebt: '',
    Id: '',
    loading: false,
    loaded: false,
    error: '',
    customers: []
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CUSTOMER_PENDING:
            return { ...state, loading: true, error: '' };
        case RESET_CUSTOMER_FORM:
            return {
                ...state,
                CustomerGroupId: '',
                BankId: '',
                CompanyId: '',
                Name: '',
                Address: '',
                Phone: '',
                Email: '',
                Overdue: '',
                ExcessDebt: '',
                Id: '',
                error: ''
            };
        case CUSTOMER_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case CUSTOMER_LIST_LOADED_SQLITE:
            let convertedData = [];
            action.payload.forEach((item) => {
                const convert = { ...item, key: item.id };
                convertedData.push(convert);
            });
            return { ...state, customers: convertedData, loaded: true, loading: false };

        case CUSTOMER_LOADED_SQLITE:
            return {
                ...state,
                CustomerGroupId: action.payload.customerGroupId,
                BankId: action.payload.bankId,
                CompanyId: action.payload.companyId,
                Name: action.payload.name,
                Address: action.payload.address,
                Phone: action.payload.phone,
                Email: action.payload.email,
                Overdue: action.payload.overdue,
                ExcessDebt: action.payload.excessDebt,
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
                CustomerGroupId: '',
                BankId: '',
                CompanyId: '',
                Name: '',
                Address: '',
                Phone: '',
                Email: '',
                Overdue: '',
                ExcessDebt: '',
                Id: '',
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
