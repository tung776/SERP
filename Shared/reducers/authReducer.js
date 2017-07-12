import {SET_CURRENT_USER } from '../actions/types';
import isEmpty from 'lodash/isEmpty';
const INITIAL_STATE = {
    user: null,
    isAuthenticated: false
}

export default (state = INITIAL_STATE, action)=> {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state, 
                user: action.payload,
                isAuthenticated: !isEmpty(action.payload)
            }
        default:
            return state;
    }

}