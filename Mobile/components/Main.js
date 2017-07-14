import React, { Component } from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import { View, Text, Image, TouchableOpacity } from 'react-native';
// import { Card, CardSection, Button } from './commons';
import { Actions } from 'react-native-router-flux';
// import logo from '../../Shared/images/Logo.png';
// import settingImage from '../../Shared/images/icons/if_setting_46837.png';
import Header from './commons/Header';
import Footer from './commons/Footer';
class Home extends Component {
    state = {}
    
    render() {
        return (
            <View style = {styles.container}>
                <Header />
                <View style = {styles.contentContainer}>
                    <Text>
                        This is Content Section
                    </Text>

                </View>
                <Footer />
            </View>
        );
    }
}

const styles = {
    container: {
        flex: 1
    },
    contentContainer: {
        flex: 12,
        backgroundColor: '#bdc3c7'
    }    
}

export default Home;
