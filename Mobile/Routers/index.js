import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import Home from '../components/Home';
import ChangeInfor from '../components/ChangeInfor';
import Main from '../components/Main';
import Authentication from '../components/Authentication';
import OrderHistory from '../components/OrderHistory';
import NavigationDrawer from '../components/commons/NavigationDrawer';
import requireAuth from '../utils/requireAuth';
import Categories from '../components/Screens/Categories';
import CategoryEdit from '../components/Screens/Categories/CategoryEdit';
import CategoryView from '../components/Screens/Categories/CategoryView';
import Splash from '../components/Splash';
import LoginForm from '../components/Screens/Auth/LoginForm';
// import CategoriesScene from './categoriesScene';
// import AuthScene from './authScene';
import CategoryNew from '../components/Screens/Categories/CategoryNew';
import Products from '../components/Screens/Products';
import ProductNew from '../components/Screens/Products/ProductNew';
import ProductDetail from '../components/Screens/Products/ProductDetail';

const RouterComponent = () => (
        <Router hideNavBar="true" sceneStyle={{ backgroundColor: '#F7F7F7' }} >

            <Scene key="drawer" component={requireAuth(NavigationDrawer)} open={false} >

                <Scene
                    key="main"
                    animation='fade'
                >
                    <Scene key="categoryList" component={Categories} title="Nhóm sản phẩm" />
                    <Scene key="categoryEdit" component={CategoryEdit} title="Sửa nhóm sản phẩm" />
                    <Scene key="categoryView" component={CategoryView} title="Xem sản phẩm" />
                    <Scene key="categoryNew" component={CategoryNew} title="Thêm sản phẩm" />

                     <Scene key="Products" component={Products} title="Danh sách sản phẩm" />
                     <Scene key="ProductNew" component={ProductNew} title="Thêm Sản Phẩm" />
                     <Scene key="ProductDetail" component={ProductDetail} title="Thêm Sản Phẩm" />

                    <Scene key="Main" component={requireAuth(Main)} title="Main" />
                    <Scene key="Home" component={Home} title="Home" />
                    <Scene key="ChangeInfor" component={ChangeInfor} title="ChangeInfor" />
                    <Scene key="Authentication" component={Authentication} title="Authentication" />
                    <Scene key="OrderHistory" component={OrderHistory} title="OrderHistory" />
                </Scene>
            </Scene>

            <Scene key="splash" component={Splash} />
            <Scene key="auth">
                <Scene key="login" component={LoginForm} title="Please login" initial />
            </Scene>

        </Router>
    );

export default RouterComponent
;
