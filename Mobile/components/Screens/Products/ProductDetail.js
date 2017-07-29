import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';

class ProductNew extends React.Component {
    state = {
        ProductName: '',
        MinStock: '',
        Price: ''
    }
    render() {
        console.log("this.props.product = ", this.props.product)
        const {product} = this.props;
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle} >Chi Tiết Sản Phẩm</Text>
                </Header>
                <View style={styles.body}>
                    <ScrollView>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Tên Sản Phẩm</Text>
                            <View style={styles.groupControl}>
                                <Text>{product.name}</Text>
                            </View>
                        </View>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Giá Bán</Text>
                            <View style={styles.groupControl}>
                                <Text>{product.salePrice}</Text>
                            </View>
                        </View>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Tồn Tối Thiểu</Text>
                            <View style={styles.groupControl}>
                                <Text>{product.minQuantity}</Text>
                            </View>
                        </View>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Nhóm Sản Phẩm</Text>
                            <View style={styles.groupControl}>
                                <Text>{product.categoryId}</Text>
                            </View>
                        </View>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Mô tả</Text>
                            <View style={styles.groupControl}>
                                <Text>{product.description}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <Footer>
                    <View >
                        <TouchableOpacity
                        onPress = { ()=> Actions.pop() }
                         style={styles.Btn} >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                            <Text style={styles.titleButton}>Quay Lại</Text>
                        </TouchableOpacity>
                    </View>
                </Footer>
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
        paddingBottom: 2,
        paddingRight: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        marginTop: 2,
        marginBottom: 2,
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: '400',
        paddingBottom: 2,
        paddingLeft: 10,
        paddingTop: 2,
    },
    InputContainer: {
        paddingBottom: 30,
        marginLeft: 10,
        marginRight: 10
    },
    controlContainer: {
        flex: 1,
        padding: 5,
        justifyContent: 'center',
        borderColor: '#7f8c8d',
        borderRadius: 10,
        borderWidth: 0.2,
        marginTop: 5,
    },
    groupControl: {
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 5,
        marginTop: 5,
        padding: 5,
        borderColor: 'rgba(41, 128, 185,1.0)',
        backgroundColor: '#FFFFFF'
    },
    textInput: {
        color: '#000000',
        fontSize: 16
    },
    errorStyle: {
        color: 'rgba(231, 76, 60,1.0)',
        fontSize: 18
    },
    label: {
        fontSize: 16,
        color: '#34495e',
        fontWeight: '500'
    },
    titleButton: {
        fontSize: 20,
        fontWeight: '500',
        paddingBottom: 5,
        paddingTop: 5,
        paddingLeft: 10,
        color: '#FFFFFF'
    },
    Btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#16a085',
        padding: 3,
        paddingRight: 15,
        paddingLeft: 15,
        borderRadius: 5,
    },
};
// const mapStateToProps(state, ownProps)=> {
//     return state
// }
export default connect(null, {})(ProductNew);
