import { URL } from '../../env';
import axios from 'axios';
import { NewCategoryValidator } from '../validators';
import { AsyncStorage } from 'react-native';
import SqlService from '../database/sqliteService';
import { PRODUCT_LOADED_SQLITE, PRODUCT_PENDING } from './index';
import db from '../database/sqliteConfig';

export const loadProductsDataFromSqlite = () => async (dispatch) => {
    dispatch({
        type: PRODUCT_PENDING
    });
    SqlService.select('products', '*').then(
        result => {
            dispatch({
                type: PRODUCT_LOADED_SQLITE,
                payload: result
            });
        }
    );
};