import React from 'react';
import {View, Text} from 'react-native';
import { Actions } from 'react-native-router-flux';
// import { Card, CardSection, Button } from './commons';

class CommingSoon extends React.Component {
    state = {  }
    render() {
        return (
            <View style={styles.container}>
                
                <Text>Comming Soon</Text>
            </View>
        );
    }
}
const styles = {
    container: {
        flex: 1,
        backgroundColor: '#bdc3c7',
    }
};
export default CommingSoon;