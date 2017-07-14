import React, { Component } from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import { View, Text, Image, TouchableOpacity, Button } from 'react-native';
// import { Card, CardSection, Button } from './commons';
import { Actions } from 'react-native-router-flux';
import Header from './commons/Header';
import Footer from './commons/Footer';
import { ImagePicker } from 'expo';
// var ImagePicker = require('react-native-image-picker');
// import RNFetchBlob from 'react-native-fetch-blob';

var options = {
    title: 'Select Avatar',
    customButtons: [
        { name: 'fb', title: 'Choose Photo from Facebook' },
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};

class Home extends Component {
    state = {
        avatarSource: null,
        image: null
    }
    // show() {
    //     ImagePicker.showImagePicker(options, (response) => {
    //         console.log('Response = ', response);

    //         if (response.didCancel) {
    //             console.log('User cancelled image picker');
    //         }
    //         else if (response.error) {
    //             console.log('ImagePicker Error: ', response.error);
    //         }
    //         else if (response.customButton) {
    //             console.log('User tapped custom button: ', response.customButton);
    //         }
    //         else {
    //             let source = { uri: response.uri };

    //             // You can also display the image using data: 
    //             // let source = { uri: 'data:image/jpeg;base64,' + response.data }; 

    //             this.setState({
    //                 avatarSource: source
    //             });
    //         }
    //     });
    // }
    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync();

        console.log(result);

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };
    render() {
        const renderImage = (this.state.avatarSource === null) ? null :
            <Image
                source={this.state.avatarSource}
                style={{ width: 100, height: 100 }}
            />
        let { image } = this.state;
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headerTitle}>SERP</Text>
                </Header>
                <View style={styles.contentContainer}>
                    <Text>
                        This is Content Section
                    </Text>
                    <TouchableOpacity  >
                        <Text>upload image</Text>
                    </TouchableOpacity>
                    <Button
                        title="Pick an image from camera roll"
                        onPress={this._pickImage}
                    />
                    {image &&
                        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                </View>
                <View>
                    {renderImage}
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
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF'
    }
}

export default Home;
