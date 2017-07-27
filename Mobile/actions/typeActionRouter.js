import { Actions } from 'react-native-router-flux';

export const HOME_ACT = 1;
export const PRODUCTS_ACT = 2;
export const CATEGORY_ACT = 3;
export const NEW_CATEGORY_ACT = 4;
export const SEARCH_CATEGORY_ACT = 5;
export const CATEGORY_LIST_ACT = 6;
export const NEW_CARGO_TYPE_ACT = 7;
export const LIST_CARGO_TYPE_ACT = 8;
export const REPORT_INVENTORY_ACT = 9;
export const ADVICE_PRODUCT_MUST_IMPORT_ACT = 10;
export const SALE_BY_PRODUCT = 11;
export const ADVICE_PRODUCT_MUST_PRODUCE_ACT = 12;

export const SALE_ORDER_ACT = 13;
export const NEW_SALE_ORDER_ACT = 14;
export const SALE_ORDER_RETURNING_ACT = 15;
export const SEARCH_SALE_ORDER_ACT = 16;
export const NEW_ORDER_TYPE_ACT = 17;

export const CUSTOMERS_ACT = 18;
export const NEW_CUSTOMER_ACT = 19;
export const CUSTOMER_LIST_ACT = 20;
export const CUSTOMER_DEBT_ACT = 21;
export const SALE_BY_CUSTOMER_ACT = 22;

export const RECEIPTS_ACT = 23;
export const NEW_RECEIPT_ACT = 24;
export const SALARY_RECEIPT_ACT = 25;
export const RENTAL_WAREHOUSE_ACT = 26;
export const INTERESTING_RECEIPT_ACT = 27;
export const OTHER_RECEIPT_ACT = 28;

export const SUPPLIER_ORDER_ACT = 29;
export const NEW_SUPPLIER_ORDER_ACT = 30;
export const SUPPLIER_RETURNNING_ACT = 31;
export const SEARCH_SUPPLIER_ORDER_ACT = 32;
export const SUPPLIER_ORDER_REPORT_ACT = 33;

export const SUPPLIER_ACT = 34;
export const SEARCH_SUPPLIER_ACT = 35;
export const NEW_SUPPLIER_ACT = 36;
export const SUPPLIER_DEPT_ACT = 37;
export const SALE_BY_SUPPLIER = 38;

export const RESEARCH = 39;
export const SALE = 40;
export const SALE = 41;
export const SALE = 42;
export const SALE = 43;
export const SALE = 44;
export const SALE = 45;
export const SALE = 46;
export const SALE = 47;
export const SALE = 48;
export const SALE = 49;
export const SALE = 50;
export const SALE = 51;
export const SALE = 52;
export const SALE = 53;
export const SALE = 54;
export const SALE = 55;
export const SALE = 56;
export const SALE = 57;
export const SALE = 58;
export const SALE = 59;
export const SALE = 60;
export const SALE = 61;
export const SALE = 62;
export const SALE = 63;
export const SALE = 64;
export const SALE = 65;
export const SALE = 66;

export const getActionForMenus = (menu) => {
    switch (menu) {
        case HOME_ACT:
            return Actions.Home();
        case CATEGORY_ACT:
            return null;
        case CATEGORY_LIST_ACT:
            return Actions.categoryList();
        case CATEGORY_EDIT_ACT:
            return Actions.categoryEdit();
        case CATEGORY_View_act:
            return Actions.categoryView();
        default:
            break;
    }
};
