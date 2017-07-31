import {
    ADD_CATEGORY, CATEGORY_PENDING, CATEGORY_CHANGE_FAIL,
    CATEGORY_CHANGE_SUCCESS, CATEGORY_CHANGE, CATEGORY_LOADED_SQLITE
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
        case CATEGORY_CHANGE:
            // console.log(action.payload)
            return { ...state, [action.payload.prop]: action.payload.value };
        case CATEGORY_LOADED_SQLITE:
            // console.log(action.payload)
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
