import React from 'react';
import {
    View, Text, ScrollView, Dimensions,
    TouchableOpacity, TouchableWithoutFeedback,
    FlatList, TextInput
} from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import {
    loadCustomerListDataFromSqlite,
    loadCustomerByNameFromSqlite
} from '../../../actions/customerAction';
import { Spinner } from '../../commons/Spinner';

class Customers extends React.Component {
    state = {
        searchText: '',
    }
    componentWillMount() {
        if (!this.props.loaded) {
            this.props.loadCustomerListDataFromSqlite();
        }
    }
    addNewGroupBtnPress() {
        Actions.main();
    }

    renderCustomerList() {
        const { customers } = this.props;
        if (customers) {
            return (
                <FlatList
                    data={customers}
                    renderItem={({ item }) => {
                        if (item) {
                            return (
                                <TouchableWithoutFeedback
                                    key={item.key} onPress={() => {
                                        Actions.customerEdit({ customer: item });
                                    }}
                                >
                                    <View style={styles.listItem}>
                                        <Text style={styles.itemTitle}>{item.name}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        }
                        return null;
                    }

                    }
                />
            );
        }
        return (
            <Spinner />
        );
    }

    onSearchInputChange(text) {
        this.setState({ searchText: text });
    }

    onSearchPressed() {
        console.log(this.state.searchText);
        this.props.loadCustomerByNameFromSqlite(this.state.searchText);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Khách Hàng</Text>
                </Header>
                <View style={styles.body}>
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
                            placeholder="Tìm khách hàng :"
                        />
                        <TouchableOpacity
                            onPress={this.onSearchPressed.bind(this)}
                        >
                            <Ionicons name="ios-search" size={32} color="#16a085" />
                        </TouchableOpacity>
                    </View>

                    <Text>
                        {this.state.error && <Text style={styles.errorStyle}>{this.state.error.identifier}</Text>}
                    </Text>

                    {this.renderCustomerList()}
                </View>
                <Footer>
                    <TouchableOpacity style={styles.addNewGroupBtn} onPress={() => { Actions.customerNew(); }}>
                        <Ionicons name="ios-add-circle" size={32} color="#FFFFFF" />
                        <Text style={{ alignSelf: 'center', paddingLeft: 10, fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>Thêm Nhóm</Text>
                    </TouchableOpacity>
                </Footer>
            </View>
        );
    }
}

const widthScreen = Dimensions.get('window').width;
const widthImage = widthScreen - 30;
const styles = {
    container: stylesCommon.container,
    body: stylesCommon.body,
    headTitle: stylesCommon.headTitle,
    listItem: {
        // flexDirection: 'row',
        flex: 1,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        marginTop: 5,
        marginBottom: 5,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImage: {
        width: widthImage,
        height: (widthImage * 0.45),
        borderRadius: 8,
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: '500',
        alignSelf: 'center',
        paddingBottom: 5,
        paddingTop: 5,
    },
    addNewGroupBtn: {
        flexDirection: 'row',
        backgroundColor: '#2ecc71',
        padding: 3,
        paddingRight: 15,
        paddingLeft: 15,
        borderRadius: 5,
    },
    groupControl: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#FFFFFF',
        borderBottomWidth: 1
    },
    searchInput: {
        flex: 1,
        color: 'black',
        fontSize: 16
    },
};
const mapStateToProps = (state, ownProps) => {
    const { loading, loaded, customers } = state.customers;
    return { loading, loaded, customers };
};

export default connect(mapStateToProps, {
    loadCustomerListDataFromSqlite,
    loadCustomerByNameFromSqlite
})(Customers);
