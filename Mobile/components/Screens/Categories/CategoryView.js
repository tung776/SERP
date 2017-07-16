import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';
import { Ionicons } from '@expo/vector-icons';

class CategoryView extends Component {
    state = { }
    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headTitle}>Nhóm Sản Phẩm</Text>
                </Header>
                <View style={styles.body}>
                    <Text>CategoryView</Text>
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

// const widthScreen = Dimensions.get('window').width;
// const widthImage = widthScreen - 30;

const styles = {
   container: stylesCommon.container,
    body: stylesCommon.body,
    headTitle: stylesCommon.headTitle,
};
// const mapStateToProps(state, ownProps)=> {
//     return state
// }
export default connect(null, {})(CategoryView);
