import {
    MENU_LOADING,
    MENU_LOADED
} from '../actions';

const INITIAL_STATE = {
    menuItems: [],
    loaded: false,
    loading: false
    // uploading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MENU_LOADING:
            return { ...state, loading: true, loaded: false };
        case MENU_LOADED:
            console.log('action.payload in MENU_LOADED = ', action.payload);
            return { ...state, menuItems: action.payload, loaded: true, loading: false };
        
        default:
            return state;
    }
};
