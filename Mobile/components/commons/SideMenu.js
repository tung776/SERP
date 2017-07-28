import React from 'react';
import { View, Text, Button, Image, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
// import { Card, CardSection, } from './index';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { logout } from '../../actions';
import { loadMenusData } from '../../actions/index';
import { Spinner } from './Spinner';
import { getActionForMenus, HOME_ACT, CATEGORY_LIST_ACT, AUTH_ACT } from '../../actions/typeActionRouter';

class SideMenu extends React.Component {
    state = {
        showOrderMenu: false,
        showPhieuChiMenu: false,
        showProductMenu: false,
        showCustomerMenu: false,
        showSupplierMenu: false,
        showIncomeOrder: false,
        showSaleReport: false,
        showSaleReportMenu: false,
        collaped: null,
    }
    constructor(props) {
        super(props);
        this.renderMenuItems = this.renderMenuItems.bind(this);
    }
    componentWillMount() {
        if (!this.props.loaded) {
            this.props.loadMenusData();
        }
    }
    resetMenu() {
        this.setState({
            showOrderMenu: false,
            showPhieuChiMenu: false,
            showProductMenu: false,
            showCustomerMenu: false,
            showSupplierMenu: false,
            showIncomeOrder: false,
            showSaleReport: false,
            showSaleReportMenu: false,
        });
    }
    logout(e) {
        e.preventDefault();
        this.props.logout(() => {
            AsyncStorage.removeItem('jwtToken').then(() => {
                Actions.auth();
            });
        });
    }
    getChildItems(parentId, data) {
        const child = data.map((item) => {
            if (item.parentId == parentId) {
                return (
                    <Button
                        onPress={() => { getActionForMenus(item.id); }}
                        title={item.name}
                        color="#d35400"
                    />
                );
            }
        });
        debugger;
        return child;
    }
    renderMenuItems() {
        // console.log("go renderMenuItems");
        const menuItems = this.props.menuItems;
        const parentMenu = menuItems.filter((item) => {
            console.log("item.parentId", item.parentId);
            if (item.parentId == "null") {
                return item;
            }
        });
        
        console.log("parentMenu = ", parentMenu)
        const renderedMenus =  parentMenu.map((parent) => {
            console.log('go to map parent menu');
            debugger;
            this.setState({ ...collaped, [parent.id]: false });
            console.log("this.state/collaped = ", this.state.collaped);
            
            return (
                <View>
                    <Button
                        onPress={() => {
                            this.setState({ ...collaped, [parent.id]: ![parent.id] })
                        }}
                        title= { parent.name }
                        color="#841584"
                    />
                    {()=>{
                        if(this.state.collaped[parent.id]) return this.getChildItems(parent.menuId, menuItems);
                    }}
                </View>
            );
        }, this);
        console.log("renderedMenus = ",renderedMenus);
        return (
            <View>
                <Text>here</Text>
                {renderedMenus}
            </View>
        )
    }
    render() {
        const { containerStyle } = styles;
        goHomePage = () => {
            console.log("begin to get actions for menus");
            getActionForMenus(HOME_ACT);
        };
        goSignin = () => {
            Actions.auth();
        };

        if (this.props.loaded) {
            
            // this.renderMenuItems(this.props.menuItems);
            return (
                <View style={containerStyle}>
                    <View>
                        <Image style={styles.logoImage} source={require('../../../Shared/images/Logo.png')} />
                        {this.props.user && <Text style={styles.usernameStyle}>{this.props.user.username}</Text>}
                    </View>
                    <ScrollView>
                        { this.renderMenuItems() }                        

                        {this.renderAuthMenu()}
                    </ScrollView>
                </View>
            );
        }
        return (
            <View style={containerStyle}>
                <View>
                    <Image style={styles.logoImage} source={require('../../../Shared/images/Logo.png')} />
                    {this.props.user && <Text style={styles.usernameStyle}>{this.props.user.username}</Text>}
                </View>
                <ScrollView>
                    <Spinner />
                    {this.renderAuthMenu()}
                </ScrollView>
            </View>
        );
    }

    renderAuthMenu() {
        const { isAuthenticated, user } = this.props;
        if (isAuthenticated) {
            return (
                <View style={styles.buttonMenuContainer}>
                    <Button
                        onPress={this.logout.bind(this)}
                        title="Thoát"
                        color="rgba(39, 174, 96,1.0)"
                        accessibilityLabel=".."
                    />
                </View>
            );
        }
    }
    renderCategoryMenu() {
        if (this.state.showProductMenu) {
            return (
                <View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => { Actions.categoryList(); this.resetMenu(); }}
                            title="Nhóm Sản Phẩm"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => { Actions.categoryNew(); this.resetMenu(); }}
                            title="Thêm Nhóm Sản Phẩm"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => { Actions.ProductNew(); this.resetMenu(); }}
                            title="Thêm Sản Phẩm"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.Products()}
                            title="Danh Sách Sản Phẩm"
                            color="#d35400"
                        />
                    </View>
                </View>
            );
        }
    }
    renderOdersMenu() {
        if (this.state.showOrderMenu) {
            return (
                <View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.categoryList()}
                            title="Lập Hóa Đơn"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.categoryList()}
                            title="Khách Hàng Trả Lại"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.categoryNew()}
                            title="Tìm Hóa Đơn"
                            color="#d35400"
                        />
                    </View>
                </View>
            );
        }
    }
    renderPhieuChiMenu() {
        if (this.state.showPhieuChiMenu) {
            return (
                <View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.categoryList()}
                            title="Chi Lương"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.categoryList()}
                            title="Chi Thuê Mặt Bằng"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.categoryNew()}
                            title="Chi Lãi Vay"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.categoryNew()}
                            title="Chi Khác"
                            color="#d35400"
                        />
                    </View>
                </View>
            );
        }
    }
    renderCustomerMenu() {
        if (this.state.showCustomerMenu) {
            return (
                <View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.CustomerNew()}
                            title="Thêm Khách Hàng"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.CustomerNew()}
                            title="Công Nợ Khách Hàng"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.CustomerList()}
                            title="Danh Sách Khách Hàng"
                            color="#d35400"
                        />
                    </View>
                </View>
            );
        }
    }
    renderIncomeMenu() {
        if (this.state.showIncomeOrder) {
            return (
                <View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.ImcomeOrderNew()}
                            title="Thêm Hóa Đơn Nhập"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.ImcomeOrderNew()}
                            title="Trả Lại Nhà Cung Cấp"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.IncomeOrders()}
                            title="Tìm Hóa Đơn Nhập"
                            color="#d35400"
                        />
                    </View>
                </View>
            );
        }
    }
    renderSupplierMenu() {
        if (this.state.showSupplierMenu) {
            return (
                <View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.SupplierList()}
                            title="Tìm Nhà Cung Cấp"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.SupplierNew()}
                            title="Thêm Nhà Cung Cấp"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.SupplierNew()}
                            title="Công Nợ Nhà Cung Cấp"
                            color="#d35400"
                        />
                    </View>
                </View>
            );
        }
    }
    renderSaleReportMenu() {
        if (this.state.showSaleReportMenu) {
            return (
                <View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.SupplierList()}
                            title="Báo Cáo Doanh Số"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.SupplierNew()}
                            title="Báo Cáo Lợi Nhuận Tạm Tính"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => Actions.SupplierNew()}
                            title="Báo Cáo Lợi Nhuận Thuần"
                            color="#d35400"
                        />
                    </View>
                </View>
            );
        }
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'rgba(52, 73, 94,1.0)',
        alignItems: 'center',
    },
    textMenuStyle: {
        fontSize: 16,
        color: 'white'
    },
    logoImage: {
        width: 200,
        height: 110,
        margin: 20
    },
    usernameStyle: {
        fontSize: 16,
        color: '#FFFFFF',
        alignSelf: 'center',
        paddingBottom: 5,
        fontWeight: '600'
    },
    buttonMenuContainer: {
        margin: 3,
        width: 250,
    },
    commonButton: {
        margin: 3,
        width: 250,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#bdc3c7'
    }
};
const mapStateToProps = (state) => {
    const { isAuthenticated, user } = state.auth;
    const { menuItems, loaded, loading } = state.userMenus;
    return { isAuthenticated, user, menuItems, loaded, loading };
};
export default connect(mapStateToProps, {
    logout,
    loadMenusData,
})(SideMenu);
