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
    loadSupplierListDataFromSqlite,
    loadSupplierByNameFromSqlite
} from '../../../actions/supplierAction';
import { Spinner } from '../../commons/Spinner';

class Suppliers extends React.Component {
    state = {
        searchText: '',
    }
    componentWillMount() {
        if (!this.props.loaded) {
            this.props.loadSupplierListDataFromSqlite();
        }
    }
    addNewGroupBtnPress() {
        Actions.main();
    }

    renderSupplierList() {
        const { suppliers } = this.props;
        if (suppliers) {
            return (
                <FlatList
                    data={suppliers}
                    renderItem={({ item }) => {
                        if (item) {
                            return (
                                <TouchableWithoutFeedback
                                    key={item.key} onPress={() => {
                                        Actions.supplierEdit({ supplier: item });
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
        this.props.loadSupplierByNameFromSqlite(this.state.searchText);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Nhà Cung Cấp</Text>
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
                            placeholder="Tìm nhà cung cấp :"
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

                    {this.renderSupplierList()}
                </View>
                <Footer>
                    <TouchableOpacity style={styles.addNewGroupBtn} onPress={() => { Actions.newSupplier(); }}>
                        <Ionicons name="ios-add-circle" size={32} color="#FFFFFF" />
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
        fontSize: 16,
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
    const { loading, loaded, suppliers } = state.suppliers;
    return { loading, loaded, suppliers };
};

export default connect(mapStateToProps, {
    loadSupplierListDataFromSqlite,
    loadSupplierByNameFromSqlite
})(Suppliers);
