import React, { Component } from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import {connect} from 'react-redux';
import stylesCommon from '../../../styles';

class Categories extends Component {
    state = {  }
    render() {
        return (
            <View style = {styles.container}>
                <Header>
                    <Text style = {styles.headTitle}>Nhóm Sản Phẩm</Text>
                </Header>
                <View style = {styles.body}>
                    <ScrollView>
                        <View style = {styles.listItem}>
                            <Image style = {styles.itemImage} source = {require( "../../../assets/images/BienSonPU.jpg")} />
                            <Text>Sơn PU</Text>
                        </View>
                        <View style = {styles.listItem}>
                            <Image style = {styles.itemImage} source = {require( "../../../assets/images/BienSon2k.jpg")} />
                            <Text>Sơn 2K</Text>
                        </View>
                        <View style = {styles.listItem}>
                            <Image style = {styles.itemImage} source = {require( "../../../assets/images/BienSonKem.jpg")} />
                            <Text>Sơn Kẽm</Text>
                        </View>
                        <View style = {styles.listItem}>
                            <Image style = {styles.itemImage} source = {require( "../../../assets/images/BienSonCN.jpg")} />
                            <Text>Sơn Công Nghiệp</Text>
                        </View>
                        <View style = {styles.listItem}>
                            <Image style = {styles.itemImage} source = {require( "../../../assets/images/BienSonNhom.jpg")} />
                            <Text>Sơn Nhôm</Text>
                        </View>
                    </ScrollView>
                </View>
                <Footer/>
            </View>
        );
    }
}
const styles = {
    container: stylesCommon.container,
    body: stylesCommon.body,
    headTitle: stylesCommon.headTitle,
    listItem: {
        flexDirection: 'row',
        flex: 1,
        paddingTop: 2,
        paddingBottom: 2
    },
    itemImage: {
        width: 100,
        height: 125
    }
}
// const mapStateToProps(state, ownProps)=> {
//     return state
// }
export default Categories;