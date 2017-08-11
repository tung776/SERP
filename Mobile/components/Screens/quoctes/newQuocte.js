import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Picker, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { URL } from '../../../../env';
import {
    loadProductByIdFromSqlite,
    AddNewProduct,
    ProductChange,
    resetData,
    loadUnits,
    loadTypeCargo
} from '../../../actions/productActions.js';
import { loadCustomerGroupListDataFromSqlite } from '../../../actions/customerGroupAction';
import { loadCustomerListDataFromSqlite } from '../../../actions/customerAction';
import { loadUnits } from '../../../actions/productActions';
import { QuocteChange, resetData } from '../../../actions/quocteActions';

class NewQuocte extends React.Component {
    state = {
        ProductName: '',
        MinStock: '',
        Price: ''
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
        if (this.props.selectedProducts) {
            return (
                <FlatList
                    style={styles.listProduct}
                    data={this.props.selectedProducts}
                    renderItem={({ item }) => {
                        if (item) {
                            return (
                                <View>
                                    <TouchableWithoutFeedback
                                        key={item.key} onPress={() =>
                                            this.onRemove(item)
                                        }
                                    >
                                        <View style={styles.listItem}>
                                            <Text style={styles.itemTitle}>Remove</Text>
                                        </View>
                                    </TouchableWithoutFeedback>                                    
                                    <View>
                                        <View style={styles.listItem}>
                                            <Text style={styles.itemTitle}>{item.name}</Text>
                                        </View>
                                        <View>
                                            <Picker
                                                selectedValue={this.props.unitsId}
                                                onValueChange={
                                                    (itemValue, itemIndex) => this.props.QuocteChange({ prop: "unitId", value: itemValue })
                                                }
                                            >
                                                {this.props.units && this.props.units.map((item) => (
                                                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                                                ))
                                                }
                                            </Picker>
                                        </View>
                                    </View>
                                    <View style={styles.listItem}>
                                        <Text style={styles.itemTitle}>Giá Bán</Text>
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
    //Tham khảo select (picker) react native: 
    //https://facebook.github.io/react-native/docs/picker.html
    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle} >Tạo Báo Giáo</Text>
                </Header>
                <View style={styles.body}>
                    <ScrollView>

                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Ngày tháng</Text>
                            <View style={styles.groupControl}>
                                <Picker
                                    selectedValue={this.props.customerGroupId}
                                    onValueChange={
                                        (itemValue, itemIndex) => this.props.QuocteChange({ prop: "date", value: itemValue })
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
                        {this.renderProductList()}
                        <TouchableOpacity style={styles.Btn}
                            onPress={this.onSave.bind(this)}
                        >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                            <Text style={styles.titleButton}>Thêm sản phẩm</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <Footer>
                    <View style={styles.FooterGroupButton} >
                        <TouchableOpacity style={styles.Btn}
                            onPress={this.onSave.bind(this)}
                        >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                            <Text style={styles.titleButton}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.Btn}
                            onPress={() => Actions.pop()}
                        >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                            <Text style={styles.titleButton}>Gửi Báo Giá</Text>
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
        flex: 1,
        padding: 5,
        justifyContent: 'center',
        borderColor: '#7f8c8d',
        borderRadius: 10,
        borderWidth: 0.2,
        marginTop: 5,
    },
    groupControl: {
        borderRadius: 5,
        borderWidth: 1,
        marginBottom: 5,
        marginTop: 5,
        padding: 5,
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
    };
};
export default connect(mapStateToProps, {
    loadCustomerGroupListDataFromSqlite,
    QuocteChange,
    resetData,
    loadUnits,
    loadCustomerListDataFromSqlite
})(NewQuocte);
