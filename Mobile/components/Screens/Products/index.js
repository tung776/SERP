import React, { Component } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, TouchableWithoutFeedback, TextInput } from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';

class Products extends Component {
    state = {
        searchText: "",
        error: null
    }
    addNewGroupBtnPress() {
        console.log("go here");
        Actions.main();
    }

    onSearchInputChange(text) {
        this.setState({ searchText: text })
    }

    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Danh Sách Sản Phẩm</Text>
                </Header>
                <View style={styles.body}>
                    <ScrollView>                        
                        <View style={styles.InputContainer}>
                        <Text style={styles.searchTitle}>Tìm Kiếm Sản Phẩm</Text>
                            <View style = {styles.groupControl} >
                                <TextInput
                                    disableFullscreenUI={true}
                                    underlineColorAndroid={'transparent'}
                                    style={styles.textInput}
                                    blurOnSubmit={true}
                                    value={this.state.searchText}
                                    onChangeText={this.onSearchInputChange.bind(this)}
                                    type="Text"
                                    name="search"
                                    placeholder="Điền tên sản phẩm bạn muốn tìm :"
                                />
                                <Ionicons name="ios-search" size={32} color="#16a085" />
                            </View>
                        </View>
                        <Text>
                            {this.state.error && <Text style={styles.errorStyle}>{this.state.error.identifier}</Text>}
                        </Text>
                        <TouchableWithoutFeedback onPress={() => Actions.Products()} >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Mờ 01 - 50 %</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Mờ 01 - 75 %</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Mờ 01 - 100 %</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Mờ 02 - 30 %</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Lót PU - 02</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Lót PU - 05</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Lót PU - 08</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Lót NC - 02</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Lót NC - 05</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Lót NC - 08</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Cứng 75%</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Cứng 65%</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>Cứng 404</Text>
                                <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </View>
                <Footer>
                    <TouchableOpacity style={styles.addNewGroupBtn} onPress={() => { Actions.ProductNew() }}>
                        <Ionicons name="ios-add-circle" size={32} color="#FFFFFF" />
                        <Text style={{ alignSelf: "center", paddingLeft: 10, fontSize: 16, color: "#FFFFFF", fontWeight: "600" }}>Thêm Sản Phẩm</Text>
                    </TouchableOpacity>
                </Footer>
            </View>
        );
    }
}

const widthScreen = Dimensions.get('window').width;
const widthImage = widthScreen - 30;
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
        fontSize: 17,
        fontWeight: '400',
        paddingBottom: 2,
        paddingLeft: 10,
        paddingTop: 2,
    },
    searchTitle: {
        fontSize: 17,
        fontWeight: '400',
        paddingBottom: 2,
        paddingLeft: 10,
        paddingTop: 2,
        color: '#2c3e50'
    },
    addNewGroupBtn: {
        flexDirection: 'row',
        backgroundColor: "#2ecc71",
        padding: 3,
        paddingRight: 15,
        paddingLeft: 15,
        borderRadius: 5,
    },
    InputContainer: {
        flex: 1,
        // flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        borderRadius: 5,
        backgroundColor: '#2980b9'
    },
    groupControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 10,
        padding: 5,
        borderColor: '#FFFFFF'
    },
    textInput: {
        flex: 1,
        color: 'white'
    },
    errorStyle: {
        color: 'rgba(231, 76, 60,1.0)',
        fontSize: 18
    },
}
// const mapStateToProps(state, ownProps)=> {
//     return state
// }
export default connect()(Products);