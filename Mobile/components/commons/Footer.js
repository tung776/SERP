import React, { Component } from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import { View, Dimensions } from 'react-native';
const height = Dimensions.get('window').height;
class AppFooter extends Component {
    state = { }
    render() {
        return (
            <View style ={styles.footerContainer}>
                {this.props.children}
            </View>
        );
    }
}

const styles = {
    footerContainer: {
        height: height / 12,
        backgroundColor: '#2c3e50',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
    }
};
export default AppFooter;
