import React, { Component } from 'react';
import {View, Text} from 'react-native';
import {Header, Footer} from '../../commons';
import { Actions } from 'react-native-router-flux';
import {connect} from 'react-redux';
import stylesCommon from '../../../styles';

class CategoryEdit extends Component {
    state = {  }
    render() {
        return (
            <View style = {styles.container}>
                <Header/>
                <View style = {styles.body}>
                    <Text>CategoryEdit</Text>
                </View>
                <Footer/>
            </View>
        );
    }
}
const styles = {
    container: stylesCommon.container,
    body: stylesCommon.body,
    headTitle: {
        fontSize: 20,
        color: '#1abc9c'
    }
}
// const mapStateToProps(state, ownProps)=> {
//     return state
// }
export default connect(null, {})(CategoryEdit);