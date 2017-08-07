import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, TextInput, Alert } from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { takeImage, uploadImageAsync } from '../../../utils/uploadImage';
import { URL } from '../../../../env';
import {
    ADD_CUSTOMER, ADD_CUSTOMER_PENDING,
    CUSTOMER_CHANGE_FAIL, CUSTOMER_CHANGE_SUCCESS,
} from '../../../actions';
import { AddNewCustomer, CustomerChange, resetData } from '../../../actions/customerAction';
import { AppLoading } from 'expo';
import { Spinner } from '../../commons/Spinner';

class CustomerNew extends React.Component {
    state = {        
    }
    
    componentWillMount() {
        this.props.resetData();
    }
    
    onSavePress() {
        Alert.alert(
            'Yêu cầu xác nhận',
            `Bạn chắc chắn muốn lưu thông tin : ${this.props.Name} ?`,
            [
                {
                    text: 'Xác Nhận',
                    onPress: () => {
                        const { error, Name, Description, AddNewCustomer, loading } = this.props;
                        AddNewCustomer({ Name, Description });

                    }
                },
                { text: 'Hủy', onPress: () => console.log('cancel Pressed') },
            ]
        );
    }
    onDelete() {
        Alert.alert(
            'Yêu cầu xác nhận',
            `Bạn chắc chắn muốn xóa Khách Hàng: ${this.props.Name} ?`,
            [
                {
                    text: 'Xác Nhận',
                    onPress: () => this.props.CustomerDelete(this.props.customer.id)
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
                    style={[styles.Btn, styles.footerBtn]} onPress={() => Actions.customerSearch()}>
                    <Ionicons name="ios-folder-open-outline" size={25} color="#FFFFFF" />
                    <Text style={styles.titleButton}>DS Nhóm</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const { error, Name, Description, loading, CustomerChange } = this.props;

        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Nhóm Khách Hàng</Text>
                </Header>
                <View style={styles.body}>
                    <View style={styles.card}>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Tên Khách Hàng</Text>
                            <View style={styles.groupControl}>
                                <TextInput
                                    editable={this.state.editMode}
                                    disableFullscreenUI
                                    underlineColorAndroid={'transparent'}
                                    style={styles.textInput}
                                    blurOnSubmit
                                    value={Name}
                                    onChangeText={text => CustomerChange({ prop: 'Name', value: text })}
                                    type="Text"
                                    name="Name"
                                    placeholder="Điền tên khách hàng:"
                                />
                                {error && <Text style={styles.errorStyle}>{error.Name}</Text>}
                            </View>

                            <View style={styles.controlContainer}>
                                <Text style={styles.label} >Địa chỉ</Text>
                                <View style={styles.groupControl}>
                                    <TextInput
                                        editable={this.state.editMode}
                                        disableFullscreenUI
                                        underlineColorAndroid={'transparent'}
                                        style={styles.textInput}
                                        blurOnSubmit
                                        value={Address}
                                        onChangeText={text => CustomerChange({ prop: 'Address', value: text })}
                                        type="Text"
                                        name="Address"
                                        placeholder="Địa chỉ"
                                    />
                                    {error && <Text style={styles.errorStyle}>{error.Address}</Text>}
                                </View>
                            </View>
                            <View style={styles.controlContainer}>
                                <Text style={styles.label} >Điện thoại</Text>
                                <View style={styles.groupControl}>
                                    <TextInput
                                        editable={this.state.editMode}
                                        disableFullscreenUI
                                        underlineColorAndroid={'transparent'}
                                        style={styles.textInput}
                                        blurOnSubmit
                                        value={Phone}
                                        onChangeText={text => CustomerChange({ prop: 'Phone', value: text })}
                                        type="Text"
                                        name="Phone"
                                        placeholder="Điện thoại"
                                    />
                                    {error && <Text style={styles.errorStyle}>{error.Address}</Text>}
                                </View>
                            </View>
                            <View style={styles.controlContainer}>
                                <Text style={styles.label} >Email</Text>
                                <View style={styles.groupControl}>
                                    <TextInput
                                        editable={this.state.editMode}
                                        disableFullscreenUI
                                        underlineColorAndroid={'transparent'}
                                        style={styles.textInput}
                                        blurOnSubmit
                                        value={Email}
                                        onChangeText={text => CustomerChange({ prop: 'Email', value: text })}
                                        type="Text"
                                        name="Email"
                                        placeholder="Thư điện tử"
                                    />
                                    {error && <Text style={styles.errorStyle}>{error.Email}</Text>}
                                </View>
                            </View>
                            <View style={styles.controlContainer}>
                                <Text style={styles.label} >Số ngày tối đa cho phép nợ</Text>
                                <View style={styles.groupControl}>
                                    <TextInput
                                        editable={this.state.editMode}
                                        disableFullscreenUI
                                        underlineColorAndroid={'transparent'}
                                        style={styles.textInput}
                                        blurOnSubmit
                                        value={Overdue}
                                        onChangeText={text => CustomerChange({ prop: 'Overdue', value: text })}
                                        type="Text"
                                        name="Overdue"
                                        placeholder="Số ngày tối đa (30)"
                                    />
                                    {error && <Text style={styles.errorStyle}>{error.Overdue}</Text>}
                                </View>
                            </View>
                            <View style={styles.controlContainer}>
                                <Text style={styles.label} >Số nợ tối đa</Text>
                                <View style={styles.groupControl}>
                                    <TextInput
                                        editable={this.state.editMode}
                                        disableFullscreenUI
                                        underlineColorAndroid={'transparent'}
                                        style={styles.textInput}
                                        blurOnSubmit
                                        value={ExcessDebt}
                                        onChangeText={text => CustomerChange({ prop: 'ExcessDebt', value: text })}
                                        type="Text"
                                        name="ExcessDebt"
                                        placeholder="Số nợ tối đa"
                                    />
                                    {error && <Text style={styles.errorStyle}>{error.ExcessDebt}</Text>}
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
        fontSize: 14,
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
    const { Name, Description, loading } = state.customers;
    return { Name, Description, loading }
}
export default connect(mapStateToProps, {
    AddNewCustomer,
    CustomerChange,
    resetData
})(CustomerNew);
