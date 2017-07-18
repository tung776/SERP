import React, { Component } from 'react';
import { Text , View} from 'react-native';

class Profile extends React.Component {
    state = {  }
    render() {
        return (
            <View style={styles.container}>
                <Text>Profile</Text>
                <Text>Profile</Text>
                <Text>Profile</Text>
                <Text>Profile</Text>
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
export default Profile;