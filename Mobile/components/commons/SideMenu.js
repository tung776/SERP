import React, { Component } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { Actions } from 'react-native-router-flux'
import { Card, CardSection, Button } from './index';

class SideMenu extends Component {
    state = {  }
    render() {
        const {containerStyle, textMenuStyle} = styles;
        return (
            <Card style = {containerStyle}>
                <CardSection></CardSection>
                <CardSection>
                    <Button
                        onPress={() => {
                            Actions.auth();
                        }}>
                        <Text>Đăng Nhập</Text>
                    </Button>
                    <Button
                        onPress={() => {
                            Actions.Home();
                        }}>
                        <Text>Main</Text>
                    </Button>
                </CardSection>
            </Card>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textMenuStyle: {
        fontSize: 16,
        color: 'white'
    }
}

export default SideMenu;