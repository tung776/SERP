import React, { Component } from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import {Text} from 'react-native';
class AppFooter extends Component {
    state = {  }
    render() {
        return (
            <View style = {styles.footerContainer}>
                <Text>Footer</Text>
            </View>
        );
    }
}

const styles = {
    footerContainer: {
        flex: 1,
        backgroundColor: '#2c3e50',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:5,
        paddingBottom: 5
    }
}
export default AppFooter;