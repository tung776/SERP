import React, { Component } from 'react';
import {View, Text} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Card, CardSection, Button } from './commons';

class Dashboard extends Component {
    state = {  }
    render() {
        console.log("dashboard")
        return (
            <View style={styles.container}>
                
                <Text>Dashboard</Text>
                <Text>Dashboard</Text>
                <Text>Dashboard</Text>
                <Text>Dashboard</Text>
            </View>
        );
    }
}
const styles = {
    container: {
        flex: 1,
        backgroundColor: 'red',
    }
};
export default Dashboard;