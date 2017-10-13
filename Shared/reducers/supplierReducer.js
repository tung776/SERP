import {
    ADD_CATEGORY, CATEGORY_PENDING, CATEGORY_CHANGE_FAIL,
    CATEGORY_CHANGE_SUCCESS, CATEGORY_CHANGE, 
    CATEGORY_LOADED_SQLITE, CATEGORY_DELETE_SUCCESS,
    RESET_CATEGORY_FORM
} from '../actions/types';

const INITIAL_STATE = {
    Name: '',
    Description: '',
    ImageUrl: '',
    Id: '',
    loading: false,
    loaded: false,
    error: '',
    categories:[]
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CATEGORY_PENDING:
            return { ...state, loading: true, error: '' };
        case RESET_CATEGORY_FORM:
            return { ...state, Name: '', ImageUrl: '', Description: '', Id: '', error: '' };
        case CATEGORY_CHANGE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case CATEGORY_LOADED_SQLITE:
            return { ...state, categories: action.payload, loaded: true, loading: false };
        case ADD_CATEGORY:
            debugger;
            return {
                ...state,
                Name: action.payload.Name,
                Description: action.payload.Description,
                ImageUrl: action.payload.Image,
                error: '',
                loading: false,
            };
        case CATEGORY_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false };
        case CATEGORY_CHANGE_SUCCESS:
            return {
                ...state,
                Name: action.payload.Name,
                Description: action.payload.Description,
                ImageUrl: action.payload.Image,
                error: '',
                loading: false,
            };
        case CATEGORY_DELETE_SUCCESS:
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
