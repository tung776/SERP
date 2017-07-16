import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
class Splash extends Component {
    state = { }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer} >
                    <Image
                    style={styles.logoStyle}
                        source={require('../../Shared/images/Logo.png')} 
                    />
                </View>
                <View>
                    <Text style={styles.subTitleStyle} >Son Cat Tuong ERP</Text>
                </View>
            </View>
        );
    }
}

const styles = {
    container: {
        backgroundColor: '#1abc9c',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    logoStyle: {
        width: 210,
        height: 115,
        opacity: 0.7,
    },
    subTitleStyle: {
        fontSize: 16,
        fontWeight: '200',
        marginBottom: 20,
        color: 'rgba(255,255,255, 0.6)',
    }
};

export default Splash;
