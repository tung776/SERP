import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Picker, Alert, FlatList, NativeModules } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import {
    loadSupplierListDataFromSqlite,
    loadDebtSuppliersFromSqlite
} from '../../../actions/supplierAction';
import {
    loadUnits,
    toggleProductToSelectList,
    ProductChange
} from '../../../actions/productActions';
import { resetData, AddNewPurchaseOrder, loadTax } from '../../../actions/purchaseOrderActions';
import db from '../../../database/sqliteConfig';
import { formatMoney, formatNumber, unformat } from '../../../../Shared/utils/format';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import invoiceTemplate, { css, sendMessage, sendEmail } from '../../../../Shared/templates/purchaseInvoice';
import Expo from 'expo';
import loadAsset from '../../../utils/loadAsset';
import { fontUrl, URL } from '../../../../env';

const { RNPrint } = NativeModules;

class NewPurchaseOrder extends React.Component {
    state = {
        id: '',
        isExpanded: true,
        isExpandedTotal: true,
        supplierId: '',
        debtSuppliers: {},
        date: '',
        total: 0,
        totalIncludeVat: 0,
        vat: 0,
        pay: 0,
        taxId: 1,
        newDebt: 0,
        oldebt: 0,
        purchaseOrderDetails: [],
        fontLocation: null,
        appIsReady: false,
        fontPath: null,
    }
    async componentWillMount() {
        this.props.resetData();
        if (!this.props.suppliers || this.props.suppliers.length == 0) {
            this.props.loadSupplierListDataFromSqlite();
        }
        if (!this.props.units || this.props.units.length == 0) {
            this.props.loadUnits();
        }
        if (!this.props.tax || this.props.tax.length == 0) {
            this.props.loadTax();
        }
        const fontAsset = await loadAsset("vuarial", "ttf", fontUrl);
        this.setState({
            fontPath: fontAsset.localUri,
        });
    }

    componentWillReceiveProps(nextProps) {

        const oldebt = nextProps.debt ? nextProps.debt.newDebt : 0;
        let purchaseOrderDetails = []
        console.log('nextProps.debt = ', nextProps.debt);
        if (this.props.isSave) {
            console.log('nextProps.selectedProducts = ', nextProps.selectedProducts);
        }

        if (nextProps.selectCompleted) {
            nextProps.selectedProducts.forEach((detail) => {

                this.state.purchaseOrderDetails.push({ ...detail, key: `${detail.id}-${detail.unitId}-${detail.quantity}-${Math.random() * 10}` });
            });

            const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(oldebt, this.state.pay,
                this.state.purchaseOrderDetails);

            this.setState({
                total,
                newDebt,
                totalIncludeVat,
                vat,
                purchaseOrderDetails: this.state.purchaseOrderDetails,
            });
            nextProps.ProductChange({ prop: 'selectCompleted', value: false })
            nextProps.ProductChange({ prop: 'selectedProducts', value: [] });
        }

        this.setState({
            id: nextProps.id,
            debtSuppliers: nextProps.debt,
            oldebt,
        });
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
                            date, supplierId, total, totalIncludeVat, vat, pay,
                            newDebt, oldebt, purchaseOrderDetails, taxId
                        } = this.state;
                        this.props.AddNewPurchaseOrder({
                            date, supplierId, total, totalIncludeVat, vat, taxId, pay,
                            newDebt, oldebt, purchaseOrderDetails, debtSupplierId: this.state.debtSuppliers.id,
                            user: this.props.user
                        });
                    }
                },
                { text: 'Hủy', onPress: () => console.log('cancel Pressed') },
            ]
        );
    }

    onSelectProduct() {
        Actions.productSelector();
    }

    onSupplierChanged(supplierId) {
        this.props.loadDebtSuppliersFromSqlite(supplierId);
        this.setState({ supplierId });
    }

    caculateOrder(debt = 0, pay = 0, purchaseOrderDetails = [], taxRate = null) {
        let total = 0,
            totalIncludeVat = 0,
            newDebt = 0;

        if (taxRate == null) {
            this.props.tax.forEach((tax) => {

                if (tax.id == this.state.taxId) {
                    taxRate = tax.rate;
                }
            })
        }

        purchaseOrderDetails.forEach((order) => {
            const temp = order.purchasePrice * order.quantity;
            total += temp;
        });
        const vat = total * taxRate;
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
        let oldPrice = unformat(product.purchasePrice);
        let newRate = 1;
        this.props.units.forEach((unit) => {
            if (unit.id == product.unitId) {
                oldPrice = unformat(product.purchasePrice) / unit.rate;
                oldPrice = Math.round(oldPrice);
            }
            if (unit.id == newUnitId) {
                newRate = unit.rate;
            }
        });
        const purchaseOrderDetails = [...this.state.purchaseOrderDetails];
        purchaseOrderDetails.forEach((item) => {
            if (item.key === product.key) {
                item.purchasePrice = Math.round(oldPrice * newRate);
                item.unitId = newUnitId;
            }
        });

        const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(this.state.oldebt, this.state.pay, purchaseOrderDetails);
        this.setState({
            total,
            newDebt,
            totalIncludeVat,
            vat,
            purchaseOrderDetails
        });
    }


    renderProductList() {
        if (this.state.purchaseOrderDetails) {
            return (
                <FlatList
                    style={{ marginTop: 10, marginBottom: 10 }}
                    data={this.state.purchaseOrderDetails}
                    renderItem={({ item }) => {
                        if (item) {
                            return (
                                <View
                                    style={{ flexDirection: 'row', height: 80, borderBottomWidth: 3, borderBottomColor: '#bdc3c7', backgroundColor: '#ecf0f1', padding: 5 }}
                                >
                                    <TouchableWithoutFeedback
                                        disabled={this.props.isSave}
                                        key={item.key} onPress={() => {
                                            this.state.purchaseOrderDetails = this.state.purchaseOrderDetails.filter(detail => {
                                                if (item.key != detail.key) {
                                                    return detail;
                                                }
                                            });

                                            const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(this.state.oldebt, this.state.pay,
                                                this.state.purchaseOrderDetails);

                                            this.setState({
                                                total,
                                                newDebt,
                                                totalIncludeVat,
                                                vat,
                                                purchaseOrderDetails: this.state.purchaseOrderDetails,
                                            });
                                        }}
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
                                                    editable={!this.props.isSave}
                                                    disableFullscreenUI
                                                    underlineColorAndroid={'transparent'}
                                                    style={styles.textInput}
                                                    blurOnSubmit
                                                    value={formatNumber(item.quantity)}
                                                    onChangeText={text => {
                                                        this.state.purchaseOrderDetails.forEach((product) => {
                                                            if (product.key == item.key) {
                                                                product.quantity = unformat(text);
                                                            }
                                                        });
                                                        const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(this.state.oldebt, this.state.pay, this.state.purchaseOrderDetails);
                                                        this.setState({
                                                            purchaseOrderDetails: this.state.purchaseOrderDetails,
                                                            total,
                                                            totalIncludeVat,
                                                            vat,
                                                            newDebt
                                                        });
                                                    }}
                                                    type="Text"
                                                    name="Description"
                                                    placeholder="Số Lượng"
                                                />
                                            </View>

                                            <Picker
                                                enabled={!this.props.isSave}
                                                style={{ flex: 1.3, alignItems: 'center' }}
                                                selectedValue={item.unitId}
                                                onValueChange={
                                                    (itemValue, itemIndex) => {
                                                        this.caculatePriceOnUnitChanged(item, itemValue);
                                                    }}
                                            >
                                                {this.props.units && this.props.units.map((unit) => (
                                                    <Picker.Item key={unit.id} label={unit.name} value={unit.id} />
                                                ))
                                                }
                                            </Picker>

                                            <View style={{ flex: 1 }}>
                                                <TextInput
                                                    editable={!this.props.isSave}
                                                    disableFullscreenUI
                                                    underlineColorAndroid={'transparent'}
                                                    style={[styles.textInput, { textAlign: 'right' }]}
                                                    blurOnSubmit
                                                    value={formatNumber(item.purchasePrice)}
                                                    onChangeText={text => {
                                                        this.state.purchaseOrderDetails.forEach((product) => {
                                                            if (product.key == item.key) {
                                                                product.purchasePrice = unformat(text);
                                                            }
                                                        });
                                                        const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(this.state.oldebt, this.state.pay, this.state.purchaseOrderDetails);
                                                        this.setState({
                                                            purchaseOrderDetails: this.state.purchaseOrderDetails,
                                                            total,
                                                            totalIncludeVat,
                                                            vat,
                                                            newDebt
                                                        });
                                                    }}
                                                    type="Text"
                                                    name="Description"
                                                    placeholder="Giá nhập"
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

    renderHeaderOrder() {
        if (this.state.isExpanded) {
            return (
                <ScrollView>
                    <View style={styles.controlContainer}>
                        <Text style={styles.label} >Ngày tháng</Text>
                        <View style={styles.groupControl}>
                            <DatePicker
                                enabled={this.props.isSave}
                                style={{ width: 200 }}
                                date={this.state.date}
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
                                onDateChange={(date) => { this.setState({ date }); }}
                            />
                        </View>
                    </View>
                    <View style={styles.controlContainer}>
                        <Text style={styles.label} >Khách Hàng</Text>
                        <View style={styles.groupControl}>
                            <Picker
                                enabled={!this.props.isSave}
                                selectedValue={this.state.supplierId}
                                onValueChange={
                                    (itemValue, itemIndex) => {
                                        this.onSupplierChanged(itemValue);
                                    }
                                }
                            >
                                <Picker.Item key={0} label="" value={null} />
                                {this.props.suppliers && this.props.suppliers.map((item) => (
                                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                                ))
                                }
                            </Picker>
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
                        <Text style={styles.label}>{formatNumber(this.state.total)}</Text>
                    </View>
                    <View style={styles.totalControlGroup}>
                        <Picker
                            style={{ color: '#34495e', flex: 0.5, alignSelf: 'center' }}
                            enabled={!this.props.isSave}
                            selectedValue={this.state.taxId}
                            onValueChange={
                                (itemValue, itemIndex) => {
                                    let taxRate = 0;
                                    this.props.tax.forEach((tax) => {
                                        if (tax.id == itemValue) {
                                            taxRate = tax.rate;
                                        }
                                    })
                                    const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(this.state.oldebt, this.state.pay, this.state.purchaseOrderDetails, taxRate);
                                    this.setState({
                                        total,
                                        totalIncludeVat,
                                        vat,
                                        newDebt,
                                        taxId: itemValue
                                    });
                                }
                            }
                        >
                            {this.props.tax && this.props.tax.map((vat) => (
                                <Picker.Item key={vat.id} label={vat.name} value={vat.id} />
                            ))}

                        </Picker>
                        <Text style={styles.label}>{formatNumber(this.state.vat)}</Text>
                    </View>
                    <View style={styles.totalControlGroup}>
                        <Text style={styles.label} >Tổng Tiền gồm VAT</Text>
                        <Text style={styles.label}>{formatNumber(this.state.totalIncludeVat)}</Text>
                    </View>
                    <View style={styles.totalControlGroup}>
                        <Text style={styles.label} >Nợ Cũ</Text>
                        <Text style={styles.label}>{formatNumber(this.state.oldebt)}</Text>
                    </View>
                    <View style={styles.totalControlGroup}>
                        <Text style={styles.label} >Thanh Toán</Text>
                        <View style={[styles.groupControl, { width: 180 }]}>
                            <TextInput
                                editable={!this.props.isSave}
                                disableFullscreenUI
                                keyboardType='numeric'
                                underlineColorAndroid={'transparent'}
                                style={[styles.textInput, { textAlign: 'right', fontSize: 15 }]}
                                blurOnSubmit
                                value={formatNumber(this.state.pay)}
                                onChangeText={text => {
                                    const pay = unformat(text);
                                    const { total, newDebt, totalIncludeVat, vat } = this.caculateOrder(this.state.oldebt, pay, this.state.purchaseOrderDetails);
                                    this.setState({
                                        pay,
                                        total,
                                        newDebt,
                                        totalIncludeVat,
                                        vat
                                    });
                                }}
                                type="Text"
                                name="pay"
                                placeholder="Thanh Toán"
                            />
                        </View>
                    </View>
                    <View style={styles.totalControlGroup}>
                        <Text style={styles.label} >Tổng Nợ</Text>
                        <Text style={styles.label} >{formatNumber(this.state.newDebt)}</Text>

                    </View>
                </View>
            );
        }
        return (
            <View />
        );

    }
    //Tham khảo select (picker) react native: 
    //https://facebook.github.io/react-native/docs/picker.html
    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle} >Tạo Hóa Đơn Nhập</Text>
                </Header>
                <View style={styles.body}>
                    <TouchableOpacity
                        style={styles.Btn}
                        onPress={() => this.setState({ isExpanded: !this.state.isExpanded })}
                    >
                        {this.state.isExpanded ?
                            <Ionicons name="ios-arrow-dropup-outline" size={25} color="#FFFFFF" /> :
                            <Ionicons name="ios-arrow-dropdown-outline" size={25} color="#FFFFFF" />
                        }
                    </TouchableOpacity>

                    {this.renderHeaderOrder()}

                    {this.renderProductList()}

                    {this.renderToTal()}

                    <TouchableOpacity
                        style={styles.Btn}
                        onPress={() => this.setState({ isExpandedTotal: !this.state.isExpandedTotal })}
                    >
                        {this.state.isExpandedTotal ?
                            <Ionicons name="ios-arrow-dropdown-outline" size={25} color="#FFFFFF" /> :
                            <Ionicons name="ios-arrow-dropup-outline" size={25} color="#FFFFFF" />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={this.props.isSave}
                        style={{ padding: 2, alignSelf: 'center', position: 'absolute', right: 10, bottom: 0 }}
                        onPress={this.onSelectProduct.bind(this)}
                    >
                        <Ionicons name="ios-add-circle" size={35} color="#ecf0f1" />
                    </TouchableOpacity>


                </View>
                <Footer>
                    <View style={styles.FooterGroupButton} >
                        <TouchableOpacity
                            disabled={this.props.isSave}
                            style={[styles.Btn, (this.props.isSave) ? { backgroundColor: '#7f8c8d' } : { backgroundColor: '#16a085' }]}
                            onPress={this.onSave.bind(this)}
                        >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!this.props.isSave}
                            style={[styles.Btn, (this.props.isSave) ? { backgroundColor: '#16a085' } : { backgroundColor: '#7f8c8d' }]}
                            onPress={async () => {
                                if (!this.state.fontPath) return;
                                if (this.state.id == '') {
                                    Alert.alert(
                                        'Thông Báo',
                                        'Bạn cần lưu hóa đơn trước khi in',
                                        [
                                            { text: 'Ok' },
                                        ]
                                    );
                                } else {
                                    let purchaseOrderDetails = [...this.state.purchaseOrderDetails];
                                    purchaseOrderDetails.forEach((order) => {
                                        this.props.units.forEach((unit) => {
                                            if (order.unitId == unit.id) {
                                                order.unitName = unit.name
                                            }
                                        })
                                    })
                                    let supplierName = '';
                                    this.props.suppliers.forEach((supplier) => {
                                        if (supplier.id == this.state.supplierId) {
                                            supplierName = supplier.name;
                                        }
                                    });
                                    let options = {
                                        html: invoiceTemplate(supplierName, this.props.id,
                                            this.state.date, this.state.total, this.state.totalIncludeVat,
                                            this.state.vat, this.state.oldebt, this.state.pay, this.state.newDebt,
                                            purchaseOrderDetails),
                                        css: css(),
                                        fileName: "invoice",
                                        fonts: [this.state.fontPath]
                                    };
                                    try {
                                        const results = await RNHTMLtoPDF.convert(options).catch(
                                            e => console.log(e)
                                        );
                                        const jobName = await RNPrint.print(results.filePath);
                                    }
                                    catch (e) {
                                        console.log('errors: ', e);
                                    }
                                }
                            }}
                        >
                            <Ionicons name="ios-print-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!this.props.isSave}
                            style={[styles.Btn, (this.props.isSave) ? { backgroundColor: '#16a085' } : { backgroundColor: '#7f8c8d' }]}
                            onPress={() => {
                                let purchaseOrderDetails = [...this.state.purchaseOrderDetails];
                                purchaseOrderDetails.forEach((order) => {
                                    this.props.units.forEach((unit) => {
                                        if (order.unitId == unit.id) {
                                            order.unitName = unit.name
                                        }
                                    })
                                });
                                let supplierPhone = '';
                                let supplierName = '';
                                this.props.suppliers.forEach((supplier) => {
                                    if (supplier.id == this.state.supplierId) {
                                        supplierPhone = supplier.phone;
                                        supplierName = supplier.name;
                                    }
                                });
                                sendMessage(
                                    supplierPhone, supplierName, this.state.date, this.state.total, this.state.totalIncludeVat,
                                    this.state.vat, this.state.oldebt, this.state.pay, this.state.newDebt,
                                    purchaseOrderDetails
                                );
                            }}
                        >
                            <Ionicons name="ios-send-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!this.props.isSave}
                            style={[styles.Btn, (this.props.isSave) ? { backgroundColor: '#16a085' } : { backgroundColor: '#7f8c8d' }]}
                            onPress={() => {
                                let purchaseOrderDetails = [...this.state.purchaseOrderDetails];
                                purchaseOrderDetails.forEach((order) => {
                                    this.props.units.forEach((unit) => {
                                        if (order.unitId == unit.id) {
                                            order.unitName = unit.name
                                        }
                                    })
                                });
                                let supplierName = '';
                                let supplierEmail = '';
                                this.props.suppliers.forEach((supplier) => {
                                    if (supplier.id == this.state.supplierId) {
                                        supplierEmail = supplier.email;
                                        supplierName = supplier.name;
                                    }
                                });
                                sendEmail(
                                    supplierEmail, supplierName, this.state.date, this.state.total, this.state.totalIncludeVat,
                                    this.state.vat, this.state.oldebt, this.state.pay, this.state.newDebt,
                                    purchaseOrderDetails
                                );
                            }}
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
        id,
        supplierId,
        date,
        purchaseOrderDetails,
        loaded,
        error,
        isSave,
        tax,
    } = state.purchaseOrders;
    const { selectedProducts, selectCompleted } = state.products;
    const { suppliers, debt } = state.suppliers;
    const { units } = state.products;
    const { isAuthenticated, user } = state.auth;
    return {
        isSave,
        id,
        supplierId,
        date,
        purchaseOrderDetails,
        loaded,
        units,
        error,
        suppliers,
        selectedProducts,
        debt,
        user,
        tax,
        selectCompleted
    };
};
export default connect(mapStateToProps, {
    resetData,
    loadUnits,
    loadSupplierListDataFromSqlite,
    toggleProductToSelectList,
    loadDebtSuppliersFromSqlite,
    AddNewPurchaseOrder,
    loadTax,
    ProductChange
})(NewPurchaseOrder);
