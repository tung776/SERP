import React from 'react';
import Expo from 'expo';
import {
    View, Text, ScrollView, TextInput,
    TouchableOpacity, TouchableWithoutFeedback,
    Picker, Alert, FlatList, NativeModules
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { loadSupplierListDataFromSqlite } from '../../../actions/supplierAction';
import {
    loadUnits,
    toggleProductToSelectList,
    resetSelectedProducts,
    ProductChange
} from '../../../actions/productActions';
import {
    loadFormulationById,
    FormulationUpdate,
    FormulationChange,
    FormulationDelete,
    loadTax
} from '../../../actions/formulationActions';
import db from '../../../database/sqliteConfig';
import moment from '../../../../Shared/utils/moment';
import {
    formatMoney,
    formatNumber,
    unformat
} from '../../../../Shared/utils/format';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import formulationTemplate, { css, sendEmail, sendMessage } from '../../../../Shared/templates/formulationTemplate';
import loadAsset from '../../../utils/loadAsset';
import { fontUrl, URL } from '../../../../env';

const { RNPrint } = NativeModules;
class EditFormulation extends React.Component {
    state = {
        id: '',
        isExpanded: true,
        isExpandedTotal: true,
        date: '',
        total: 0,
        formulationDetails: [],
        editMode: false,
        fontPath: null,
        loaded: false
    }
    async componentWillMount() {
        this.props.loadFormulationById(this.props.formulation.id);

        this.setState({ loaded: false });

        if (!this.props.suppliers || this.props.suppliers.length == 0) {
            this.props.loadSupplierListDataFromSqlite();
        }
        if (!this.props.units || this.props.units.length == 0) {
            this.props.loadUnits();
        }
        if (!this.props.units || this.props.units.length == 0) {
            this.props.loadTax();
        }
        const fontAsset = await loadAsset("vuarial", "ttf", fontUrl);
        this.setState({
            fontPath: fontAsset.localUri
        });
    }

    componentWillReceiveProps(nextProps) {
        let formulationDetails = [];
        if (nextProps.selectCompleted) {
            nextProps.selectedProducts.forEach(detail => {
                this.state.formulationDetails.push({
                    ...detail,
                    isNew: true,
                    productId: detail.id,
                    key: `${detail.id}-${detail.unitId}-${detail.quantity}-${Math.random() * 10}`
                });
            });
            this.setState({ formulationDetails: this.state.formulationDetails });
            nextProps.ProductChange({ prop: 'selectCompleted', value: false })
            nextProps.ProductChange({ prop: 'selectedProducts', value: [] });
        }
        if (this.state.formulationDetails.length === 0 && this.state.loaded === false) {
            nextProps.formulationDetails.forEach(detail => {
                this.state.formulationDetails.push({
                    ...detail,
                    key: `${detail.id}-${detail.unitId}-${detail.quantity}-${Math.random() * 10}`
                });

            });
            this.setState({ formulationDetails: this.state.formulationDetails, loaded: true });
        }

        const { total} = this.caculateTotalPrice(this.state.formulationDetails);
        this.setState({
            id: nextProps.id,
            date: moment(nextProps.date, moment.ISO_8601).format('DD-MM-YYYY'),
            total: total,
        });
    }

    onSave() {
        
        Alert.alert(
            'Xác Nhận',
            'Bạn chắc chắn muốn lưu công thức',
            [
                {
                    text: 'Xác Nhận',
                    onPress: () => {
                        const {
                            id, date, total, formulationDetails
                        } = this.state;
                        this.props.FormulationUpdate({
                            id,
                            date,                            
                            total,
                            formulationDetails,
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

    caculateTotalPrice(formulationDetails = []) {
        let total = 0;

        formulationDetails.forEach((formulation) => {
            const temp = formulation.purchasePrice * formulation.quantity;
            total += temp;
        });
        return {
            total
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
        const formulationDetails = [...this.state.formulationDetails];
        formulationDetails.forEach((item) => {
            if (item.key === product.key) {
                item.purchasePrice = Math.round(oldPrice * newRate);
                item.unitId = newUnitId;
            }
        });

        const { total } = this.caculateTotalPrice( formulationDetails);
        this.setState({
            total,
            formulationDetails
        });
    }

    editModeToggle() {
        this.setState({ editMode: !this.state.editMode });
    }

    renderProductList() {
        if (this.state.formulationDetails) {
            return (
                <FlatList
                    style={{ marginTop: 10, marginBottom: 10 }}
                    data={this.state.formulationDetails}
                    renderItem={({ item }) => {
                        if (item) {
                            return (
                                <View
                                    style={{ flexDirection: 'row', height: 80, borderBottomWidth: 3, borderBottomColor: '#bdc3c7', backgroundColor: '#ecf0f1', padding: 5 }}
                                >
                                    <TouchableWithoutFeedback
                                        disabled={!this.state.editMode}
                                        key={item.key} onPress={() => {
                                            this.state.formulationDetails = this.state.formulationDetails.filter(detail => {
                                                if (item.key != detail.key) {
                                                    return detail;
                                                }
                                            });
                                            const { total } = this.caculateTotalPrice(this.state.formulationDetails);

                                            this.setState({
                                                total,
                                                formulationDetails: this.state.formulationDetails,
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
                                                    editable={this.state.editMode}
                                                    disableFullscreenUI
                                                    underlineColorAndroid={'transparent'}
                                                    style={styles.textInput}
                                                    blurOnSubmit
                                                    value={formatNumber(item.quantity)}
                                                    onChangeText={text => {
                                                        const formulationDetails = [...this.state.formulationDetails];
                                                        formulationDetails.forEach((product) => {
                                                            if (product.key == item.key) {
                                                                product.quantity = unformat(text);

                                                            }
                                                        });
                                                        const { total } = this.caculateTotalPrice(formulationDetails);
                                                        this.setState({
                                                            total,
                                                            formulationDetails
                                                        });
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
                                                    value={formatNumber(item.purchasePrice)}
                                                    onChangeText={text => {
                                                        const formulationDetails = [...this.state.formulationDetails];
                                                        formulationDetails.forEach((product) => {
                                                            if (product.key == item.key) {
                                                                product.purchasePrice = unformat(text);
                                                            }
                                                        });
                                                        const { total } = this.caculateTotalPrice(formulationDetails);
                                                        this.setState({
                                                            total,
                                                            formulationDetails
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
                                enabled={this.state.editMode}
                                style={{ width: 200 }}
                                date={this.state.date}
                                mode="date"
                                placeholder="Chọn ngày lập công thức"
                                format="DD-MM-YYYY"
                                minDate="01-01-2008"
                                maxDate="01-01-3056"
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
                                    this.setState({ date });
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.controlContainer}>
                        <Text style={styles.label} >Nhà Cung Cấp</Text>
                        <View style={styles.groupControl}>
                            <Picker
                                enabled={false}
                                selectedValue={this.state.supplierId}
                                onValueChange={
                                    (itemValue, itemIndex) => {
                                        this.setState({ supplierId: itemValue });
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
                    <Text style={styles.headTitle} >Sửa Công Thức</Text>
                </Header>
                <View style={styles.body}>
                    <TouchableOpacity
                        style={[styles.Btn, { backgroundColor: '#16a085' }]}
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
                        style={[styles.Btn, { backgroundColor: '#16a085' }]}
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
                            style={[styles.Btn, this.state.editMode ? { backgroundColor: '#7f8c8d' } : { backgroundColor: '#2ecc71' }]}
                            onPress={this.editModeToggle.bind(this)}
                        >
                            <Ionicons name="ios-apps-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!this.state.editMode}
                            style={[styles.Btn, this.state.editMode ? { backgroundColor: '#16a085' } : { backgroundColor: '#7f8c8d' }]}
                            onPress={this.onSave.bind(this)}
                        >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={this.state.editMode}
                            style={[styles.Btn, this.state.editMode ? { backgroundColor: '#7f8c8d' } : { backgroundColor: '#2ecc71' }]}
                            onPress={async () => {
                                if (!this.state.fontPath) return;

                                if (this.state.id == '') {
                                    Alert.alert(
                                        'Thông Báo',
                                        'Bạn cần lưu công thức trước khi in',
                                        [
                                            { text: 'Ok' },
                                        ]
                                    );
                                } else {
                                    let formulationDetails = [...this.state.formulationDetails];
                                    formulationDetails.forEach((formulation) => {
                                        this.props.units.forEach((unit) => {
                                            if (formulation.unitId == unit.id) {
                                                formulation.unitName = unit.name
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
                                        html: formulationTemplate(supplierName, this.state.id,
                                            this.state.date, this.state.total, formulationDetails),
                                        css: css(),
                                        fileName: "formulation",
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
                            disabled={this.state.editMode}
                            style={[styles.Btn, this.state.editMode ? { backgroundColor: '#7f8c8d' } : { backgroundColor: '#2ecc71' }]}
                            onPress={() => {
                                let formulationDetails = [...this.state.formulationDetails];
                                formulationDetails.forEach((formulation) => {
                                    this.props.units.forEach((unit) => {
                                        if (formulation.unitId == unit.id) {
                                            formulation.unitName = unit.name
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
                                    this.state.vat, this.state.oldDebt, this.state.pay, this.state.newDebt,
                                    formulationDetails
                                );
                            }}
                        >
                            <Ionicons name="ios-send-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={this.state.editMode}
                            style={[styles.Btn, this.state.editMode ? { backgroundColor: '#7f8c8d' } : { backgroundColor: '#2ecc71' }]}
                            onPress={() => {
                                let formulationDetails = [...this.state.formulationDetails];
                                formulationDetails.forEach((formulation) => {
                                    this.props.units.forEach((unit) => {
                                        if (formulation.unitId == unit.id) {
                                            formulation.unitName = unit.name
                                        }
                                    })
                                });
                                let supplierEmail = '';
                                let supplierName = '';
                                this.props.suppliers.forEach((supplier) => {
                                    if (supplier.id == this.state.supplierId) {
                                        supplierEmail = supplier.email;
                                        supplierName = supplier.name;
                                    }
                                });
                                sendEmail(
                                    supplierEmail, supplierName, this.state.date, this.state.total, this.state.totalIncludeVat,
                                    this.state.vat, this.state.oldDebt, this.state.pay, this.state.newDebt,
                                    formulationDetails
                                );
                            }}
                        >
                            <Ionicons name="ios-mail-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!this.state.editMode}
                            style={[styles.Btn, this.state.editMode ? { backgroundColor: '#d35400' } : { backgroundColor: '#7f8c8d' }]}
                            onPress={() => {
                                const {
                                    id, date, supplierId, total, totalIncludeVat, vat, pay,
                                    newDebt, oldDebt, formulationDetails
                                } = this.state;
                                this.props.FormulationDelete({
                                    id, date, supplierId, total, totalIncludeVat, vat, pay,
                                    newDebt, oldDebt, formulationDetails
                                });
                            }}
                        >
                            <Ionicons name="ios-trash-outline" size={25} color="#c0392b" />
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
    FormulationDetailItemContainer: {
        flexDirection: 'row',
    },
    formulationDetailRemoveBtn: {

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
        date,
        formulationDetails,
        total,
        loaded,
        error
    } = state.formulations;
    const { units, selectedProducts, selectCompleted } = state.products;
    const { isAuthenticated, user } = state.auth;
    return {
        id,
        date,
        formulationDetails,
        total,
        loaded,
        units,
        error,
        selectedProducts,
        selectCompleted,
        user
    };
};
export default connect(mapStateToProps, {
    loadFormulationById,
    loadUnits,
    loadTax,
    loadSupplierListDataFromSqlite,
    toggleProductToSelectList,
    FormulationUpdate,
    FormulationChange,
    resetSelectedProducts,
    FormulationDelete,
    ProductChange
})(EditFormulation);
