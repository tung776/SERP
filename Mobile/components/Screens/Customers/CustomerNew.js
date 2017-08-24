import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, TextInput, Alert, Picker, ScrollView } from 'react-native';
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
import { loadCustomerGroupListDataFromSqlite } from '../../../actions/customerGroupAction';
import { AddNewCustomer, CustomerChange, resetData } from '../../../actions/customerAction';
import { AppLoading } from 'expo';
import { Spinner } from '../../commons/Spinner';

class CustomerNew extends React.Component {
    state = {
    }

    componentWillMount() {
        this.props.resetData();
        this.props.loadCustomerGroupListDataFromSqlite();
    }

    onSavePress() {
        Alert.alert(
            'Yêu cầu xác nhận',
            `Bạn chắc chắn muốn lưu thông tin : ${this.props.Name} ?`,
            [
                {
                    text: 'Xác Nhận',
                    onPress: () => {
                        const {
                            error,
                            Id,
                            CustomerGroupId,
                            Name,
                            Address,
                            Phone,
                            Email,
                            Overdue,
                            ExcessDebt,
                            DirectorName,
                            BankNumber,
                            BankName,
                            CompanyName,
                            CompanyAdress,
                            TaxCode,
                            Fax,
                            AddNewCustomer,
                            loading } = this.props;
                        AddNewCustomer({
                            Id,
                            CustomerGroupId,
                            Name,
                            Address,
                            Phone,
                            Email,
                            Overdue,
                            ExcessDebt,
                            DirectorName,
                            BankNumber,
                            BankName,
                            CompanyName,
                            CompanyAdress,
                            TaxCode,
                            Fax,
                        });
                    }
                },
                { text: 'Hủy', onPress: () => console.log('cancel Pressed') },
            ]
        );
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
        const { error, CustomerChange } = this.props;
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Thêm Khách Hàng</Text>
                </Header>
                <View style={styles.body}>
                    <View style={styles.card}>
                        <ScrollView>
                            <View style={styles.controlContainer}>
                                <Text style={styles.label} >Tên Khách Hàng</Text>
                                <View style={styles.groupControl}>
                                    <TextInput                                        
                                        disableFullscreenUI
                                        underlineColorAndroid={'transparent'}
                                        style={styles.textInput}
                                        blurOnSubmit
                                        value={this.props.Name}
                                        onChangeText={text => CustomerChange({ prop: 'Name', value: text })}
                                        type="Text"
                                        name="Name"
                                        placeholder="Điền tên khách hàng:"
                                    />
                                    {error && <Text style={styles.errorStyle}>{error.Name}</Text>}
                                </View>

                                <View style={styles.controlContainer}>
                                    <Text style={styles.label} >Nhóm Khách Hàng</Text>
                                    <View style={styles.groupControl}>
                                        <Picker
                                            enabled={this.state.editMode}
                                            selectedValue={this.props.CustomerGroupId}
                                            onValueChange={
                                                (itemValue, itemIndex) => CustomerChange({ prop: 'CustomerGroupId', value: itemValue })
                                            }
                                        >
                                            {this.props.customerGroups && this.props.customerGroups.map((item) => (
                                                <Picker.Item key={item.id} label={item.name} value={item.id} />
                                            ))
                                            }
                                        </Picker>
                                    </View>
                                </View>

                                <View style={styles.controlContainer}>
                                    <Text style={styles.label} >Địa chỉ</Text>
                                    <View style={styles.groupControl}>
                                        <TextInput                                            
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.Address}
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
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.Phone}
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
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.Email}
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
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.Overdue}
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
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.ExcessDebt}
                                            onChangeText={text => CustomerChange({ prop: 'ExcessDebt', value: text })}
                                            type="Text"
                                            name="ExcessDebt"
                                            placeholder="Số nợ tối đa"
                                        />
                                        {error && <Text style={styles.errorStyle}>{error.ExcessDebt}</Text>}
                                    </View>
                                </View>
                                <View style={styles.controlContainer}>
                                    <Text style={styles.label} >Tên Công Ty</Text>
                                    <View style={styles.groupControl}>
                                        <TextInput                                            
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.CompanyName}
                                            onChangeText={text => CustomerChange({ prop: 'CompanyName', value: text })}
                                            type="Text"
                                            name="CompanyName"
                                            placeholder="Tên công ty"
                                        />
                                        {error && <Text style={styles.errorStyle}>{error.CompanyName}</Text>}
                                    </View>
                                </View>
                                <View style={styles.controlContainer}>
                                    <Text style={styles.label} >Địa chỉ công ty</Text>
                                    <View style={styles.groupControl}>
                                        <TextInput                                            
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.CompanyAdress}
                                            onChangeText={text => CustomerChange({ prop: 'CompanyAdress', value: text })}
                                            type="Text"
                                            name="CompanyAdress"
                                            placeholder="Địa chỉ công ty"
                                        />
                                        {error && <Text style={styles.errorStyle}>{error.CompanyAdress}</Text>}
                                    </View>
                                </View>
                                <View style={styles.controlContainer}>
                                    <Text style={styles.label} >Tên Giám Đốc</Text>
                                    <View style={styles.groupControl}>
                                        <TextInput                                            
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.DirectorName}
                                            onChangeText={text => CustomerChange({ prop: 'DirectorName', value: text })}
                                            type="Text"
                                            name="DirectorName"
                                            placeholder="Tên Giám Đốc"
                                        />
                                        {error && <Text style={styles.errorStyle}>{error.DirectorName}</Text>}
                                    </View>
                                </View>
                                <View style={styles.controlContainer}>
                                    <Text style={styles.label} >Số tài khoản</Text>
                                    <View style={styles.groupControl}>
                                        <TextInput                                            
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.BankNumber}
                                            onChangeText={text => CustomerChange({ prop: 'BankNumber', value: text })}
                                            type="Text"
                                            name="BankNumber"
                                            placeholder="Số tài khoản"
                                        />
                                        {error && <Text style={styles.errorStyle}>{error.BankNumber}</Text>}
                                    </View>
                                </View>
                                <View style={styles.controlContainer}>
                                    <Text style={styles.label} >Tên ngân hàng</Text>
                                    <View style={styles.groupControl}>
                                        <TextInput                                            
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.BankName}
                                            onChangeText={text => CustomerChange({ prop: 'BankName', value: text })}
                                            type="Text"
                                            name="BankName"
                                            placeholder="Tên ngân hàng"
                                        />
                                        {error && <Text style={styles.errorStyle}>{error.BankName}</Text>}
                                    </View>
                                </View>
                                <View style={styles.controlContainer}>
                                    <Text style={styles.label} >Mã số thuế</Text>
                                    <View style={styles.groupControl}>
                                        <TextInput                                            
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.TaxCode}
                                            onChangeText={text => CustomerChange({ prop: 'TaxCode', value: text })}
                                            type="Text"
                                            name="TaxCode"
                                            placeholder="Mã số thuế"
                                        />
                                        {error && <Text style={styles.errorStyle}>{error.TaxCode}</Text>}
                                    </View>
                                </View>
                                <View style={styles.controlContainer}>
                                    <Text style={styles.label} >Số Fax</Text>
                                    <View style={styles.groupControl}>
                                        <TextInput                                            
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.Fax}
                                            onChangeText={text => CustomerChange({ prop: 'Fax', value: text })}
                                            type="Text"
                                            name="Fax"
                                            placeholder="Số Fax"
                                        />
                                        {error && <Text style={styles.errorStyle}>{error.Fax}</Text>}
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
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
    const {
        Id,
        CustomerGroupId,
        Name,
        Address,
        Phone,
        Email,
        Overdue,
        ExcessDebt,
        CompanyName,
        CompanyAdress,
        DirectorName,
        BankNumber,
        BankName,
        TaxCode,
        Fax,
        loading
    } = state.customers;
    const { customerGroups } = state.customerGroups;
    return {
        Id,
        CustomerGroupId,
        Name,
        Address,
        Phone,
        Email,
        Overdue,
        ExcessDebt,
        CompanyName,
        CompanyAdress,
        DirectorName,
        BankNumber,
        BankName,
        TaxCode,
        Fax,
        loading,
        customerGroups
    };
};

export default connect(mapStateToProps, {
    AddNewCustomer,
    CustomerChange,
    resetData,
    loadCustomerGroupListDataFromSqlite
})(CustomerNew);
