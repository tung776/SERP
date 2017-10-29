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
    loadFormulationListDataFromServerByProductId
} from '../../../actions/formulationActions';
import { loadProductByNameFromSqlite } from '../../../actions/productActions';
import { Spinner } from '../../commons/Spinner';
import SqlService from '../../../database/sqliteService';
import moment from '../../../../Shared/utils/moment';

class FormulationList extends React.Component {
    state = {
        ProductId: null,
        error: null,
        formulationList: [],
        loaded: false
    }

    componentWillMount() {
        if (this.props.Products.length == 0) {
            this.props.loadProductByNameFromSqlite();
        }
    }

    addNewGroupBtnPress() {
        Actions.main();
    }

    renderFormulationList() {
        if (this.props.formulationList) {
            return (
                <FlatList
                    style={styles.listFormulation}
                    data={this.props.formulationList}
                    renderItem={({ item }) => {
                        if (item) {
                            return (
                                <TouchableWithoutFeedback
                                    key={item.key} onPress={() => {
                                        Actions.editFormulation({ formulation: item });
                                    }}
                                >
                                    <View style={styles.listItem}>
                                        <Text style={styles.itemTitle}>Mã Công Thức: {item.id} - {moment(item.date, moment.ISO_8601).format('LL')}</Text>
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
                <Text>Không tìm thấy công thức bạn cần</Text>
            </View>
        );
    }

    onSearch() {
        if (this.state.ProductId === null ) {
            return Alert.alert(
                'Báo lỗi',
                'Bạn chưa chọn sản phẩm',
                [
                    {
                        text: 'Xác Nhận'
                    },
                    
                ]
            );
        }
        this.props.loadFormulationListDataFromServerByProductId(this.state.ProductId);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Tìm Công Thức</Text>
                </Header>
                <View style={styles.body}>
                    <View style={styles.InputContainer}>
                        <View style={styles.groupControl} >
                            <Picker
                                style={{ flex: 1 }}
                                selectedValue={this.state.ProductId}
                                onValueChange={
                                    (itemValue, itemIndex) => this.setState({
                                        ProductId: itemValue
                                    })
                                }
                            >
                                <Picker.Item key={0} label="" value={null} />
                                {this.props.Products && this.props.Products.map((item) => (
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

                    {this.renderFormulationList()}
                </View>
                <Footer>
                    <TouchableOpacity style={styles.addNewGroupBtn} onPress={() => { Actions.newFormulation(); }}>
                        <Ionicons name="ios-add-circle" size={32} color="#FFFFFF" />
                        <Text style={{ alignSelf: 'center', paddingLeft: 10, fontSize: 16, color: '#FFFFFF', fontWeight: '600' }}>Thêm Công Thức</Text>
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
    listFormulation: {
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
    const { loading, loaded, formulationList } = state.formulations;
    const { Products } = state.Products;
    return {
        loading,
        loaded,
        formulationList,
        Products
    };
};
export default connect(mapStateToProps, {
    loadFormulationListDataFromServerByProductId,
    loadProductByNameFromSqlite,
})(FormulationList);
