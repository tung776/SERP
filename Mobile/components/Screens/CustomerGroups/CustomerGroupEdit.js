import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { takeImage, uploadImageAsync } from '../../../utils/uploadImage';
import { URL } from '../../../../env';
import {
    ADD_CUSTOMER_GROUP, ADD_CUSTOMER_GROUP_PENDING,
    CUSTOMER_GROUP_CHANGE_FAIL, CUSTOMER_GROUP_CHANGE_SUCCESS,
} from '../../../actions';
import { CustomerGroupUpdate, CustomerGroupChange, CustomerGroupDelete, loadCustomerGroupDataFromSqlite } from '../../../actions/customerGroupAction';
import { Spinner } from '../../commons/Spinner';
import SqlService from '../../../database/sqliteService';

class CustomerGroupEdit extends React.Component {
    state = {
        editMode: false
    }

    constructor(nextProps) {
        super(nextProps);
    }

    componentWillMount() {
        const { id } = this.props.customerGroup;
        this.props.loadCustomerGroupDataFromSqlite(id);

    };

    onSavePress() {
        Alert.alert(
            'Yêu cầu xác nhận',
            `Bạn chắc chắn muốn lưu thông tin nhóm: ${this.props.Name} ?`,
            [
                {
                    text: 'Xác Nhận',
                    onPress: () => {
                        const { error, Id, Name, Description, CustomerGroupUpdate, loading } = this.props;
                        CustomerGroupUpdate({ Id, Name, Description });

                    }
                },
                { text: 'Hủy', onPress: () => console.log('cancel Pressed') },
            ]
        );
    }
    onDelete() {
        Alert.alert(
            'Yêu cầu xác nhận',
            `Bạn chắc chắn muốn xóa Nhóm Khách Hàng: ${this.props.Name} ?`,
            [
                {
                    text: 'Xác Nhận',
                    onPress: () => this.props.CustomerGroupDelete(this.props.customerGroup.id)
                },
                { text: 'Hủy', onPress: () => console.log('cancel Pressed') },
            ]
        );
    }

    editModeToggle() {
        this.setState({ editMode: !this.state.editMode });
    }
    renderButton() {
        
        return (
                <View style={styles.FooterGroupButton} >
                    <TouchableOpacity
                        style={[styles.Btn, { backgroundColor: '#2ecc71' }]}
                        onPress={this.editModeToggle.bind(this)}
                    >
                        <Ionicons name="ios-apps-outline" size={25} color="#FFFFFF" />
                        {this.state.editMode ? (<Text style={styles.titleButton}>Hủy</Text>) :
                            (<Text style={styles.titleButton}>Sửa</Text>)
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.Btn, {
                                backgroundColor: this.state.editMode ? '#e67e22' : '#34495e'
                            }
                        ]}
                        disabled={!this.state.editMode}
                        onPress={this.onSavePress.bind(this)}
                    >
                        <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                        <Text style={styles.titleButton}>Lưu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={!this.state.editMode}
                        style={styles.Btn}
                        onPress={this.onDelete.bind(this)}
                    >
                        <Ionicons name="ios-close-circle-outline" size={25} color="#e74c3c" />
                        <Text style={styles.titleButton}>Xóa</Text>
                    </TouchableOpacity>
                </View>
                );
    }

    render() {
        const {error, Name, Description, loading, CustomerGroupChange } = this.props;
        return (
            <View style={styles.container}>
                    <Header>
                        <Text style={styles.headTitle}>Sửa Nhóm Khách Hàng</Text>
                    </Header>
                    <View style={styles.body}>
                        <View style={styles.card}>
                            <View style={styles.controlContainer}>
                                <Text style={styles.label} >Tên Nhóm Khách Hàng</Text>
                                <View style={styles.groupControl}>
                                    <TextInput
                                        editable={this.state.editMode}
                                        disableFullscreenUI
                                        underlineColorAndroid={'transparent'}
                                        style={styles.textInput}
                                        blurOnSubmit
                                        value={Name}
                                        onChangeText={text => CustomerGroupChange({ prop: 'Name', value: text })}
                                        type="Text"
                                        name="Name"
                                        placeholder="Điền tên nhóm khách hàng:"
                                    />
                                    {error && <Text style={styles.errorStyle}>{error.Name}</Text>}
                                </View>

                                <View style={styles.controlContainer}>
                                    <Text style={styles.label} >Mô tả</Text>
                                    <View style={styles.groupControl}>
                                        <TextInput
                                            editable={this.state.editMode}
                                            multiline
                                            numberOfLines={8}
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={Description}
                                            onChangeText={text => CustomerGroupChange({ prop: 'Description', value: text })}
                                            type="Text"
                                            name="Description"
                                            placeholder="Mô tả khách hàng"
                                        />
                                        {error && <Text style={styles.errorStyle}>{error.Description}</Text>}
                                    </View>
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
        shadowOffset: {width: 1, height: 3 },
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
        borderRadius: 8,
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
    const {Id, Name, Description, loading } = state.customerGroups;
    return {Id, Name, Description, loading };
};
export default connect(mapStateToProps, {
                    CustomerGroupChange,
                CustomerGroupUpdate,
    CustomerGroupDelete,
    loadCustomerGroupDataFromSqlite
})(CustomerGroupEdit);
