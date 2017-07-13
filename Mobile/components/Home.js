import React, { Component } from 'react';
import TabNavigator from 'react-native-tab-navigator';
import { Text, View} from 'react-native';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Header from './commons/Header';

class Main extends Component {
    state = {
        selectedTab: 'Dashboard'
    }
    
    render() {
        const { container, headerStyle } = styles;
        return (
            <View style={container}>
                <Header/>
                <TabNavigator
                    style = {{flex: 1}}
                >
                    <TabNavigator.Item
                        style = {{flex: 1}}
                        selected={this.state.selectedTab === 'Dashboard'}
                        title="Dashboard"
                        onPress={() => this.setState({ selectedTab: 'Dashboard' })}>
                        <Dashboard />
                    </TabNavigator.Item>
                    <TabNavigator.Item
                        selected={this.state.selectedTab === 'Profile'}
                        title="Profile"
                        onPress={() => this.setState({ selectedTab: 'Profile' })}>
                        <Profile />
                    </TabNavigator.Item>
                </TabNavigator>
            </View>
        );
    }
}



const styles = {
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'transparent',
    }
};

export default Main;