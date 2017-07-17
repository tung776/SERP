import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import Dashboard from '../components/Dashboard';
import Categories from '../components/Screens/Categories';
// import SideMenu from '../components/commons/SideMenu';
import CategoryNew from '../components/Screens/Categories/CategoryNew';
import Products from '../components/Screens/Products';
import ProductNew from '../components/Screens/Products/ProductNew';
import ProductDetail from '../components/Screens/Products/ProductDetail';

export const DasboardStack = StackNavigator({
    CategoriesScreen: {
        screen: Categories
    },
    CategoryNewScreen: {
        screen: CategoryNew
    },
    ProductsScreen: {
        screen: Products
    },
    ProductNewScreen: {
        screen: ProductNew
    },
    ProductDetailScreen: {
        screen: ProductDetail
    },

    DasboardScreen: {
        screen: Dashboard
    }
    
});
