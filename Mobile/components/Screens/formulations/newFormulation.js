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
    loadUnits,
    ProductChange,
    loadProductListDataFromSqlite
} from '../../../actions/productActions';
import { resetData, AddNewFormulation } from '../../../actions/formulationActions';
import db from '../../../database/sqliteConfig';
import { formatMoney, formatNumber, unformat } from '../../../../Shared/utils/format';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import formulationTemplate, { css, sendMessage, sendEmail } from '../../../../Shared/templates/formulationTemplate';
import Expo from 'expo';
import loadAsset from '../../../utils/loadAsset';
import { fontUrl, URL } from '../../../../env';

const { RNPrint } = NativeModules;

class NewFormulation extends React.Component {
    state = {
        id: '',
        isExpanded: true,
        isExpandedTotal: true,
        productId: '',
        date: '',
        note: '',
        quantity: 0,
        isActive: false,
        unitId: 0,
        formulationDetails: [],
        fontLocation: null,
        appIsReady: false,
        fontPath: null,
    }
    async componentWillMount() {
        if (!this.props.products || this.props.products.length == 0) {
            this.props.loadProductListDataFromSqlite();
        }
        if (!this.props.units || this.props.units.length == 0) {
            this.props.loadUnits();
        }
        const fontAsset = await loadAsset("vuarial", "ttf", fontUrl);
        this.setState({
            fontPath: fontAsset.localUri,
        });
    }

    componentWillReceiveProps(nextProps) {

        let formulationDetails = []
        if (this.props.isSave) {
            console.log('nextProps.selectedProducts = ', nextProps.selectedProducts);
        }

        if (nextProps.selectCompleted) {
            nextProps.selectedProducts.forEach((detail) => {
                this.state.formulationDetails.push({ ...detail, key: `${detail.id}-${detail.unitId}-${detail.quantity}-${Math.random() * 10}` });
            });

            const { total } = this.caculateTotalPrice(this.state.formulationDetails);

            this.setState({
                total,
                formulationDetails: this.state.formulationDetails,
            });
            nextProps.ProductChange({ prop: 'selectCompleted', value: false })
            nextProps.ProductChange({ prop: 'selectedProducts', value: [] });
        }

        this.setState({
            id: nextProps.id,
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
                            date, productId, formulationDetails
                        } = this.state;
                        this.props.AddNewFormulation({
                            date, productId, formulationDetails, user: this.props.user
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

    onProductChanged(productId) {
        this.setState({ productId });
    }

    caculateTotalPrice(formulationDetails = []) {
        let total, totalPrice = 0

        

        formulationDetails.forEach((formulation) => {

            this.props.units.forEach((unit) => {
                if(unit.id == formulation.unitId) {
                    total = total + formulation.quantity * unit.rate;
                }
            })

            const temp = formulation.purchasePrice * formulation.quantity;
            totalPrice += temp;
        });

        return {
            total,
            totalPrice
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

        const { total } = this.caculateTotalPrice(formulationDetails);
        this.setState({
            total,
            formulationDetails
        });
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
                                        disabled={this.props.isSave}
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
                                                    editable={!this.props.isSave}
                                                    disableFullscreenUI
                                                    underlineColorAndroid={'transparent'}
                                                    style={styles.textInput}
                                                    blurOnSubmit
                                                    value={formatNumber(item.quantity)}
                                                    onChangeText={text => {
                                                        this.state.formulationDetails.forEach((product) => {
                                                            if (product.key == item.key) {
                                                                product.quantity = unformat(text);
                                                            }
                                                        });
                                                        const { total } = this.caculateTotalPrice(this.state.formulationDetails);
                                                        this.setState({
                                                            formulationDetails: this.state.formulationDetails,
                                                            total
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
                                                        this.state.formulationDetails.forEach((product) => {
                                                            if (product.key == item.key) {
                                                                product.purchasePrice = unformat(text);
                                                            }
                                                        });
                                                        const { total } = this.caculateTotalPrice(this.state.formulationDetails);
                                                        this.setState({
                                                            formulationDetails: this.state.formulationDetails,
                                                            total
                                                        });
                                                    }}
                                                    type="Text"
                                                    name="Description"
                                                    placeholder="Giá Bán"
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

    renderHeaderFomulation() {
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
                                placeholder="Chọn ngày lập công thức"
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
                        <Text style={styles.label} >Sản Phẩm</Text>
                        <View style={styles.groupControl}>
                            <Picker
                                enabled={!this.props.isSave}
                                selectedValue={this.state.productId}
                                onValueChange={
                                    (itemValue, itemIndex) => {
                                        this.onProductChanged(itemValue);
                                    }
                                }
                            >
                                <Picker.Item key={0} label="" value={null} />
                                {this.props.products && this.props.products.map((item) => (
                                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                                ))
                                }
                            </Picker>
                        </View>
                    </View>
                    
                    <View style={styles.controlContainer}>
                        <Text style={styles.label} >Ghi Chú</Text>
                        <View style={styles.groupControl}>
                            <TextInput
                                editable={!this.props.isSave}
                                disableFullscreenUI
                                underlineColorAndroid={'transparent'}
                                style={styles.textInput}
                                blurOnSubmit
                                value={this.state.note}
                                onChangeText={text => this.setState({ note: text })}
                                type="Text"
                                name="note"
                                placeholder="Tiêu đề công thức"
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
                    <Text style={styles.headTitle} >Tạo Công Thức Sản Phẩm</Text>
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

                    {this.renderHeaderFomulation()}

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
                                    let productName = '';
                                    this.props.products.forEach((product) => {
                                        if (product.id == this.state.productId) {
                                            productName = product.name;
                                        }
                                    });
                                    let options = {
                                        html: formulationTemplate(productName, this.props.id,
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
                            disabled={!this.props.isSave}
                            style={[styles.Btn, (this.props.isSave) ? { backgroundColor: '#16a085' } : { backgroundColor: '#7f8c8d' }]}
                            onPress={() => {
                                let formulationDetails = [...this.state.formulationDetails];
                                formulationDetails.forEach((formulation) => {
                                    this.props.units.forEach((unit) => {
                                        if (formulation.unitId == unit.id) {
                                            formulation.unitName = unit.name
                                        }
                                    })
                                });
                                let productPhone = '';
                                let productName = '';
                                this.props.products.forEach((product) => {
                                    if (product.id == this.state.productId) {
                                        productPhone = product.phone;
                                        productName = product.name;
                                    }
                                });
                                sendMessage(
                                    productPhone, productName, this.state.date, this.state.total, formulationDetails
                                );
                            }}
                        >
                            <Ionicons name="ios-send-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!this.props.isSave}
                            style={[styles.Btn, (this.props.isSave) ? { backgroundColor: '#16a085' } : { backgroundColor: '#7f8c8d' }]}
                            onPress={() => {
                                let formulationDetails = [...this.state.formulationDetails];
                                formulationDetails.forEach((formulation) => {
                                    this.props.units.forEach((unit) => {
                                        if (formulation.unitId == unit.id) {
                                            formulation.unitName = unit.name
                                        }
                                    })
                                });
                                let productName = '';
                                let productEmail = '';
                                this.props.products.forEach((product) => {
                                    if (product.id == this.state.productId) {
                                        productEmail = product.email;
                                        productName = product.name;
                                    }
                                });
                                sendEmail(
                                    productEmail, productName, this.state.date, this.state.total, formulationDetails
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
        productId,
        date,
        formulationDetails,
        loaded,
        error,
        note,
        unitId,
        quantity,        
        isSave,
        total
    } = state.formulations;
    const { selectedProducts, selectCompleted, units, products } = state.products;
    const { isAuthenticated, user } = state.auth;
    return {
        isSave,
        id,
        productId,
        date,
        note,
        quantity,
        total,
        unitId,
        formulationDetails,
        loaded,
        units,
        error,
        selectedProducts,
        user,
        selectCompleted,
        products
    };
};
export default connect(mapStateToProps, {
    resetData,
    loadUnits,
    loadProductListDataFromSqlite,
    AddNewFormulation,
    ProductChange
})(NewFormulation);
