import {
    MENU_LOADING,
    MENU_LOADED
} from './index';
import SqlService from '../database/sqliteService';

export const loadMenusData = () => async (dispatch) => {
    dispatch({
        type: MENU_LOADING
    });
    SqlService.select('userMenus', '*').then(
        result => {
            // console.log("menus loaded = ",result);
            dispatch({
                type: MENU_LOADED,
                payload: result
            });
        }
    );


};
