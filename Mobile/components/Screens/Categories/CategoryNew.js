import React, { Component } from 'react';
import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
// import {Button} from 'native-base';
import { takePhoto, takeImage, uploadImageAsync } from "../../../utils/uploadImage";
import { URL } from '../../../../env';

class CategoryNew extends Component {
    state = {
        NameCategory: "",
        imageUrl: null,
        uploading: false
    }

    onNameCategoryChange(text) {
        console.log(text);
        this.setState({ NameCategory: text });
        console.log(this.state.NameCategory);
    }

    async onSelectImage() {
        const pickerResult = await takeImage();

        this.setState({ uploading: true });

        if (!pickerResult.cancelled) { 
            console.log(pickerResult);
                this.setState({ imageUrl: pickerResult.uri, uploading: false });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Nhóm Sản Phẩm</Text>
                </Header>
                <View style={styles.body}>
                    <ScrollView>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Tên Nhóm Sản Phẩm</Text>
                            <View style={styles.groupControl}>
                                <TextInput
                                    disableFullscreenUI={true}
                                    underlineColorAndroid={'transparent'}
                                    style={styles.textInput}
                                    blurOnSubmit={true}
                                    value={this.state.NameCategory}
                                    onChangeText={this.onNameCategoryChange.bind(this)}
                                    type="Text"
                                    name="nameCategory"
                                    placeholder="Điền tên nhóm sản phẩm:"
                                />
                                <Text>
                                    {this.error && <Text style={styles.errorStyle}>{this.error.identifier}</Text>}
                                </Text>
                            </View>
                            {this.state.imageUrl && <Image style = {styles.itemImage} source = {{uri: this.state.imageUrl}} />}
                            <View >
                                <TouchableOpacity style={styles.Btn} onPress = {this.onSelectImage.bind(this)}>                                    
                                    <Text style={styles.titleButton}>Chọn Ảnh</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <Footer>
                    <TouchableOpacity style={styles.Btn}>
                        <Ionicons name="ios-add-circle" size={32} color="#FFFFFF" />
                        <Text style={styles.titleButton}>Lưu</Text>
                    </TouchableOpacity>
                </Footer>
            </View>
        );
    }
}

const widthScreen = Dimensions.get('window').width;
const widthImage = widthScreen - 25;
const styles = {
    container: stylesCommon.container,
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headTitle: stylesCommon.headTitle,
    InputContainer: {
        paddingBottom: 30,
        marginLeft: 10,
        marginRight: 10
    },
    controlContainer: {
        padding: 5
    },
    groupControl: {
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 10,
        marginTop: 5,
        padding: 5,
        borderColor: 'rgba(41, 128, 185,1.0)',
        backgroundColor: "#16a085"
    },
    textInput: {
        color: 'white',
        fontSize: 16
    },
    errorStyle: {
        color: 'rgba(231, 76, 60,1.0)',
        fontSize: 18
    },
    label: {
        fontSize: 18,
        color: '#34495e',
        fontWeight: '500'
    },
    titleButton: {
        fontSize: 20,
        fontWeight: '500',
        alignSelf: 'center',
        paddingBottom: 5,
        paddingTop: 5,
        paddingLeft: 10,
        color: '#FFFFFF'
    },
    Btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: "#f39c12",
        padding: 3,
        paddingRight: 15,
        paddingLeft: 15,
        borderRadius: 5,
    },
    itemImage: {
        width: widthImage,
        height: (widthImage * 0.45),
        marginBottom: 15,
        marginTop: 5
    },

}
// const mapStateToProps(state, ownProps)=> {
//     return state
// }
export default CategoryNew;