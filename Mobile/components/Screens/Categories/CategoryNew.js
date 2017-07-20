import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
// import {Button} from 'native-base';
import { takeImage, uploadImageAsync } from '../../../utils/uploadImage';
import { URL } from '../../../../env';
import { ADD_CATEGORY, ADD_CATEGORY_PENDING, 
    CATEGORY_CHANGE_FAIL, CATEGORY_CHANGE_SUCCESS, 
     } from '../../../actions';
import { AddNewCategory } from '../../../actions/categoryActions';

class CategoryNew extends React.Component {
    state = {
        Name: '',
        Description: '',
        imageUrl: null,
        uploading: false
    }

    async onSelectImage() {
        const pickerResult = await takeImage();

        this.setState({ uploading: true });

        if (!pickerResult.cancelled) {
            this.setState({ imageUrl: pickerResult.uri, uploading: false });
        }
    }

    onSavePress() {
        this.props.AddNewCategory(this.state, this.state.imageUrl);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Nhóm Sản Phẩm</Text>
                </Header>
                <View style={styles.body}>
                    <View style = {styles.card}>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Tên Nhóm Sản Phẩm</Text>
                            <View style={styles.groupControl}>
                                <TextInput
                                    disableFullscreenUI
                                    underlineColorAndroid={'transparent'}
                                    style={styles.textInput}
                                    blurOnSubmit
                                    value={this.state.Name}
                                    onChangeText={text => this.setState({ Name: text })}
                                    type="Text"
                                    name="Name"
                                    placeholder="Điền tên nhóm sản phẩm:"
                                />
                                <Text>
                                    {this.error && <Text style={styles.errorStyle}>{this.error.Name}</Text>}
                                </Text>
                            </View>

                            <View style={styles.controlContainer}>
                                <Text style={styles.label} >Mô tả</Text>
                                <View style={styles.groupControl}>
                                    <TextInput
                                        multiline
                                        numberOfLines={8}
                                        disableFullscreenUI
                                        underlineColorAndroid={'transparent'}
                                        style={styles.textInput}
                                        blurOnSubmit
                                        value={this.state.Description}
                                        onChangeText={text => this.setState({ Description: text })}
                                        type="Text"
                                        name="Description"
                                        placeholder="Mô tả sản phẩm"
                                    />
                                    <Text>
                                        {this.error && <Text style={styles.errorStyle}>{this.error.Description}</Text>}
                                    </Text>
                                </View>
                            </View>
                            {this.state.imageUrl && <Image style={styles.itemImage} source={{ uri: this.state.imageUrl }} />}
                            <View >
                                <TouchableOpacity style={styles.Btn} onPress={this.onSelectImage.bind(this)}>
                                    <Text style={styles.titleButton}>Chọn Ảnh</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <Footer>
                    <View style={styles.FooterGroupButton}>
                        <TouchableOpacity 
                            onPress = {this.onSavePress.bind(this)}
                            style={[styles.Btn, styles.footerBtn]}
                        >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                            <Text style={styles.titleButton}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress = { Actions.pop() }
                            style={[styles.Btn, styles.footerBtn]}>
                            <Ionicons name="ios-close-circle-outline" size={25} color="#FFFFFF" />
                            <Text style={styles.titleButton}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.Btn, styles.footerBtn]} onPress = {()=> Actions.Products()}>
                            <Ionicons name="ios-folder-open-outline" size={25} color="#FFFFFF" />
                            <Text style={styles.titleButton}>DS Sản Phẩm</Text>
                        </TouchableOpacity>
                    </View>
                </Footer>
            </View>
        );
    }
}

const widthScreen = Dimensions.get('window').width;
const widthImage = widthScreen - 25;
const styles = {
    container: stylesCommon.container,
    body: stylesCommon.body,
    headTitle: stylesCommon.headTitle,
    card: {
        shadowColor: '#000000',
        shadowOffset: { width: 1, height: 3 },
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        shadowOpacity: 0.1,
        marginTop: 5,
        backgroundColor: '#FFFFFF'
    },
    InputContainer: {
        paddingBottom: 30,
    },
    controlContainer: {
        padding: 5,
        justifyContent: 'center',
    },
    groupControl: {
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 10,
        marginTop: 5,
        padding: 5,
        borderColor: 'rgba(41, 128, 185,1.0)',
        backgroundColor: '#ecf0f1'
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
        fontSize: 18,
        color: '#34495e',
        fontWeight: '500'
    },
    titleButton: {
        fontSize: 16,
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
        backgroundColor: '#27ae60',
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
    footerBtn: {
        marginRight: 3,
        marginLeft: 3
    },
    FooterGroupButton: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
};
// const mapStateToProps(state, ownProps)=> {
//     return state
// }
export default connect(null, {
    AddNewCategory
})(CategoryNew);
