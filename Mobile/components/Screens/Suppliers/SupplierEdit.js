import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, Alert, Picker, ScrollView } from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { URL } from '../../../../env';
import {
    ADD_SUPPLIER, ADD_SUPPLIER_PENDING,
    SUPPLIER_CHANGE_FAIL, SUPPLIER_CHANGE_SUCCESS,
} from '../../../actions';
import { SupplierUpdate, SupplierChange, SupplierDelete, loadSupplierDataFromSqlite } from '../../../actions/supplierAction';
import { Spinner } from '../../commons/Spinner';
import SqlService from '../../../database/sqliteService';
import { formatMoney, formatNumber, unformat } from '../../../../Shared/utils/format';

class SupplierEdit extends React.Component {
    state = {
        editMode: false
    }

    constructor(nextProps) {
        super(nextProps);
    }

    componentWillMount() {
        const { id } = this.props.supplier;
        this.props.loadSupplierDataFromSqlite(id);
    };

    onSavePress() {
        Alert.alert(
            'Yêu cầu xác nhận',
            `Bạn chắc chắn muốn lưu thông tin: ${this.props.Name} ?`,
            [
                {
                    text: 'Xác Nhận',
                    onPress: () => {
                        const {
                            error,
                            Id,
                            Name,
                            Address,
                            Phone,
                            Email,
                            CurentDebt,
                            Overdue,
                            ExcessDebt,
                            CompanyName,
                            CompanyAdress,
                            DirectorName,
                            BankNumber,
                            BankName,
                            TaxCode,
                            Fax,
                            SupplierUpdate,
                            loading } = this.props;
                        
                        console.log({
                            Id,
                            Name,
                            Address,
                            Phone,
                            Email,
                            CurentDebt,
                            Overdue,
                            ExcessDebt,
                            CompanyName,
                            CompanyAdress,
                            DirectorName,
                            BankNumber,
                            BankName,
                            TaxCode,
                            Fax,
                        })
                        SupplierUpdate({
                            Id,
                            Name,
                            Address,
                            Phone,
                            Email,
                            CurentDebt: CurentDebt,
                            Overdue,
                            ExcessDebt,
                            CompanyName,
                            CompanyAdress,
                            DirectorName,
                            BankNumber,
                            BankName,
                            TaxCode,
                            Fax,
                        });

                    }
                },
                { text: 'Hủy', onPress: () => console.log('cancel Pressed') },
            ]
        );
    }
    onDelete() {
        Alert.alert(
            'Yêu cầu xác nhận',
            `Bạn chắc chắn muốn xóa Nhà Cung Cấp: ${this.props.Name} ?`,
            [
                {
                    text: 'Xác Nhận',
                    onPress: () => this.props.SupplierDelete(this.props.supplier.id)
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
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={!this.state.editMode}
                    style={styles.Btn}
                    onPress={this.onDelete.bind(this)}
                >
                    <Ionicons name="ios-close-circle-outline" size={25} color="#e74c3c" />
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const {
            error, loading, SupplierChange
        } = this.props;
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Sửa Nhà Cung Cấp</Text>
                </Header>
                <View style={styles.body}>
                    <View style={styles.card}>
                        <ScrollView>
                            <View style={styles.controlContainer}>
                                <Text style={styles.label} >Tên Nhà Cung Cấp</Text>
                                <View style={styles.groupControl}>
                                    <TextInput
                                        editable={this.state.editMode}
                                        disableFullscreenUI
                                        underlineColorAndroid={'transparent'}
                                        style={styles.textInput}
                                        blurOnSubmit
                                        value={this.props.Name}
                                        onChangeText={text => SupplierChange({ prop: 'Name', value: text })}
                                        type="Text"
                                        name="Name"
                                        placeholder="Điền tên nhà cung cấp:"
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
                                            value={this.props.Address}
                                            onChangeText={text => SupplierChange({ prop: 'Address', value: text })}
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
                                            value={this.props.Phone}
                                            onChangeText={text => SupplierChange({ prop: 'Phone', value: text })}
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
                                            value={this.props.Email}
                                            onChangeText={text => SupplierChange({ prop: 'Email', value: text })}
                                            type="Text"
                                            name="Email"
                                            placeholder="Thư điện tử"
                                        />
                                        {error && <Text style={styles.errorStyle}>{error.Email}</Text>}
                                    </View>
                                </View>
                                <View style={styles.controlContainer}>
                                    <Text style={styles.label} >Công nợ Hiện Tại</Text>
                                    <View style={styles.groupControl}>
                                        <TextInput
                                            editable={this.state.editMode}
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={formatNumber(this.props.CurentDebt) }
                                            onChangeText={text => SupplierChange({ prop: 'CurentDebt', value: unformat(text) })}
                                            type="Text"
                                            name="CurentDebt"
                                            placeholder="Công nợ hiện tại (nếu có)"
                                        />
                                        {error && <Text style={styles.errorStyle}>{error.Overdue}</Text>}
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
                                            value={this.props.Overdue}
                                            onChangeText={text => SupplierChange({ prop: 'Overdue', value: text })}
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
                                            value={formatNumber(this.props.ExcessDebt)}
                                            onChangeText={text => SupplierChange({ prop: 'ExcessDebt', value: unformat(text) })}
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
                                            editable={this.state.editMode}
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.CompanyName}
                                            onChangeText={text => SupplierChange({ prop: 'CompanyName', value: text })}
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
                                            editable={this.state.editMode}
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.CompanyAdress}
                                            onChangeText={text => SupplierChange({ prop: 'CompanyAdress', value: text })}
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
                                            editable={this.state.editMode}
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.DirectorName}
                                            onChangeText={text => SupplierChange({ prop: 'DirectorName', value: text })}
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
                                            editable={this.state.editMode}
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.BankNumber}
                                            onChangeText={text => SupplierChange({ prop: 'BankNumber', value: text })}
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
                                            editable={this.state.editMode}
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.BankName}
                                            onChangeText={text => SupplierChange({ prop: 'BankName', value: text })}
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
                                            editable={this.state.editMode}
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.TaxCode}
                                            onChangeText={text => SupplierChange({ prop: 'TaxCode', value: text })}
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
                                            editable={this.state.editMode}
                                            disableFullscreenUI
                                            underlineColorAndroid={'transparent'}
                                            style={styles.textInput}
                                            blurOnSubmit
                                            value={this.props.Fax}
                                            onChangeText={text => SupplierChange({ prop: 'Fax', value: text })}
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
    const {
        Id,
        Name,
        Address,
        Phone,
        Email,
        CurentDebt,
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
    } = state.suppliers;
    return {
        Id,
        Name,
        Address,
        Phone,
        Email,
        CurentDebt,
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
    };
};
export default connect(mapStateToProps, {
    SupplierChange,
    SupplierUpdate,
    SupplierDelete,
    loadSupplierDataFromSqlite,
})(SupplierEdit);
