import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Picker, Alert, FlatList } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { loadCustomerGroupListDataFromSqlite } from '../../../actions/customerGroupAction';
import { loadCustomerListDataFromSqlite } from '../../../actions/customerAction';
import { loadUnits, toggleProductToSelectList } from '../../../actions/productActions';
import { QuocteChange, resetData } from '../../../actions/quocteActions';
import db from '../../../database/sqliteConfig';

class NewQuocte extends React.Component {
    state = {
        isExpanded: true,
        customerGroupId: '',
        customerId: '',
        date: '',
        quocteDetails: []
    }
    componentWillMount() {
        this.props.resetData();
        if (!this.props.customers || this.props.customers.length == 0) {
            this.props.loadCustomerListDataFromSqlite();
        }
        if (!this.props.units || this.props.units.length == 0) {
            this.props.loadUnits();
        }
        if (!this.props.customerGroups || this.props.customerGroups.length == 0) {
            this.props.loadCustomerGroupListDataFromSqlite();
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps = ', nextProps.selectedProducts);
        this.setState({ quocteDetails: nextProps.selectedProducts });
    }

    onSave() {
        const {
            customerId,
            customerGroupId,
            date,
            selectedProducts
        } = this.props;
        Alert.alert(
            'Thông Báo',
            'Bạn đã lưu dữ liệu thành công',
            [
                {
                    text: 'Xác Nhận',
onPress: () => this.props.AddQuocte({
                        customerId,
                        customerGroupId,
                        date,
                        selectedProducts
                    })
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
            if (item.id === product.id) {
                item.salePrice = Math.floor(oldPrice * newRate);
                item.unitId = newUnitId;
            }            
        });
        
        this.setState({
            quocteDetails: this.state.quocteDetails,
        });
    }

    onSelectProduct() {
        console.log('this.props.selectedProducts = ', this.props.selectedProducts);
        Actions.productSelector(this.props.selectedProducts);
    }

    renderProductList() {
        if (this.state.quocteDetails) {            
            console.log('this.state.quocteDetails = ', this.state.quocteDetails);
            return (
                <FlatList
                    style={{ marginTop: 10, marginBottom: 10 }}
                    data={this.props.selectedProducts}
                    renderItem={({ item }) => {
                        if (item) {
                            return (
                                <View
                                    style={{ flexDirection: 'row', height: 70, borderBottomWidth: 3, borderBottomColor: '#bdc3c7', backgroundColor: '#ecf0f1', padding: 5 }}
                                >
                                    <TouchableWithoutFeedback

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

                                            <Picker
                                                style={{ flex: 1 }}
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
                                                <Text style={{ fontSize: 15 }}>{item.salePrice}</Text>
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
                <View>
                    <View style={styles.controlContainer}>
                        <Text style={styles.label} >Ngày tháng</Text>
                        <View style={styles.groupControl}>
                            <DatePicker
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
                                selectedValue={this.state.customerGroupId}
                                onValueChange={
                                    (itemValue, itemIndex) => this.setState({ customerGroupId: itemValue, customerId: '' })
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
                        <Text style={styles.label} >Khách Hàng</Text>
                        <View style={styles.groupControl}>
                            <Picker
                                selectedValue={this.state.customerId}
                                onValueChange={
                                    (itemValue, itemIndex) => this.setState({ customerId: itemValue, customerGroupId: '' })
                                }
                            >
                                {this.props.customers && this.props.customers.map((item) => (
                                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                                ))
                                }
                            </Picker>
                        </View>
                    </View>
                </View>
            );
        } 
            return <View />;
    }
    //Tham khảo select (picker) react native: 
    //https://facebook.github.io/react-native/docs/picker.html
    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle} >Tạo Báo Giá</Text>
                </Header>
                <View style={styles.body}>
                    {this.renderHeaderQuocte()}

                    <TouchableOpacity
                        style={styles.Btn}
                        onPress={() => this.setState({ isExpanded: !this.state.isExpanded })}
                    >
                        {this.state.isExpanded ?
                            <Ionicons name="ios-arrow-dropup-outline" size={25} color="#FFFFFF" /> :
                            <Ionicons name="ios-arrow-dropdown-outline" size={25} color="#FFFFFF" />
                        }
                    </TouchableOpacity>

                    {this.renderProductList()}
                    <TouchableOpacity
                        style={{ padding: 2, alignSelf: 'center', position: 'absolute', right: 5, bottom: 5 }}
                        onPress={this.onSelectProduct.bind(this)}
                    >
                        <Ionicons name="ios-add-circle" size={55} color="rgba(52, 152, 219,0.7)" />
                    </TouchableOpacity>
                </View>
                <Footer>
                    <View style={styles.FooterGroupButton} >
                        <TouchableOpacity
                            style={styles.Btn}
                            onPress={this.onSave.bind(this)}
                        >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.Btn}
                            onPress={() => Actions.pop()}
                        >
                            <Ionicons name="ios-print-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.Btn}
                            onPress={() => Actions.pop()}
                        >
                            <Ionicons name="ios-send-outline" size={25} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
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
        height: 80,
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
        fontSize: 16
    },
    errorStyle: {
        color: 'rgba(231, 76, 60,1.0)',
        fontSize: 18
    },
    label: {
        fontSize: 16,
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
        date,
        quocteDetails,
        loaded,
        error
    } = state.quoctes;
    const { selectedProducts } = state.products;
    const { categories } = state.categories;
    const { customerGroups } = state.customerGroups;
    const { customers } = state.customers;
    const { units } = state.products;
    return {
        customerId,
        customerGroupId,
        date,
        quocteDetails,
        loaded,
        units,
        error,
        categories,
        customerGroups,
        customers,
        selectedProducts,
    };
};
export default connect(mapStateToProps, {
    loadCustomerGroupListDataFromSqlite,
    QuocteChange,
    resetData,
    loadUnits,
    loadCustomerListDataFromSqlite,
    toggleProductToSelectList
})(NewQuocte);
