const INITIAL_STATE = {
    NameCategory: '',
    Description: '',
    loading: false,
    error: ''
};
import { ADD_CATEGORY, CATEGORY_PENDING, CATEGORY_CHANGE_FAIL, CATEGORY_CHANGE_SUCCESS } from '../actions/types';

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CATEGORY_PENDING :
            return { ...state, loading: true, error: '' };
        case ADD_CATEGORY:
            return { ...state, NameCategory: action.payload.NameCategory, Description: action.payload.Description };
        case CATEGORY_CHANGE_FAIL:
            return { ...state, error: action.payload, loading: false };
        case CATEGORY_CHANGE_SUCCESS:
            // console.log(action.payload);
            return { ...state, user: action.payload.user, error: '', loading: false };
        default:
            return state;
    }
}
    ;
