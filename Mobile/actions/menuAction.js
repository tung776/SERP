import {
    MENU_LOADING,
    MENU_LOADED
} from './index';
import SqlService from '../database/sqliteService';

export const loadMenusData = () => async (dispatch) => {
    dispatch({
        type: MENU_LOADING
    });
    const userMenus = await SqlService.select('userMenus', '*').then(
        result => console.log('userMenus = ', result)
    );

    console.log('userMenus = ', userMenus);

    dispatch({
        type: MENU_LOADED,
        payload: userMenus
    });
};
