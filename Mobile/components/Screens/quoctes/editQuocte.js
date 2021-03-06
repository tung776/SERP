import React from 'react';
import { View, Text, ScrollView,
     TextInput, TouchableOpacity, 
     TouchableWithoutFeedback, Picker, 
     Alert, FlatList, NativeModules } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { loadCustomerGroupListDataFromSqlite } from '../../../actions/customerGroupAction';
import { loadCustomerListDataFromSqlite } from '../../../actions/customerAction';
import { loadUnits, 
    toggleProductToSelectList, 
    resetSelectedProducts,
    ProductChange,
 } from '../../../actions/productActions';
import { loadQuocteDataFromSqlite, QuocteUpdate } from '../../../actions/quocteActions';
import { formatMoney, formatNumber, unformat } from '../../../../Shared/utils/format';
import moment from '../../../../Shared/utils/moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import quocteTemplate, { css, sendEmail, sendMessage } from '../../../../Shared/templates/quocte';
import loadAsset from '../../../utils/loadAsset';
import { fontUrl, URL } from '../../../../env';

const { RNPrint } = NativeModules;
class EditQuocte extends React.Component {
    state = {
        isExpanded: true,
        customerGroupId: null,
        customerId: null,
        id: '',
        date: '',
        title: '',
        quocteDetails: [],
        editMode: false,
        loaded: false,
        fontPath: ''
    }
    async componentWillMount() {
        this.props.loadQuocteDataFromSqlite(this.props.quocte.id);

        if (!this.props.customers || this.props.customers.length == 0) {
            this.props.loadCustomerListDataFromSqlite();
        }
        if (!this.props.units || this.props.units.length == 0) {
            this.props.loadUnits();
        }
        if (!this.props.customerGroups || this.props.customerGroups.length == 0) {
            this.props.loadCustomerGroupListDataFromSqlite();
        }
        const fontAsset = await loadAsset("vuarial", "ttf", fontUrl);
        this.setState({
            fontPath: fontAsset.localUri            
        });
    }

    componentWillReceiveProps(nextProps) {
        //Phương thức loadQuocteDataFromSqlite sẽ lấy dữ liệu trong bảng
        //sqlite, đồng thời phủ đầy mảng state.products.selectedProducts.
        if (nextProps.selectCompleted ) {
            nextProps.selectedProducts.forEach(detail => {
                this.state.quocteDetails.push({ 
                    ...detail, 
                    productId: detail.id,
                    key: `${detail.id}-${detail.unitId}-${detail.quantity}-${Math.random() * 10}` 
                });
            })
            this.setState({ quocteDetails: this.state.quocteDetails });
            nextProps.ProductChange({prop: 'selectCompleted', value: false})
            nextProps.ProductChange({prop: 'selectedProducts', value: []});
        } 
        if (this.state.quocteDetails.length === 0 && this.state.loaded === false) {
            nextProps.quocteDetails.forEach(detail => {
                this.state.quocteDetails.push({ 
                    ...detail, 
                    key: `${detail.id}-${detail.unitId}-${detail.quantity}-${Math.random() * 10}` 
                });
            })
            this.setState({ quocteDetails: this.state.quocteDetails, loaded: true });
        }
        this.setState({
            id: nextProps.id,
            date: moment(nextProps.date, moment.ISO_8601).format('DD-MM-YYYY'),
            title: nextProps.title,
            customerId: nextProps.customerId,
            customerGroupId: nextProps.customerGroupId,
        });
    }

    onSave() {
        Alert.alert(
            'Xác Nhận',
            'Bạn chắc chắn muốn lưu báo giá',
            [
                {
                    text: 'Xác Nhận',
                    onPress: () => this.props.QuocteUpdate(this.state)
                },
                { text: 'Hủy', onPress: () => console.log('cancel Pressed') },
            ]
        );
    }

    caculatePriceOnUnitChanged(product, newUnitId) {
        let oldPrice = product.salePrice;
        let newRate = 1;
        this.props.units.forEach((unit) => {
            if (unit.id == product.unitId) {
                oldPrice = Math.floor(product.salePrice / unit.rate);
            }
            if (unit.id == newUnitId) {
                newRate = unit.rate;
            }
        });
        this.state.quocteDetails.forEach((item) => {
            if (item.key === product.key) {
                item.salePrice = Math.floor(oldPrice * newRate);
                item.unitId = newUnitId;
            }
        });

        this.setState({
            quocteDetails: this.state.quocteDetails,
        });
    }

    onSelectProduct() {
        // const selectedProducts = [];
        // this.state.quocteDetails.forEach((product) => {
        //     const temp = {
        //         ...product,
        //         id: product.id,
        //         key: product.id
        //     };
        //     selectedProducts.push(temp);
        // });
        Actions.productSelector();
    }

    renderProductList() {
        if (this.state.quocteDetails) {
            return (
                <FlatList
                    style={{ marginTop: 10, marginBottom: 10 }}
                    data={this.state.quocteDetails}
                    renderItem={({ item }) => {
                        if (item) {
                            return (
                                <View
                                    style={{ flexDirection: 'row', height: 80, borderBottomWidth: 3, borderBottomColor: '#bdc3c7', backgroundColor: '#ecf0f1', padding: 5 }}
                                >
                                    <TouchableWithoutFeedback
                                        disabled={!this.state.editMode}
                                        key={item.key} onPress={() => {
                                            this.state.quocteDetails = this.state.quocteDetails.filter(detail => {
                                                if (item.key != detail.key) {
                                                    return detail;
                                                }
                                            });
                                            this.setState({ quocteDetails: this.state.quocteDetails });
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

                                            <Picker
                                                enabled={this.state.editMode}
                                                style={{ flex: 1, alignItems: 'center' }}
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
                                                    style={styles.textInput}
                                                    blurOnSubmit
                                                    value={`${formatNumber(item.salePrice)}`}
                                                    onChangeText={text => {
                                                        this.state.quocteDetails.forEach((product) => {
                                                            if (product.key == item.key) {
                                                                product.salePrice = unformat(text);
                                                            }
                                                        });
                                                        this.setState({ quocteDetails: this.state.quocteDetails });
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
                                date={this.state.date}
                                mode="date"
                                placeholder="Chọn ngày lập báo giá"
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
                        <Text style={styles.label} >Nhóm Khách hàng</Text>
                        <View style={styles.groupControl}>
                            <Picker
                                enabled={this.state.editMode}
                                selectedValue={this.state.customerGroupId}
                                onValueChange={
                                    (itemValue, itemIndex) => this.setState({ customerGroupId: itemValue, customerId: null })
                                }
                            >
                                <Picker.Item key={0} label="" value={null} />
                                {this.props.customerGroups && this.props.customerGroups.map((item) => (
                                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                                ))
                                }
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.controlContainer}>
                        <Text style={styles.label} >Khách Hàng</Text>
                        <View style={styles.groupControl}>
                            <Picker
                                enabled={this.state.editMode}
                                selectedValue={this.state.customerId}
                                onValueChange={
                                    (itemValue, itemIndex) => this.setState({ customerId: itemValue, customerGroupId: null })
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
                                value={this.state.title}
                                onChangeText={text => this.setState({ title: text })}
                                type="Text"
                                name="title"
                                placeholder="Tiêu đề báo giá"
                            />
                        </View>
                    </View>
                </ScrollView>
            );
        }
        return <View />;
    }

    editModeToggle() {
        this.setState({ editMode: !this.state.editMode });
    }

    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle} >Sửa Báo Giá</Text>
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

                    {this.renderHeaderQuocte()}

                    {this.renderProductList()}
                    <TouchableOpacity
                        disabled={!this.state.editMode}
                        style={{ padding: 2, alignSelf: 'center', position: 'absolute', right: 5, bottom: 5 }}
                        onPress={this.onSelectProduct.bind(this)}
                    >
                        <Ionicons name="ios-add-circle" size={55} color="rgba(52, 152, 219,0.7)" />
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
                            style={[styles.Btn, (!this.state.editMode) ? { backgroundColor: '#7f8c8d' } : { backgroundColor: '#16a085' }]}
                            onPress={this.onSave.bind(this)}
                        >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={this.state.editMode}
                            style={[styles.Btn, (this.state.editMode) ? { backgroundColor: '#7f8c8d' } : { backgroundColor: '#16a085' }]}
                            onPress={async () => {
                                if (!this.state.fontPath) return;

                                if (this.state.id == '') {
                                    Alert.alert(
                                        'Thông Báo',
                                        'Bạn cần lưu báo giá trước khi in',
                                        [
                                            { text: 'Ok' },
                                        ]
                                    );
                                } else {
                                    let quocteDetails = [...this.state.quocteDetails];
                                    quocteDetails.forEach((quocte) => {
                                        this.props.units.forEach((unit) => {
                                            if (quocte.unitId == unit.id) {
                                                quocte.unitName = unit.name
                                            }
                                        })
                                    })
                                    let customerName = '';
                                    this.props.customers.forEach((customer) => {
                                        if (customer.id == this.state.customerId) {
                                            customerName = customer.name;
                                        }
                                    });

                                    let options = {
                                        html: quocteTemplate(customerName, this.state.id,
                                            this.state.date, quocteDetails),
                                        css: css(),
                                        fileName: "quocte",
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
                            style={[styles.Btn, (this.state.editMode) ? { backgroundColor: '#7f8c8d' } : { backgroundColor: '#16a085' }]}
                            onPress={() => {
                                let quocteDetails = [...this.state.quocteDetails];
                                quocteDetails.forEach((quocte) => {
                                    this.props.units.forEach((unit) => {
                                        if (quocte.unitId == unit.id) {
                                            quocte.unitName = unit.name
                                        }
                                    })
                                });
                                let customerPhone = '';
                                let customerName = '';
                                this.props.customers.forEach((customer) => {
                                    if (customer.id == this.state.customerId) {
                                        customerPhone = customer.phone;
                                        customerName = customer.name;
                                    }
                                });
                                sendMessage(
                                    customerPhone, customerName, this.state.date, quocteDetails
                                );
                            }}
                        >
                            <Ionicons name="ios-send-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={this.state.editMode}
                            style={[styles.Btn, (this.state.editMode) ? { backgroundColor: '#7f8c8d' } : { backgroundColor: '#16a085' }]}
                            onPress={() => {
                                let quocteDetails = [...this.state.quocteDetails];
                                quocteDetails.forEach((quocte) => {
                                    this.props.units.forEach((unit) => {
                                        if (quocte.unitId == unit.id) {
                                            quocte.unitName = unit.name
                                        }
                                    })
                                });
                                let customerEmail = '';
                                let customerName = '';
                                this.props.customers.forEach((customer) => {
                                    if (customer.id == this.state.customerId) {
                                        customerEmail = customer.email;
                                        customerName = customer.name;
                                    }
                                });
                                sendEmail(
                                    customerEmail, customerName, this.state.date, quocteDetails
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
    QuocteDetailItemContainer: {
        flexDirection: 'row',
    },
    quocteDetailRemoveBtn: {

    }
};
const mapStateToProps = (state, ownProps) => {
    const {
        customerId,
        customerGroupId,
        id,
        title,
        date,
        quocteDetails,
        loaded,
        error,
        isSave
    } = state.quoctes;
    const { selectedProducts, selectCompleted } = state.products;
    const { categories } = state.categories;
    const { customerGroups } = state.customerGroups;
    const { customers } = state.customers;
    const { units } = state.products;
    return {
        customerId,
        customerGroupId,
        date,
        id,
        title,
        quocteDetails,
        loaded,
        units,
        error,
        categories,
        customerGroups,
        customers,
        selectedProducts,
        isSave,
        selectCompleted
    };
};
export default connect(mapStateToProps, {
    loadQuocteDataFromSqlite,
    loadUnits,
    loadCustomerGroupListDataFromSqlite,
    loadCustomerListDataFromSqlite,
    toggleProductToSelectList,
    QuocteUpdate,
    resetSelectedProducts,
    ProductChange
})(EditQuocte);
