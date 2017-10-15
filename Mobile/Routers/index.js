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
import CategorySearch from '../components/Screens/Categories/categorySearch';
import CategoryNew from '../components/Screens/Categories/CategoryNew';
import Splash from '../components/Splash';
import LoginForm from '../components/Screens/Auth/LoginForm';
// import CategoriesScene from './categoriesScene';
// import AuthScene from './authScene';
import ProductList from '../components/Screens/Products';
import ProductNew from '../components/Screens/Products/ProductNew';
import ProductEdit from '../components/Screens/Products/ProductEdit';
import ComminSoon from '../components/commons/CommingSoon';

import NewQuocte from '../components/Screens/quoctes/newQuocte';
import EditQuocte from '../components/Screens/quoctes/editQuocte';
import quoctes from '../components/Screens/quoctes/index';

import CustomerGroups from '../components/Screens/CustomerGroups';
import CustomerGroupEdit from '../components/Screens/CustomerGroups/CustomerGroupEdit';
import CustomerGroupSearch from '../components/Screens/CustomerGroups/CustomerGroupSearch';
import CustomerGroupNew from '../components/Screens/CustomerGroups/CustomerGroupNew';

import Customers from '../components/Screens/Customers';
import CustomerEdit from '../components/Screens/Customers/CustomerEdit';
import customerSearch from '../components/Screens/Customers';
import CustomerNew from '../components/Screens/Customers/CustomerNew';
import productSelector from '../components/Screens/Products/productSelector';

import saleOrders from '../components/Screens/saleOrders/index';
import newSaleOrder from '../components/Screens/saleOrders/newOrder';
import editSaleOrder from '../components/Screens/saleOrders/editOrder';

import newPaymentCustomer from '../components/Screens/paymentCustomers/newPayment';
import indexPaymentCustomer from '../components/Screens/paymentCustomers/index';
import editPaymentCustomer from '../components/Screens/paymentCustomers/editPayment';

import purchaseOrders from '../components/Screens/purchaseOrders/index';
import newPurchaseOrder from '../components/Screens/purchaseOrders/newOrder';
import editPurchaseOrder from '../components/Screens/purchaseOrders/editOrder';

import newPaymentSupplier from '../components/Screens/paymentSuppliers/newPayment';
import indexPaymentSupplier from '../components/Screens/paymentSuppliers/index';
import editPaymentSupplier from '../components/Screens/paymentSuppliers/editPayment';

import Suppliers from '../components/Screens/Suppliers';
import SupplierEdit from '../components/Screens/Suppliers/SupplierEdit';
import SupplierSearch from '../components/Screens/Suppliers';
import SupplierNew from '../components/Screens/Suppliers/SupplierNew';

const RouterComponent = () => (
    <Router hideNavBar="true" sceneStyle={{ backgroundColor: '#F7F7F7' }} >

        <Scene key="drawer" component={requireAuth(NavigationDrawer)} open={false} >

            <Scene
                key="main"
                animation='fade'
            >
            <Scene key="quoctes" component={quoctes} title="Danh sách báo giá" />
                <Scene key="newSaleOrder" component={newSaleOrder} title="Lập hóa đơn" />
                <Scene key="editSaleOrder" component={editSaleOrder} title="Sửa hóa đơn" />
                <Scene key="newQuocte" component={NewQuocte} title="tạo báo giá" />
                <Scene key="editQuocte" component={EditQuocte} title="tạo báo giá" />
                <Scene key="productSelector" component={productSelector} title="productSelector" />

                <Scene key="Home" component={Home} title="Home" />
                <Scene key="categoryNew" component={CategoryNew} title="Thêm sản phẩm" />
                <Scene key="categorySearch" component={CategorySearch} title="Xem sản phẩm" />
                <Scene key="categoryList" component={Categories} title="Nhóm sản phẩm" />
                <Scene key="categoryEdit" component={CategoryEdit} title="Sửa nhóm sản phẩm" />
                <Scene key="cargoNew" component={ComminSoon} title="Thêm loại hàng hóa" />
                <Scene key="cargoList" component={ComminSoon} title="..." />
                <Scene key="reportInventory" component={ComminSoon} title="..." />
                <Scene key="adviceProductMustImport" component={ComminSoon} title="..." />
                <Scene key="reportSaleByProduct" component={ComminSoon} title="..." />
                <Scene key="adviceProductMustProcedure" component={ComminSoon} title="..." />

                <Scene key="ProductNew" component={ProductNew} title="Thêm Sản Phẩm" />
                <Scene key="searchProduct" component={ComminSoon} title="tim sản phẩm" />
                <Scene key="productList" component={ProductList} title="Danh sách sản phẩm" />
                <Scene key="ProductEdit" component={ProductEdit} title="Sửa sản phẩm" />

                <Scene key="customerGroupNew" component={CustomerGroupNew} title="Thêm nhóm khách hàng" />
                <Scene key="customerGroupSearch" component={CustomerGroups} title="Tìm nhóm khách hàng" />
                <Scene key="customerGroupsList" component={CustomerGroups} title="danh sách nhóm khách hàng" />
                <Scene key="customerGroupEdit" component={CustomerGroupEdit} title="Sửa nhóm khách hàng" />

                <Scene key="customerNew" component={CustomerNew} title="Thêm khách hàng" />
                <Scene key="customerSearch" component={Customers} title="Tìm khách hàng" />
                <Scene key="customersList" component={Customers} title="danh sách khách hàng" />
                <Scene key="customerEdit" component={CustomerEdit} title="Sửa khách hàng" />

                <Scene key="saleOrderReturnning" component={ComminSoon} title="..." />
                <Scene key="searchSaleOrder" component={saleOrders} title="..." />
                <Scene key="newOrderType" component={ComminSoon} title="..." />

                <Scene key="newCustomer" component={ComminSoon} title="..." />
                <Scene key="customerList" component={ComminSoon} title="..." />
                <Scene key="customerDebt" component={ComminSoon} title="..." />
                <Scene key="reportSaleByCustomer" component={ComminSoon} title="..." />

                <Scene key="newReceiptCustomer" component={newPaymentCustomer} title="Thêm Phiếu Thu" />
                <Scene key="editReceiptCustomer" component={editPaymentCustomer} title="Sửa Phiếu Thu" />
                <Scene key="indexReceiptCustomer" component={indexPaymentCustomer} title="Tìm Phiếu Thu" />
                
                <Scene key="newPaymentSupplier" component={newPaymentSupplier} title="..." />
                <Scene key="searchPaymentSupplier" component={indexPaymentSupplier} title="..." />
                <Scene key="newPaymentType" component={ComminSoon} title="..." />
                
                <Scene key="sumarizePayment" component={ComminSoon} title="..." />
                <Scene key="newOrtherPayment" component={ComminSoon} title="..." />

                <Scene key="newSupplierOrder" component={newPurchaseOrder} title="..." />
                <Scene key="searchPurchaseOrder" component={purchaseOrders} title="..." />
                <Scene key="editSupplierOrder" component={editPurchaseOrder} title="..." />
                <Scene key="reportSupplierOrder" component={ComminSoon} title="..." />
                <Scene key="newSupplierOrderReturnning" component={ComminSoon} title="..." />

                <Scene key="searchSupplier" component={Suppliers} title="..." />
                <Scene key="newSupplier" component={SupplierNew} title="..." />
                <Scene key="editSupplier" component={SupplierEdit} title="..." />
                <Scene key="searchSupplierGroup" component={ComminSoon} title="..." />

                <Scene key="newResearch" component={ComminSoon} title="..." />
                <Scene key="reportCostTemp" component={ComminSoon} title="..." />
                <Scene key="searchResearch" component={ComminSoon} title="..." />
                <Scene key="transferResearch" component={ComminSoon} title="..." />
                <Scene key="reportResearch" component={ComminSoon} title="..." />
                <Scene key="generalReportResearch" component={ComminSoon} title="..." />

                <Scene key="newCommandProduction" component={ComminSoon} title="..." />
                <Scene key="searchCommandProduction" component={ComminSoon} title="..." />
                <Scene key="newRecycleCommand" component={ComminSoon} title="..." />
                <Scene key="generalReportProduction" component={ComminSoon} title="..." />

                <Scene key="newDepartment" component={ComminSoon} title="..." />
                <Scene key="searchDepartment" component={ComminSoon} title="..." />
                <Scene key="newuser" component={ComminSoon} title="..." />
                <Scene key="searchUser" component={ComminSoon} title="..." />
                <Scene key="jobTransfer" component={ComminSoon} title="..." />
                <Scene key="permittion" component={ComminSoon} title="..." />

                <Scene key="reportSaleOrder" component={ComminSoon} title="..." />
                <Scene key="reportTempIncome" component={ComminSoon} title="..." />
                <Scene key="reportNetIncome" component={ComminSoon} title="..." />
                <Scene key="reportCost" component={ComminSoon} title="..." />
                <Scene key="reportProducttionCost" component={ComminSoon} title="..." />

                <Scene key="changeCompanyInfor" component={ComminSoon} title="..." />
                <Scene key="changeMenuPermition" component={ComminSoon} title="..." />
                



                <Scene key="Main" component={requireAuth(Main)} title="Main" />
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
