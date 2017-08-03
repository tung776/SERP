import React from 'react';
import {
    View, Text, ScrollView,
    TouchableOpacity, TouchableWithoutFeedback,
    TextInput, FlatList
} from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { loadProductsDataFromSqlite } from '../../../actions/productActions';
import { Spinner } from '../../commons/Spinner';
import SqlService from '../../../database/sqliteService';

class ProductList extends React.Component {
    state = {
        searchText: '',
        error: null,
        products: [],
        loaded: false
    }

    // componentDidMount() {
    // const { categoryId } = this.props;
    // SqlService.query(`select * from products where categoryId = ${categoryId}`).then(
    //     result => {
    //         this.setState({ products: result });
    //     }
    // );
    // }
    onSearchInputChange(text) {
        this.setState({ searchText: text });
    }

    addNewGroupBtnPress() {
        Actions.main();
    }

    convertData() {
        const products = [];
        if (this.props.categoryId) {
            const { categoryId } = this.props;
            this.setState({ loaded: false });
            
            SqlService.query(`select * from products where categoryId = ${categoryId}`).then(
                result => {
                    result.forEach((item) => {
                        const convertedData = { ...item, key: item.id };
                        products.push(convertedData);                        
                    });
                    this.setState({ products, loaded: true });
                }
            );
        }
    }
    renderProductList() {
        this.convertData();
        if (this.state.products && this.state.loaded) {
            return (
                <FlatList
                    data={this.state.products}
                    renderItem={({ item }) =>
                        <TouchableWithoutFeedback
                            key={item.key} onPress={() => {
                                console.log(`id = ${item.id} name = ${item.name} cliked`);
                                Actions.ProductDetail({ product: item });
                            }}
                        >
                            <View style={styles.listItem}>
                                <Text style={styles.itemTitle}>{item.name}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    }
                />
            );
        }
        return (
            <Spinner />
        );
    }

    renderProductsItem() {
        if (this.props.loaded) {
            const { products } = this.props;
            const productsRedered = products.map((item) => (
                <TouchableWithoutFeedback key={item.id} onPress={() => {
                    console.log(`id = ${item.id} name = ${item.name} cliked`)
                    Actions.ProductDetail({ product: item })
                }} >
                    <View style={styles.listItem}>
                        <Text style={styles.itemTitle}>{item.name}</Text>
                        <Ionicons name="ios-arrow-dropright" size={32} color="#16a085" />
                    </View>
                </TouchableWithoutFeedback>
            ), this);
            return (
                <View>
                    {productsRedered}
                </View>
            );
        }
        return (
            <Spinner />
        );
    }    

    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Danh Sách Sản Phẩm</Text>
                </Header>
                <View style={styles.body}>
                    <ScrollView>
                        <View style={styles.InputContainer}>
                            <View style={styles.groupControl} >
                                <TextInput
                                    disableFullscreenUI
                                    underlineColorAndroid={'transparent'}
                                    style={styles.searchInput}
                                    blurOnSubmit
                                    value={this.state.searchText}
                                    onChangeText={this.onSearchInputChange.bind(this)}
                                    type="Text"
                                    name="search"
                                    placeholder="Tìm sản phẩm :"
                                />
                                <TouchableOpacity>
                                    <Ionicons name="ios-search" size={32} color="#16a085" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text>
                            {this.state.error && <Text style={styles.errorStyle}>{this.state.error.identifier}</Text>}
                        </Text>
                        {this.renderProductList()}
                    </ScrollView>
                </View>
                <Footer>
                    <TouchableOpacity style={styles.addNewGroupBtn} onPress={() => { Actions.ProductNew(); }}>
                        <Ionicons name="ios-add-circle" size={32} color="#FFFFFF" />
                        <Text style={{ alignSelf: 'center', paddingLeft: 10, fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>Thêm Sản Phẩm</Text>
                    </TouchableOpacity>
                </Footer>
            </View>
        );
    }
}

// const widthScreen = Dimensions.get('window').width;
// const widthImage = widthScreen - 30;
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
        borderWidth: 1,
        borderColor: '#FFFFFF',
        marginTop: 2,
        marginBottom: 2,
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: 17,
        fontWeight: '400',
        paddingBottom: 2,
        paddingLeft: 10,
        paddingTop: 2,
    },
    searchTitle: {
        fontSize: 17,
        fontWeight: '400',
        paddingBottom: 2,
        paddingLeft: 10,
        paddingTop: 2,
        color: '#2c3e50'
    },
    addNewGroupBtn: {
        flexDirection: 'row',
        backgroundColor: '#2ecc71',
        padding: 3,
        paddingRight: 15,
        paddingLeft: 15,
        borderRadius: 5,
    },
    InputContainer: {
        flex: 1,
        // flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: '#2980b9'
    },
    groupControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 16
    },
    errorStyle: {
        color: 'rgba(231, 76, 60,1.0)',
        fontSize: 18
    },
};
const mapStateToProps = (state, ownProps) => {
    const { loading, loaded, products } = state.products;
    return { loading, loaded, products };
};
export default connect(mapStateToProps, {
    loadProductsDataFromSqlite
})(ProductList);
