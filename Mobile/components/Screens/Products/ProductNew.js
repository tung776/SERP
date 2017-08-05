import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Picker } from 'react-native';
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
import { loadCategoriesDataFromSqlite } from '../../../actions/categoryActions';

class ProductNew extends React.Component {
    state = {
        ProductName: '',
        MinStock: '',
        Price: ''
    }
    componentWillMount() {
        this.props.resetData();
        if (!this.props.typeCargoes || this.props.typeCargoes.length == 0) {
            this.props.loadTypeCargo();
        }
        if (!this.props.units || this.props.units.length == 0) {
            this.props.loadUnits();
        }
        if (!this.props.categories || this.props.categories.length == 0) {
            this.props.loadCategoriesDataFromSqlite();
        }
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
        this.props.AddNewProduct({
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
    }
    //Tham khảo select (picker) react native: 
    //https://facebook.github.io/react-native/docs/picker.html
    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle} >Thêm sản phẩm mới</Text>
                </Header>
                <View style={styles.body}>
                    <ScrollView>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Tên Sản Phẩm</Text>
                            <View style={styles.groupControl}>
                                <TextInput
                                    disableFullscreenUI
                                    underlineColorAndroid={'transparent'}
                                    style={styles.textInput}
                                    blurOnSubmit
                                    value={this.props.Name}
                                    onChangeText={text => this.props.ProductChange({ prop: "Name", value: text })}
                                    type="Text"
                                    name="ProductName"
                                    placeholder="Điền tên sản phẩm:"
                                />
                                <Text>
                                    {this.error && <Text style={styles.errorStyle}>{this.error.ProductName}</Text>}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Nhóm Sản Phẩm</Text>
                            <View style={styles.groupControl}>
                                <Picker
                                    selectedValue={this.props.CategoryId}
                                    onValueChange={
                                        (itemValue, itemIndex) => this.props.ProductChange({ prop: "CategoryId", value: itemValue })
                                    }
                                >
                                    {this.props.categories && this.props.categories.map((item) => (
                                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                                    ))
                                    }
                                </Picker>
                            </View>
                        </View>


                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Đơn Vị Tính</Text>
                            <View style={styles.groupControl}>
                                <Picker
                                    selectedValue={this.props.UnitId}
                                    onValueChange={
                                        (itemValue, itemIndex) => this.props.ProductChange({ prop: "UnitId", value: itemValue })
                                    }
                                >
                                    {this.props.units && this.props.units.map((item) => (
                                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                                    ))
                                    }
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Loại Hàng Hóa</Text>
                            <View style={styles.groupControl}>
                                <Picker
                                    selectedValue={this.props.TypeCargoId}
                                    onValueChange={
                                        (itemValue, itemIndex) => this.props.ProductChange({ prop: "TypeCargoId", value: itemValue })
                                    }
                                >
                                    {this.props.typeCargoes && this.props.typeCargoes.map((item) => (
                                        <Picker.Item key={item.id} label={item.name} value={item.id} />
                                    ))
                                    }
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Giá Mua</Text>
                            <View style={styles.groupControl}>
                                <TextInput
                                    disableFullscreenUI
                                    underlineColorAndroid={'transparent'}
                                    style={styles.textInput}
                                    blurOnSubmit
                                    value={this.props.PurchasePrice}
                                    onChangeText={text => this.props.ProductChange({ prop: "PurchasePrice", value: text })}
                                    type="Text"
                                    name="PurchasePrice"
                                    placeholder="Giá Mua"
                                />
                                <Text>
                                    {this.error && <Text style={styles.errorStyle}>{this.error.PurchasePrice}</Text>}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Giá Bán</Text>
                            <View style={styles.groupControl}>
                                <TextInput
                                    disableFullscreenUI
                                    underlineColorAndroid={'transparent'}
                                    style={styles.textInput}
                                    blurOnSubmit
                                    value={this.props.SalePrice}
                                    onChangeText={text => this.props.ProductChange({ prop: "SalePrice", value: text })}
                                    type="Text"
                                    name="SalePrice"
                                    placeholder="Giá bán"
                                />
                                <Text>
                                    {this.error && <Text style={styles.errorStyle}>{this.error.SalePrice}</Text>}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Tồn Tối Thiểu</Text>
                            <View style={styles.groupControl}>
                                <TextInput
                                    disableFullscreenUI
                                    underlineColorAndroid={'transparent'}
                                    style={styles.textInput}
                                    blurOnSubmit
                                    value={this.props.MinQuantity}
                                    onChangeText={text => this.props.ProductChange({ prop: "MinQuantity", value: text })}
                                    type="Text"
                                    name="MinQuantity"
                                    placeholder="Tồn kho tối thiểu"
                                />
                                <Text>
                                    {this.error && <Text style={styles.errorStyle}>{this.error.MinQuantity}</Text>}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Công Khai Sản Phẩm</Text>
                            <View style={styles.groupControl}>
                                <Picker
                                    selectedValue={this.props.IsPublic}
                                    onValueChange={
                                        (itemValue, itemIndex) => this.props.ProductChange({ prop: "IsPublic", value: itemValue })
                                    }
                                >
                                    <Picker.Item key={true} label={'Công Khai'} value={true} />
                                    <Picker.Item key={false} label={'Riêng tư'} value={false} />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Hàng Có Sẵn</Text>
                            <View style={styles.groupControl}>
                                <Picker
                                    selectedValue={this.props.IsAvaiable}
                                    onValueChange={
                                        (itemValue, itemIndex) => this.props.ProductChange({ prop: "IsAvaiable", value: itemValue })
                                    }
                                >
                                    <Picker.Item key={true} label={'Hàng Có Sẵn'} value={true} />
                                    <Picker.Item key={false} label={'Hàng Chưa Có Sẵn'} value={false} />
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.controlContainer}>
                            <Text style={styles.label} >Mô tả</Text>
                            <View style={styles.groupControl}>
                                <TextInput
                                    multiline
                                    numberOfLines={10}
                                    disableFullscreenUI
                                    underlineColorAndroid={'transparent'}
                                    style={styles.textInput}
                                    blurOnSubmit
                                    value={this.props.Description}
                                    onChangeText={text => this.props.ProductChange({ prop: "Description", value: text })}
                                    type="Text"
                                    name="Description"
                                    placeholder="Mô tả sản phẩm"
                                />
                                <Text>
                                    {this.error && <Text style={styles.errorStyle}>{this.error.Description}</Text>}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <Footer>
                    <View style={styles.FooterGroupButton} >
                        <TouchableOpacity style={styles.Btn}
                            onPress={this.onSave.bind(this) }
                        >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                            <Text style={styles.titleButton}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.Btn}
                            onPress={() => Actions.pop()}
                        >
                            <Ionicons name="ios-checkmark-circle" size={25} color="#FFFFFF" />
                            <Text style={styles.titleButton}>Hủy</Text>
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
        Id,
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
        loaded,
        units,
        typeCargoes,
        error
    } = state.products;
    const { categories } = state.categories;
    return {
        Id,
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
        units,
        typeCargoes,
        loaded,
        error,
        categories
    };
};
export default connect(mapStateToProps, {
    loadProductByIdFromSqlite,
    AddNewProduct,
    ProductChange,
    resetData,
    loadTypeCargo,
    loadUnits,
    loadCategoriesDataFromSqlite
})(ProductNew);
