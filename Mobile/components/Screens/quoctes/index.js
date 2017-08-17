import React from 'react';
import {
    View, Text, ScrollView,
    TouchableOpacity, TouchableWithoutFeedback,
    TextInput, FlatList, Picker, Alert
} from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import {
    loadQuocteListDataFromSqlite,
    loadQuocteByCustomerOrCustomerGroupIdFromSqlite
} from '../../../actions/quocteActions.js';
import { loadCustomerGroupListDataFromSqlite } from '../../../actions/customerGroupAction';
import { loadCustomerListDataFromSqlite } from '../../../actions/customerAction';
import { Spinner } from '../../commons/Spinner';
import SqlService from '../../../database/sqliteService';
import moment from '../../../../Shared/utils/moment';

class QuocteList extends React.Component {
    state = {
        customerId: null,
        customerGroupId: null,
        error: null,
        products: [],
        loaded: false
    }
    constructor(props) {
        super(props);

    }
    componentWillMount() {
        // console.log(this.props.customers.length)
        if (this.props.customers.length == 0) {
            console.log('go to load customer');
            this.props.loadCustomerListDataFromSqlite();
        }
        if (this.props.customerGroups.length == 0) {
            this.props.loadCustomerGroupListDataFromSqlite();
        }
    }


    addNewGroupBtnPress() {
        Actions.main();
    }

    renderQuocteList() {

        if (this.props.quocteList) {
            return (
                <FlatList
                    style={styles.listQuocte}
                    data={this.props.quocteList}
                    renderItem={({ item }) => {
                        if (item) {
                            // moment.locale('vi');
                            return (
                                <TouchableWithoutFeedback
                                    key={item.key} onPress={() => {
                                        Actions.editQuocte({ quocte: item });
                                    }}
                                >
                                    <View style={styles.listItem}>
                                        <Text style={styles.itemTitle}>{item.title} - {moment(item.date).format('LL')}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
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
                <Text>Không tìm thấy báo giá bạn cần</Text>
            </View>
        );
    }

    onSearch() {
        if (this.state.customerId === null && this.state.customerGroupId === null ) {
            return Alert.alert(
                'Báo lỗi',
                'Bạn chưa chọn nhóm khách hàng hoặc khách hàng',
                [
                    {
                        text: 'Xác Nhận'
                    },
                    
                ]
            );
        }
        this.props.loadQuocteByCustomerOrCustomerGroupIdFromSqlite(this.state.customerId, this.state.customerGroupId);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Tìm báo Giá</Text>
                </Header>
                <View style={styles.body}>
                    <View style={styles.InputContainer}>
                        <View style={styles.groupControl} >
                            <Picker
                                style={{ flex: 1 }}
                                selectedValue={this.state.customerGroupId}
                                onValueChange={
                                    (itemValue, itemIndex) => this.setState({
                                        customerGroupId: itemValue,
                                        customerId: null
                                    })
                                }
                            >
                                <Picker.Item key={0} label="" value={null} />
                                {this.props.customerGroups && this.props.customerGroups.map((item) => (
                                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                                ))
                                }
                            </Picker>
                        </View>
                        <View style={styles.groupControl} >
                            <Picker
                                style={{ flex: 1 }}
                                selectedValue={this.state.customerId}
                                onValueChange={
                                    (itemValue, itemIndex) => this.setState({
                                        customerId: itemValue,
                                        customerGroupId: null
                                    })
                                }
                            >
                                <Picker.Item key={0} label="" value={null} />
                                {this.props.customers && this.props.customers.map((item) => (
                                    <Picker.Item key={item.id} label={item.name} value={item.id} />
                                ))
                                }
                            </Picker>
                        </View>
                        <TouchableOpacity
                            style={{ alignSelf: 'center', paddingTop: 5, paddingBottom: 5 }}
                            onPress={() => { this.onSearch() }}
                        >
                            <Ionicons name="ios-search" size={32} color="#16a085" />
                        </TouchableOpacity>
                    </View>

                    {this.renderQuocteList()}
                </View>
                <Footer>
                    <TouchableOpacity style={styles.addNewGroupBtn} onPress={() => { Actions.newQuocte(); }}>
                        <Ionicons name="ios-add-circle" size={32} color="#FFFFFF" />
                        <Text style={{ alignSelf: 'center', paddingLeft: 10, fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>Thêm Báo Giá</Text>
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
        height: 110,
        // flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(236, 240, 241,1.0)'
    },
    listQuocte: {
        flex: 1
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
    const { loading, loaded, quocteList } = state.quoctes;
    const { customerGroups } = state.customerGroups;
    const { customers } = state.customers;
    return {
        loading,
        loaded,
        quocteList,
        customerGroups,
        customers
    };
};
export default connect(mapStateToProps, {
    loadQuocteListDataFromSqlite,
    loadQuocteByCustomerOrCustomerGroupIdFromSqlite,
    loadCustomerGroupListDataFromSqlite,
    loadCustomerListDataFromSqlite,
})(QuocteList);
