import React, { Component } from 'react';
import { Text , View} from 'react-native';

class Profile extends Component {
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
        backgroundColor: 'blue',
    }
};
export default Profile;