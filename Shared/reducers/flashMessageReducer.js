const INITIAL_STATE = {
    message: '',
    TypeMessage: ''
};
import { ADD_FLASH_MESSAGE } from '../actions/types';

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_FLASH_MESSAGE:
            return { ...state, message: action.payload.message, TypeMessage: action.payload.TypeMessage };
        default:
            return state;
    }
}
;
