import React from 'react';
import { View, Text } from 'react-native';
import Header from '../../commons/Header';
import Footer from '../../commons/Footer';
import { connect } from 'react-redux';
import stylesCommon from '../../../styles';

class CategoryEdit React.Component {
    state = { }
    render() {
        return (
            <View style={styles.container}>
                <Header />
                <View style={styles.body}>
                    <Text>CategoryEdit</Text>
                </View>
                <Footer />
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
};
// const mapStateToProps(state, ownProps)=> {
//     return state
// }
export default connect(null, {})(CategoryEdit);
