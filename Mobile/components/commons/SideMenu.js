import React, { Component } from 'react';
import { View, Text, Button, Image, ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux'
import { Card, CardSection, } from './index';
import { AsyncStorage } from 'react-native';
import {connect} from 'react-redux';
import {logout} from '../../actions';

class SideMenu extends Component {
    state = {}
    logout(e) {
        e.preventDefault();
        this.props.logout(() => {
            AsyncStorage.removeItem('jwtToken').then(()=> {
                Actions.auth();
            });            
        });
    }
    render() {
        const { containerStyle, textMenuStyle } = styles;
        goHomePage = () => {
            Actions.Home();
        }
        goSignin = () => {
            Actions.auth();
        }

        return (
            <View style={containerStyle}>
                <View>
                    <Image style={styles.logoImage} source={require("../../../Shared/images/Logo.png")} />
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
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Lập Hóa Đơn Bán"
                            color="#d35400"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Tìm Kiếm Sản Phẩm"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Nhóm Sản Phẩm"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Thêm Sản Phẩm"
                            color="#d35400"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Lập Hóa Đơn Mua"
                            color="#d35400"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Lập Phiếu Chi"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Lập Phiếu Thu"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Theo Dõi Công Nợ"
                            color="#d35400"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Theo dõi Thu-Chi"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Danh Sách Khách Hàng"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Danh Sách Nhà Cung cấp"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Lập Lệnh Sản Xuất"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Lập Lệnh Công Thức Nghiên Cứu"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Báo Cáo Tồn Kho"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Báo Cáo Lợi Nhuận"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goHomePage}
                            title="Báo Cáo Doanh Thu"
                            color="rgba(41, 128, 185,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={goSignin}
                            title="Đăng Nhập"
                            color="rgba(39, 174, 96,1.0)"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.buttonMenuContainer}>
                        <Button
                            onPress={this.logout.bind(this)}
                            title="Thoát"
                            color="rgba(39, 174, 96,1.0)"
                            accessibilityLabel=".."
                        /> 
                    </View>

                </ScrollView>
            </View>
        );
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
    buttonMenuContainer: {
        margin: 3,
        width: 250,
    }
}

export default connect(null, {
    logout
})(SideMenu);

// <Button
//     onPress={() => {
//         Actions.Home();
//     }}>
//     title= "Trang chủ"
//                     </Button>
//     <Button
//         onPress={() => {
//             Actions.auth();
//         }}>
//         title = "Đăng Nhập"
//                     </Button>