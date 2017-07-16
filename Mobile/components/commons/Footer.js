import React, { Component } from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import {Text, View, Dimensions} from 'react-native';
const height = Dimensions.get("window").height;
class AppFooter extends Component {
    state = {  }
    render() {
        return (
            <View style = {styles.footerContainer}>
                <Text style = {styles.footerTitleStyle}>Footer</Text>
            </View>
        );
    }
}

const styles = {
    footerContainer: {
        height: height/12,
        backgroundColor: '#2c3e50',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:5,
        paddingBottom: 5,
    },
    footerTitleStyle: {
        color: '#ecf0f1',
        fontSize: 20
    }
}
export default AppFooter;