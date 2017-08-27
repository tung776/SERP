import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Picker, Alert, FlatList } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { loadCustomerListDataFromSqlite } from '../../../actions/customerAction';
import { loadUnits, toggleProductToSelectList, resetSelectedProducts } from '../../../actions/productActions';
import { loadSaleOrderById, SaleOrderUpdate, SaleOrderChange } from '../../../actions/saleOrderActions';
import db from '../../../database/sqliteConfig';
import moment from '../../../../Shared/utils/moment';
import { formatMoney, formatNumber, unformat } from '../../../../Shared/utils/format';

class EditSaleOrder extends React.Component {
    state = {
        isExpanded: true,
        isExpandedTotal: true,
        customerId: '',
        debtCustomers: {},
        date: '',
        title: '',
        total: 0,
        totalIncludeVat: 0,
        vat: 0,
        pay: 0,
        newDebt: 0,
        oldebt: 0,
        saleOrderDetails: [],
        quoctes: [],
        editMode: false
    }
    componentWillMount() {
        console.log('saleOrder = ', this.props.saleOrder);

        this.props.loadSaleOrderById(this.props.saleOrder.id);

        if (!this.props.customers || this.props.customers.length == 0) {
            this.props.loadCustomerListDataFromSqlite();
        }
        if (!this.props.units || this.props.units.length == 0) {
            this.props.loadUnits();
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.selectedProducts && nextProps.selectedProducts.length > 0) {
            const saleOrderDetails = [...nextProps.selectedProducts];
            const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(this.props.oldDebt, this.props.pay, saleOrderDetails);
            this.props.SaleOrderChange({ prop: "saleOrderDetails", value: saleOrderDetails });
            this.props.SaleOrderChange({ prop: "total", value: total });
            this.props.SaleOrderChange({ prop: "newDebt", value: newDebt });
            this.props.SaleOrderChange({ prop: "totalIncludeVat", value: totalIncludeVat });
            this.props.SaleOrderChange({ prop: "vat", value: vat });
        }
    }

    onSave() {
        Alert.alert(
            'Xác Nhận',
            'Bạn chắc chắn muốn lưu hóa đơn',
            [
                {
                    text: 'Xác Nhận',
                    onPress: () => {
                        const {
                            date, title, customerId, total, totalIncludeVat, vat, pay,
                            newDebt, oldebt, saleOrderDetails
                        } = this.props;
                        this.props.AddNewSaleOrder({
                            date, title, customerId, total, totalIncludeVat, vat, pay,
                            newDebt, oldebt, saleOrderDetails, debtCustomerId: this.state.debtCustomers.id,
                            user: this.props.user
                        });
                    }
                },
                { text: 'Hủy', onPress: () => console.log('cancel Pressed') },
            ]
        );
    }

    onSelectProduct() {
        Actions.productSelector({ ProductSelected: this.props.saleOrderDetails });
    }

    onCustomerChanged(customerId) {
        this.props.loadDebtCustomersFromSqlite(customerId);
        this.props.customers.forEach((customer) => {
            if (customer.id === customerId) {
                this.props.loadQuocteByCustomerOrCustomerGroupIdFromSqlite(customerId, customer.customerGroupId);
            }

        })
        this.setState({ customerId });
    }

    caculateOrder(debt = 0, pay = 0, saleOrderDetails = []) {
        let total = 0,
            totalIncludeVat = 0,
            newDebt = 0;

        saleOrderDetails.forEach((order) => {
            const temp = order.salePrice * order.quantity;
            total += temp;
        });
        const vat = total * 0.1;
        totalIncludeVat = total + vat;
        newDebt = debt + totalIncludeVat - pay;
        return {
            total,
            newDebt,
            totalIncludeVat,
            vat
        };
    }

    caculatePriceOnUnitChanged(product, newUnitId) {
        let oldPrice = unformat(product.salePrice);
        let newRate = 1;
        this.props.units.forEach((unit) => {
            if (unit.id == product.unitId) {
                oldPrice = unformat(product.salePrice) / unit.rate;
                oldPrice = Math.round(oldPrice);
            }
            if (unit.id == newUnitId) {
                newRate = unit.rate;
            }
        });
        const saleOrderDetails = [...this.props.saleOrderDetails];
        saleOrderDetails.forEach((item) => {
            if (item.id === product.id) {
                item.salePrice = Math.round(oldPrice * newRate);
                item.unitId = newUnitId;
            }
        });
        
        const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(this.props.oldDebt, this.props.pay, saleOrderDetails);
        this.props.SaleOrderChange({ prop: "saleOrderDetails", value: saleOrderDetails });
        this.props.SaleOrderChange({ prop: "total", value: total });
        this.props.SaleOrderChange({ prop: "newDebt", value: newDebt });
        this.props.SaleOrderChange({ prop: "totalIncludeVat", value: totalIncludeVat });
        this.props.SaleOrderChange({ prop: "vat", value: vat });
    }

    editModeToggle() {
        this.setState({ editMode: !this.state.editMode });
    }

    renderProductList() {
        if (this.props.saleOrderDetails) {
            return (
                <FlatList
                    style={{ marginTop: 10, marginBottom: 10 }}
                    data={this.props.saleOrderDetails}
                    renderItem={({ item }) => {
                        if (item) {
                            return (
                                <View
                                    style={{ flexDirection: 'row', height: 80, borderBottomWidth: 3, borderBottomColor: '#bdc3c7', backgroundColor: '#ecf0f1', padding: 5 }}
                                >
                                    <TouchableWithoutFeedback
                                        disabled={!this.state.editMode}
                                        key={item.key} onPress={() =>
                                            this.props.toggleProductToSelectList(item)
                                        }
                                    >
                                        <View style={{ flex: 1, alignSelf: 'center' }}>
                                            <Ionicons name="ios-trash-outline" size={25} color="#d35400" />
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View style={{ flex: 10, flexDirection: 'column' }}>

                                        <View style={{ flexDirection: 'row', paddingBottom: 4, borderBottomWidth: 0.5, borderBottomColor: '#16a085' }}>
                                            <View>
                                                <Text style={{ fontSize: 15 }}>{item.name}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>

                                            <View style={{ flex: 0.4 }}>
                                                <TextInput
                                                    editable={this.state.editMode}
                                                    disableFullscreenUI
                                                    underlineColorAndroid={'transparent'}
                                                    style={styles.textInput}
                                                    blurOnSubmit
                                                    value={formatNumber(item.quantity)}
                                                    onChangeText={text => {
                                                        const saleOrderDetails = [...this.props.saleOrderDetails];
                                                        saleOrderDetails.forEach((product) => {
                                                            if (product.id == item.id) {
                                                                product.quantity = text;
                                                            }
                                                        });
                                                        const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(this.props.newDebt, this.props.pay, saleOrderDetails);
                                                        this.props.SaleOrderChange({ prop: "saleOrderDetails", value: saleOrderDetails });
                                                        this.props.SaleOrderChange({ prop: "total", value: total });
                                                        this.props.SaleOrderChange({ prop: "newDebt", value: newDebt });
                                                        this.props.SaleOrderChange({ prop: "totalIncludeVat", value: totalIncludeVat });
                                                        this.props.SaleOrderChange({ prop: "vat", value: vat });
                                                    }}
                                                    type="Text"
                                                    name="Description"
                                                    placeholder="Số Lượng"
                                                />
                                            </View>

                                            <Picker
                                                enabled={this.state.editMode}
                                                style={{ flex: 1.3, alignItems: 'center' }}
                                                selectedValue={item.unitId}
                                                onValueChange={
                                                    (itemValue, itemIndex) => this.caculatePriceOnUnitChanged(item, itemValue)
                                                }
                                            >
                                                {this.props.units && this.props.units.map((unit) => (
                                                    <Picker.Item key={unit.id} label={unit.name} value={unit.id} />
                                                ))
                                                }
                                            </Picker>

                                            <View style={{ flex: 1 }}>
                                                <TextInput
                                                    editable={this.state.editMode}
                                                    disableFullscreenUI
                                                    underlineColorAndroid={'transparent'}
                                                    style={[styles.textInput, { textAlign: 'right' }]}
                                                    blurOnSubmit
                                                    value={formatNumber(item.salePrice)}
                                                    onChangeText={text => {
                                                        const saleOrderDetails = [...this.props.saleOrderDetails];
                                                        saleOrderDetails.forEach((product) => {
                                                            if (product.id == item.id) {
                                                                product.salePrice = text;
                                                            }
                                                        });
                                                        const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(this.props.newDebt, this.props.pay, saleOrderDetails);
                                                        this.props.SaleOrderChange({prop: 'saleOrderDetails', value: saleOrderDetails});
                                                        this.props.SaleOrderChange({ prop: "total", value: total });
                                                        this.props.SaleOrderChange({ prop: "newDebt", value: newDebt });
                                                        this.props.SaleOrderChange({ prop: "totalIncludeVat", value: totalIncludeVat });
                                                        this.props.SaleOrderChange({ prop: "vat", value: vat });
                                                    }}
                                                    type="Text"
                                                    name="Description"
                                                    placeholder="Giá bán"
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            );
                        }
                        return null;
                    }
                    }
                />
            );
        }
        return (
            <View>
                <Text>Không tìm thấy sản phẩm bạn cần</Text>
            </View>
        );
    }

    renderHeaderQuocte() {
        if (this.state.isExpanded) {
            return (
                <ScrollView>
                    <View style={styles.controlContainer}>
                        <Text style={styles.label} >Ngày tháng</Text>
                        <View style={styles.groupControl}>
                            <DatePicker
                                enabled={this.state.editMode}
                                style={{ width: 200 }}
                                date={this.props.date}
                                mode="date"
                                placeholder="Chọn ngày lập hóa đơn"
                                format="DD-MM-YYYY"
                                minDate="01-01-2008"
                                maxDate="01-01-2056"
                                confirmBtnText="Xác Nhận"
                                cancelBtnText="Hủy Bỏ"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 36
                                    }
                                    // ... You can check the source to find the other keys.
                                }}
                                onDateChange={(date) => { 
                                    this.props.SaleOrderChange({prop: 'date', value: date})
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.controlContainer}>
                        <Text style={styles.label} >Khách Hàng</Text>
                        <View style={styles.groupControl}>
                            <Picker
                                enabled={false}
                                selectedValue={this.props.customerId}
                                onValueChange={
                                    (itemValue, itemIndex) => {
                                        this.props.SaleOrderChange({prop: 'customerId', value: itemValue})
                                    }
                                }
                            >
                                <Picker.Item key={0} label="" value={null} />
                                {this.props.customers && this.props.customers.map((item) => (
                                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                                ))
                                }
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.controlContainer}>
                        <Text style={styles.label} >Tiêu đề</Text>
                        <View style={styles.groupControl}>
                            <TextInput
                                editable={this.state.editMode}
                                disableFullscreenUI
                                underlineColorAndroid={'transparent'}
                                style={styles.textInput}
                                blurOnSubmit
                                value={this.props.title}
                                onChangeText={text => this.props.SaleOrderChange({prop: 'title', value: text})}
                                type="Text"
                                name="title"
                                placeholder="Tiêu đề hóa đơn"
                            />
                        </View>
                    </View>
                </ScrollView>
            );
        }
        return <View />;
    }

    renderToTal() {
        if (this.state.isExpandedTotal) {
            return (
                <View style={{ height: 180 }}>
                    <View style={styles.totalControlGroup}>
                        <Text style={styles.label} >Tổng Tiền</Text>
                        <Text style={styles.label}>{formatNumber(this.props.total)}</Text>
                    </View>
                    <View style={styles.totalControlGroup}>
                        <Text style={styles.label} >VAT</Text>
                        <Text style={styles.label}>{formatNumber(this.props.vat)}</Text>
                    </View>
                    <View style={styles.totalControlGroup}>
                        <Text style={styles.label} >Tổng Tiền gồm VAT</Text>
                        <Text style={styles.label}>{formatNumber(this.props.totalIncludeVat)}</Text>
                    </View>
                    <View style={styles.totalControlGroup}>
                        <Text style={styles.label} >Nợ Cũ</Text>
                        <Text style={styles.label}>{formatNumber(this.props.oldDebt)}</Text>
                    </View>
                    <View style={styles.totalControlGroup}>
                        <Text style={styles.label} >Thanh Toán</Text>
                        <View style={[styles.groupControl, { width: 180 }]}>
                            <TextInput
                                editable={this.state.editMode}
                                disableFullscreenUI
                                keyboardType='numeric'
                                underlineColorAndroid={'transparent'}
                                style={[styles.textInput, { textAlign: 'right', fontSize: 15 }]}
                                blurOnSubmit
                                value={formatNumber(this.props.pay)}
                                onChangeText={text => {
                                    const pay = unformat(text);
                                    const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(this.props.oldebt, pay, this.props.saleOrderDetails);
                                    this.props.SaleOrderChange({prop: 'pay', value: pay});
                                    this.props.SaleOrderChange({prop: 'total', value: total});
                                    this.props.SaleOrderChange({prop: 'totalIncludeVat', value: totalIncludeVat});
                                    this.props.SaleOrderChange({prop: 'vat', value: vat});
                                    this.props.SaleOrderChange({prop: 'newDebt', value: newDebt});
                                   
                                }}
                                type="Text"
                                name="pay"
                                placeholder="Thanh Toán"
                            />
                        </View>
                    </View>
                    <View style={styles.totalControlGroup}>
                        <Text style={styles.label} >Tổng Nợ</Text>
                        <Text style={styles.label} >{formatNumber(this.props.newDebt)}</Text>

                    </View>
                </View>
            );
        }
        return (
            <View />
        )

    }
    //Tham khảo select (picker) react native: 
    //https://facebook.github.io/react-native/docs/picker.html
    render() {
        console.log(this.props);
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle} >Tạo Hóa Đơn Bán</Text>
                </Header>
                <View style={styles.body}>
                    <TouchableOpacity
                        disabled={!this.state.editMode}
                        style={styles.Btn}
                        onPress={() => this.setState({ isExpanded: !this.state.isExpanded })}
                    >
                        {this.state.isExpanded ?
                            <Ionicons name="ios-arrow-dropup-outline" size={25} color="#FFFFFF" /> :
                            <Ionicons name="ios-arrow-dropdown-outline" size={25} color="#FFFFFF" />
                        }
                    </TouchableOpacity>

                    {this.renderHeaderQuocte()}

                    {this.renderProductList()}

                    {this.renderToTal()}

                    <TouchableOpacity
                        disabled={!this.state.editMode}
                        style={styles.Btn}
                        onPress={() => this.setState({ isExpandedTotal: !this.state.isExpandedTotal })}
                    >
                        {this.state.isExpandedTotal ?
                            <Ionicons name="ios-arrow-dropdown-outline" size={25} color="#FFFFFF" /> :
                            <Ionicons name="ios-arrow-dropup-outline" size={25} color="#FFFFFF" />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={!this.state.editMode}
                        style={{ padding: 2, alignSelf: 'center', position: 'absolute', right: 10, bottom: 0 }}
                        onPress={this.onSelectProduct.bind(this)}
                    >
                        <Ionicons name="ios-add-circle" size={35} color="#ecf0f1" />
                    </TouchableOpacity>


                </View>
                <Footer>
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
                            disabled={!this.state.editMode}
                            style={styles.Btn}
                            onPress={this.onSave.bind(this)}
                        >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!this.state.editMode}
                            style={styles.Btn}
                            onPress={() => {
                                RNPrint.print('htmlString').then((jobName) => {
                                    console.log(`Printing ${jobName} complete!`);
                                });
                            }}
                        >
                            <Ionicons name="ios-print-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!this.state.editMode}
                            style={styles.Btn}
                            onPress={() => Actions.pop()}
                        >
                            <Ionicons name="ios-send-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!this.state.editMode}
                            style={styles.Btn}
                            onPress={() => Actions.pop()}
                        >
                            <Ionicons name="ios-mail-outline" size={25} color="#FFFFFF" />
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
        padding: 5,
        justifyContent: 'center',
        borderColor: '#7f8c8d',
        borderRadius: 10,
        borderWidth: 0.2,
        marginTop: 5,
        height: 75,
    },
    groupControl: {
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 2,
        marginTop: 2,
        padding: 2,
        borderColor: 'rgba(41, 128, 185,1.0)',
        backgroundColor: '#FFFFFF'
    },
    textInput: {
        color: '#000000',
        fontSize: 15
    },
    errorStyle: {
        color: 'rgba(231, 76, 60,1.0)',
        fontSize: 18
    },
    label: {
        fontSize: 15,
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
        paddingTop: 3,
        paddingRight: 15,
        paddingLeft: 15,
        paddingBottom: 8,
        borderRadius: 5,
        marginLeft: 5,
    },
    FooterGroupButton: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    SaleOrderDetailItemContainer: {
        flexDirection: 'row',
    },
    saleOrderDetailRemoveBtn: {

    },
    totalControlGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1'
    }
};
const mapStateToProps = (state, ownProps) => {
    const {
        customerId,
        date,
        saleOrderDetails,
        title,
        total,
        vat,
        pay,
        oldDebt,
        newDebt,
        debtCustomerId,
        totalIncludeVat,
        loaded,
        error
    } = state.saleOrders;
    const { selectedProducts } = state.products;
    const { customers } = state.customers;
    const { units } = state.products;
    const { isAuthenticated, user } = state.auth;
    return {
        customerId,
        date,
        saleOrderDetails,
        title,
        total,
        vat,
        pay,
        oldDebt,
        newDebt,
        debtCustomerId,
        totalIncludeVat,
        loaded,
        units,
        error,
        customers,
        selectedProducts,
        user
    };
};
export default connect(mapStateToProps, {
    loadSaleOrderById,
    loadUnits,
    loadCustomerListDataFromSqlite,
    toggleProductToSelectList,
    SaleOrderUpdate,
    SaleOrderChange,
    resetSelectedProducts
})(EditSaleOrder);
