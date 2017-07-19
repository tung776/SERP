import React, { Component } from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Button } from './index';
import { Actions } from 'react-native-router-flux';

class AppHeader React.Component {
    state = {}
    render() {
        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => {
                    Actions.refresh({ key: 'drawer', open: value => !value });
                }}
                >
                    <Image style={styles.logoStyle} source={ require('../../../Shared/images/Logo.png')} />
                </TouchableOpacity>
                {this.props.children}
                <Image style={styles.settingIcon} source={ require('../../../Shared/images/icons/setting.png')} />
            </View>
        );
    }
}
const { height } = Dimensions.get('window').height;
const styles = {
    headerContainer: {
        height: height / 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
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
    }
};
export default AppHeader;
