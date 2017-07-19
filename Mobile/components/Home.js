import React from 'react';
import TabNavigator from 'react-native-tab-navigator';
import { Text, View, Image } from 'react-native';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Header from './commons/Header';
import { addNoteIcon } from '../../Shared/images/index';
class Main extends React.Component {
    state = {
        selectedTab: 'Hoa_Don'
    }

    render() {
        const { container } = styles;
        return (
            <View style={container}>
                <Header>
                    <Text style={styles.headerTitle}>Home</Text>
                </Header>
                <View style={styles.contentContainer}>
                    <TabNavigator>
                        <TabNavigator.Item
                            tabStyle={styles.tabStyle}
                            titleStyle={styles.titleStyle}
                            renderIcon={() => <Image style={{ width: 20, height: 20 }} source={addNoteIcon} />}
                            selected={this.state.selectedTab === 'Hoa_Don'}
                            title="Hóa Đơn"
                            onPress={() => this.setState({ selectedTab: 'Hoa_Don' })}
                        >
                            <Dashboard />
                        </TabNavigator.Item>
                        <TabNavigator.Item
                            tabStyle={styles.tabStyle}
                            titleStyle={styles.titleStyle}
                            selected={this.state.selectedTab === 'Profile'}
                            title="Profile"
                            onPress={() => this.setState({ selectedTab: 'Profile' })}
                        >
                            <Profile />
                        </TabNavigator.Item>
                    </TabNavigator>
                </View>
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
    },
    TabNavigatorStyles: {
        backgroundColor: 'blue'
    },
    tabStyle: {
        backgroundColor: '#34495e',
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: 16
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF'
    },
    contentContainer: {
        flex: 12,
        backgroundColor: '#bdc3c7'
    },
};

export default Main;
