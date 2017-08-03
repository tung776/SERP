import React from 'react';
import {
    View, Text, ScrollView, Image, Dimensions,
    TouchableOpacity, TouchableWithoutFeedback,
    FlatList
} from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { loadCategoriesDataFromSqlite } from '../../../actions/categoryActions';
import { Spinner } from '../../commons/Spinner';
import { URL } from '../../../../env';

class Categories extends React.Component {
    state = {}
    componentWillMount() {
        if (!this.props.loaded) {
            this.props.loadCategoriesDataFromSqlite();
        }
    }
    addNewGroupBtnPress() {
        Actions.main();
    }

    convertData() {
        if (this.props.categories) {
            let categories = [];
            this.props.categories.forEach((item) => {
                const convertedData = { ...item, key: item.id }
                categories.push(convertedData);
            });
            return categories;
        }
    }
    renderCategoryList() {
        const categories = this.convertData();
        if (this.props.categories) {
            return (
                <FlatList
                    data={categories}
                    renderItem={({ item }) =>
                        <TouchableWithoutFeedback key={item.key} onPress={() => {
                            console.log(`id = ${item.id} name = ${item.name} cliked`)
                            Actions.categoryEdit({ category: item })
                        }} >
                            <View style={styles.listItem}>
                                {
                                    item.imageUrl &&
                                    <Image
                                        style={styles.itemImage}
                                        source={{ uri: `${URL}/${item.imageUrl}` }}
                                    />
                                }
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
    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Nhóm Sản Phẩm</Text>
                </Header>
                <View style={styles.body}>
                    {this.renderCategoryList()}
                </View>
                <Footer>
                    <TouchableOpacity style={styles.addNewGroupBtn} onPress={() => { Actions.categoryNew(); }}>
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
    }
};
const mapStateToProps = (state, ownProps) => {
    const { loading, loaded, categories } = state.categories;
    return { loading, loaded, categories }
}
export default connect(mapStateToProps, {
    loadCategoriesDataFromSqlite
})(Categories);
