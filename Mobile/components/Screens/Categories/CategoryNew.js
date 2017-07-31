import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, Spin } from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { takeImage, uploadImageAsync } from '../../../utils/uploadImage';
import { URL } from '../../../../env';
import {
    ADD_CATEGORY, ADD_CATEGORY_PENDING,
    CATEGORY_CHANGE_FAIL, CATEGORY_CHANGE_SUCCESS,
} from '../../../actions';
import { AddNewCategory, CategoryChange } from '../../../actions/categoryActions';
import { AppLoading } from 'expo';
import { Spinner } from '../../commons/Spinner';

class CategoryNew extends React.Component {
    state = {
        Name: '',
        Description: '',
        ImageUrl: null,
        uploading: false
    }

    async onSelectImage() {
        const pickerResult = await takeImage();

        this.setState({ uploading: true });

        if (!pickerResult.cancelled) {
            this.props.CategoryChange({ prop: "ImageUrl", value: pickerResult.uri });
            console.log(pickerResult.uri);
            this.setState({ ImageUrl: pickerResult.uri, uploading: false });
        }
    }

    onSavePress() {
        const { error, Name, Description, ImageUrl, AddNewCategory, loading } = this.props;
        // console.log({ Name, Description, ImageUrl });
        AddNewCategory({ Name, Description, ImageUrl });
    }
    renderButton() {
        if (this.props.loading) {
            return (
                <Spinner size='small' />
            );
        }
        return (
            <View style={styles.FooterGroupButton}>
                <TouchableOpacity
                    disabled={this.props.loading}
                    onPress={this.onSavePress.bind(this)}
                    style={[styles.Btn, styles.footerBtn]}
                >
                    <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                    <Text style={styles.titleButton}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={this.props.loading}
                    style={[styles.Btn, styles.footerBtn]}>
                    <Ionicons name="ios-close-circle-outline" size={25} color="#FFFFFF" />
                    <Text style={styles.titleButton}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={this.props.loading}
                    style={[styles.Btn, styles.footerBtn]} onPress={() => Actions.productList()}>
                    <Ionicons name="ios-folder-open-outline" size={25} color="#FFFFFF" />
                    <Text style={styles.titleButton}>DS Sản Phẩm</Text>
                </TouchableOpacity>
            </View>
        )
    }
    renderImage() {

        if (this.props.ImageUrl) {
            // console.log("this.props.ImageUrl ", this.props.ImageUrl)
            return (<Image style={styles.itemImage} source={{ uri: this.props.ImageUrl }} />);
        }
        return null;
    }
    render() {
        const { error, Name, Description, ImageUrl, loading, CategoryChange } = this.props;
        console.log("loading = ", loading);

        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Nhóm Sản Phẩm</Text>
                </Header>
                <View style={styles.body}>
                    <View style={styles.card}>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Tên Nhóm Sản Phẩm</Text>
                            <View style={styles.groupControl}>
                                <TextInput
                                    disableFullscreenUI
                                    underlineColorAndroid={'transparent'}
                                    style={styles.textInput}
                                    blurOnSubmit
                                    value={Name}
                                    onChangeText={text => CategoryChange({ prop: "Name", value: text })}
                                    type="Text"
                                    name="Name"
                                    placeholder="Điền tên nhóm sản phẩm:"
                                />
                                {error && <Text style={styles.errorStyle}>{error.Name}</Text>}
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
                                        value={Description}
                                        onChangeText={text => CategoryChange({ prop: "Description", value: text })}
                                        type="Text"
                                        name="Description"
                                        placeholder="Mô tả sản phẩm"
                                    />
                                    {error && <Text style={styles.errorStyle}>{error.Description}</Text>}
                                </View>
                            </View>
                            {this.renderImage()}
                            <View >
                                {
                                    this.props.loading ? <Spinner size='small' /> :
                                    <TouchableOpacity style={styles.Btn} onPress={this.onSelectImage.bind(this)}>
                                    <Text style={styles.titleButton}>Chọn Ảnh</Text>
                                </TouchableOpacity>}
                            </View>
                        </View>
                    </View>
                </View>
                <Footer>
                    {this.renderButton()}
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
const mapStateToProps = (state, ownProps) => {
    const { Name, Description, ImageUrl, loading } = state.newCategory;
    return { Name, Description, ImageUrl, loading }
}
export default connect(mapStateToProps, {
    AddNewCategory,
    CategoryChange
})(CategoryNew);
