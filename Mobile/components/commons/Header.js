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
            <View style = {headerStyle}>                    
                <Button transparent onPress={() => {
                    Actions.refresh({ key: 'drawer', open: value => !value });
                    }}>
                    <Text>Menu</Text>
                </Button>                    
                <Text>Header</Text>
            </View>
        );
    }
}
const { height } = Dimensions.get('window');
const styles = {
    headerStyle: {
        height: height/10
    }
}
export default AppHeader;