import React, { Component } from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import { View, Text, Image } from 'react-native';
// import { Card, CardSection, Button } from './commons';
import { Actions } from 'react-native-router-flux';
import logo from '../../Shared/images/Logo.png';
// import settingImage from '../../Shared/images/icons/if_setting_46837.png';
class Home extends Component {
    state = {}
    onActionSelected = (position) => {
        if (position === 0) { // index of 'Settings'
            showSettings();
        }
    }
    render() {
        return (
            <View style = {styles.container}>
                <View style = {styles.headerContainer}>
                    <Image style = {styles.logoStyle} source = {require('../../Shared/images/Logo.png')} />
                    <Text>SERP</Text>
                    <Image style = {styles.logoStyle} source = {require('../../Shared/images/icons/setting.png')} />
                </View>
                <View>
                    <Text>
                        This is Content Section
                    </Text>

                </View>
                <View>

                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        // alignItems: 'space-between'
    },
    logoStyle: {
        width: 58,
        height: 30,
        padding: 5
    }
}

export default Home;


                        // <Button transparent onPress={() => {
                        // Actions.refresh({ key: 'drawer', open: value => !value });
                        // }}>
                        //     Menu
                        // </Button>