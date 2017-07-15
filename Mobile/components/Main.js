import React, { Component } from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import { View, Text, Image, TouchableOpacity, Button, Clipboard, Share, StyleSheet, ActivityIndicator } from 'react-native';
// import { Card, CardSection, Button } from './commons';
import { Actions } from 'react-native-router-flux';
import Header from './commons/Header';
import Footer from './commons/Footer';
import { ImagePicker, Constants } from 'expo';
import {URL} from '../../env';
const apiUrl = URL+"/api/users/upload";
import { AsyncStorage } from 'react-native';

class Home extends Component {
    state = {
        uploading: false,
        image: null
    }
    uploadImageAsync = async (uri) => {
        console.log("uri =", uri);
        console.log("apiURL = ", URL+"/api/users/upload");
        console.log("begin upload!!!");

        const uriParts = uri.split('.');
        console.log("uriParts= ", uriParts)
        console.log("length = ", uriParts[uriParts.length-1]);
        const fileType = uriParts[uriParts.length - 1];
        console.log("filetype = ", fileType);
        const formData = new FormData();
        formData.append('photo', {
            uri,
            name: `photo.${fileType}`,
            filename: `photo.${fileType}`,
            type: `image/${fileType}`,
            data: uri
        });
        console.log("formData ", formData);
        const token = await AsyncStorage.getItem('jwtToken')
        const options = {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        };
        console.log("begin fetch");

        return fetch(apiUrl, options);
    }
    _pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false
        });

        await this._handleImagePicked(pickerResult);
    }

    _handleImagePicked = async (pickerResult) => {
        let uploadResponse, uploadResult;

        try {
            this.setState({ uploading: true});

            if (!pickerResult.cancelled) {
                uploadResponse = await this.uploadImageAsync(pickerResult.uri);
                console.log({ uploadResponse });
                uploadResult = await uploadResponse.json();
                this.setState({ image: uploadResult.location });
            }
        } catch (e) {
            console.log({ uploadResponse });
            console.log({ uploadResult });
            console.log({ e });
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }
    }

    _takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });

        this._handleImagePicked(pickerResult);
    }    

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
                        title="Chọn ảnh tải lên"
                        onPress={this._pickImage}
                    />
                    {image &&
                        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                </View>
                <View>
                    {this._maybeRenderImage()}
                    {this._maybeRenderUploadingOverlay()}
                </View>
                <Footer />
            </View>
        );
    }

    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }]}>
                    <ActivityIndicator
                        color="#fff"
                        animating
                        size="large"
                    />
                </View>
            );
        }
    }

    _maybeRenderImage = () => {
        let { image } = this.state;
        if (!image) {
            return;
        }

        return (
            <View style={{
                marginTop: 30,
                width: 250,
                borderRadius: 3,
                elevation: 2,
                shadowColor: 'rgba(0,0,0,1)',
                shadowOpacity: 0.2,
                shadowOffset: { width: 4, height: 4 },
                shadowRadius: 5,
            }}>
                <View style={{ borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden' }}>
                    <Image
                        source={{ uri: image }}
                        style={{ width: 250, height: 250 }}
                    />
                </View>

                <Text
                    onPress={this._copyToClipboard}
                    onLongPress={this._share}
                    style={{ paddingVertical: 10, paddingHorizontal: 10 }}>
                    {image}
                </Text>
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
