import React, { Component } from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import {View, Text, Dimensions} from 'react-native';
import {Button} from './index';
import { Actions } from 'react-native-router-flux';

class AppHeader extends Component {
    state = {  }
    render() {
        const {headerStyle} = styles;
        return (
            <View style = {styles.headerContainer}>
                    <TouchableOpacity onPress={() => {
                        Actions.refresh({ key: 'drawer', open: value => !value });
                        }}>
                        <Image style = {styles.logoStyle} source = {require('../../Shared/images/Logo.png')} />
                    </TouchableOpacity>
                    <Text style = {styles.headerTitle} >SERP</Text>
                    <Image style = {styles.settingIcon} source = {require('../../Shared/images/icons/setting.png')} />
                </View>
        );
    }
}
const { height } = Dimensions.get('window');
const styles = {
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop:5,
        paddingBottom: 5
    },
    logoStyle: {
        width: 40,
        height: 21,
        padding: 5
    },
    settingIcon: {
        width: 30,
        height: 30,
        padding: 5
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF'
    }
}
export default AppHeader;