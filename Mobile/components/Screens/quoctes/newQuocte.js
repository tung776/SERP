import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback, Picker, Alert, FlatList } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { URL } from '../../../../env';
import { loadCustomerGroupListDataFromSqlite } from '../../../actions/customerGroupAction';
import { loadCustomerListDataFromSqlite } from '../../../actions/customerAction';
import { loadUnits, toggleProductToSelectList } from '../../../actions/productActions';
import { QuocteChange, resetData } from '../../../actions/quocteActions';

class NewQuocte extends React.Component {
    state = {
        isExpanded: true
    }
    constructor(props) {
        super(props);


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

    renderProductList() {
        console.log('this.props.selectedProducts = ', this.props.selectedProducts);
        if (this.props.selectedProducts) {
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
                                                selectedValue={this.props.unitsId}
                                                onValueChange={
                                                    (itemValue, itemIndex) => this.props.QuocteDetailChange({ prop: "unitId", value: itemValue })
                                                }
                                            >
                                                {this.props.units && this.props.units.map((item) => (
                                                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                                                ))
                                                }
                                            </Picker>

                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 15 }}>10.000 VND</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
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

    onSelectProduct() {
        console.log('this.props.selectedProducts = ', this.props.selectedProducts);
        Actions.productSelector(this.props.selectedProducts);
    }

    onSave() {
        const {
            CategoryId,
            UnitId,
            TypeCargoId,
            IsPublic,
            PurchasePrice,
            SalePrice,
            MinQuantity,
            IsAvaiable,
            Name,
            Description,
        } = this.props;
        Alert.alert(
            'Thông Báo',
            'Bạn đã lưu dữ liệu thành công',
            [
                {
                    text: 'Xác Nhận', onPress: () => this.props.AddNewProduct({
                        CategoryId,
                        UnitId,
                        TypeCargoId,
                        IsPublic,
                        PurchasePrice,
                        SalePrice,
                        MinQuantity,
                        IsAvaiable,
                        Name,
                        Description,
                    })
                },
                { text: 'Hủy', onPress: () => console.log('cancel Pressed') },
            ]
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
                                date={this.props.date}
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
                                onDateChange={(date) => { this.props.QuocteChange({ prop: "date", value: date }) }}
                            />
                        </View>
                    </View>
                    <View style={styles.controlContainer}>
                        <Text style={styles.label} >Nhóm Khách hàng</Text>
                        <View style={styles.groupControl}>
                            <Picker
                                selectedValue={this.props.customerGroupId}
                                onValueChange={
                                    (itemValue, itemIndex) => this.props.QuocteChange({ prop: "customerGroupId", value: itemValue })
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
                                selectedValue={this.props.customerId}
                                onValueChange={
                                    (itemValue, itemIndex) => this.props.QuocteChange({ prop: "customerId", value: itemValue })
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
            )
        } else {
            return <View/>
        }
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
                            onPress = {() => this.setState({isExpanded: !this.state.isExpanded})}
                        >
                            {this.state.isExpanded ?
                            <Ionicons name="ios-arrow-dropup-outline" size={25} color="#FFFFFF" />:
                            <Ionicons name="ios-arrow-dropdown-outline" size={25} color="#FFFFFF" />
                            }
                        </TouchableOpacity>
                        
                    {this.renderProductList()}
                    <TouchableOpacity style={{ padding: 2, alignSelf: 'center', position: 'absolute', right: 5, bottom: 5 }}
                        onPress={this.onSelectProduct.bind(this)}
                    >
                        <Ionicons name="ios-add-circle" size={55} color="rgba(52, 152, 219,0.7)" />
                    </TouchableOpacity>
                </View>
                <Footer>
                    <View style={styles.FooterGroupButton} >
                        <TouchableOpacity style={styles.Btn}
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
