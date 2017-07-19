import React from 'react';
import { View, Text, Button, Image, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
// import { Card, CardSection, } from './index';
import { AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { logout } from '../../actions';

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
    render() {
        const { containerStyle } = styles;
        goHomePage = () => {
            Actions.Home();
        };
        goSignin = () => {
            Actions.auth();
        };

        return (
            <View style={containerStyle}>
                <View>
                    <Image style={styles.logoImage} source={require('../../../Shared/images/Logo.png')} />
                    {this.props.user && <Text style={styles.usernameStyle}>{this.props.user.username}</Text>}
                </View>
                <ScrollView>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Trang Chủ"
                            color="#841584"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.commonButton}>
                        <Button
                            onPress={() => this.setState({ showProductMenu: !this.state.showProductMenu })}
                            title="Sản Phẩm"
                            color="#2c3e50"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    {this.renderCategoryMenu()}
                    <View style={styles.commonButton}>
                        <Button
                            onPress={() => this.setState({ showOrderMenu: !this.state.showOrderMenu })}
                            title="Hóa Đơn Bán"
                            color="#2c3e50"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    {this.renderOdersMenu()}
                    <View style={styles.commonButton}>
                        <Button
                            onPress={() => this.setState({ showPhieuChiMenu: !this.state.showPhieuChiMenu })}
                            title="Phiếu Chi"
                            color="#2c3e50"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    {this.renderPhieuChiMenu()}
                    <View style={styles.commonButton}>
                        <Button
                            onPress={() => this.setState({ showCustomerMenu: !this.state.showCustomerMenu })}
                            title="Khách Hàng"
                            color="#2c3e50"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    {this.renderCustomerMenu()}
                    <View style={styles.commonButton}>
                        <Button
                            onPress={() => this.setState({ showIncomeOrder: !this.state.showIncomeOrder })}
                            title="Hóa Đơn Nhập"
                            color="#2c3e50"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    {this.renderIncomeMenu()}
                    <View style={styles.commonButton}>
                        <Button
                            onPress={() => this.setState({ showSupplierMenu: !this.state.showSupplierMenu })}
                            title="Nhà Cung Cấp"
                            color="#2c3e50"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    {this.renderSupplierMenu()}
                    <View style={styles.commonButton}>
                        <Button
                            onPress={() => this.setState({ showSaleReportMenu: !this.state.showSaleReportMenu })}
                            title="Báo Cáo Kinh Doanh"
                            color="#2c3e50"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    {this.renderSaleReportMenu()}

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
                            onPress={() => { Actions.categoryList(); this.resetMenu() ;}}
                            title="Nhóm Sản Phẩm"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => { Actions.categoryNew(); this.resetMenu() ;}}
                            title="Thêm Nhóm Sản Phẩm"
                            color="#d35400"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={() => { Actions.ProductNew(); this.resetMenu() ;}}
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
                            title="Chi Khách"
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
    return { isAuthenticated, user };
};
export default connect(mapStateToProps, {
    logout,
})(SideMenu);

// <View style={styles.buttonMenuContainer}>
//     <Button
//         onPress={goHomePage}
//         title="Trang Chủ"
//         color="#841584"
//         accessibilityLabel="Learn more about this purple button"
//     />
// </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Lập Hóa Đơn Bán"
//             color="#d35400"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Tìm Kiếm Sản Phẩm"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={() => Actions.categoryList()}
//             title="Nhóm Sản Phẩm"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={() => Actions.categoryNew()}
//             title="Thêm Nhóm Sản Phẩm"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Thêm Sản Phẩm"
//             color="#d35400"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Lập Hóa Đơn Mua"
//             color="#d35400"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Lập Phiếu Chi"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Lập Phiếu Thu"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Theo Dõi Công Nợ"
//             color="#d35400"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Theo dõi Thu-Chi"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Danh Sách Khách Hàng"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Danh Sách Nhà Cung cấp"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Lập Lệnh Sản Xuất"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Lập Lệnh Công Thức Nghiên Cứu"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Báo Cáo Tồn Kho"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Báo Cáo Lợi Nhuận"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goHomePage}
//             title="Báo Cáo Doanh Thu"
//             color="rgba(41, 128, 185,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
//     <View style={styles.buttonMenuContainer}>
//         <Button
//             onPress={goSignin}
//             title="Đăng Nhập"
//             color="rgba(39, 174, 96,1.0)"
//             accessibilityLabel="Learn more about this purple button"
//         />
//     </View>
    // <View style={styles.buttonMenuContainer}>
    //     <Button
    //         onPress={this.logout.bind(this)}
    //         title="Thoát"
    //         color="rgba(39, 174, 96,1.0)"
    //         accessibilityLabel=".."
    //     />
    // </View>
