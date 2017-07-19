import React from 'react';
// import { Container,Icon, Button,Content, Title, FooterTab, Text, Header, Body, Footer, Right, Left} from 'native-base';
import { View, Text, Image, Button, StyleSheet, ActivityIndicator } from 'react-native';
// import { Card, CardSection, Button } from './commons';
// import { Actions } from 'react-native-router-flux';
import Header from './commons/Header';
import Footer from './commons/Footer';

import { takeImage, uploadImageAsync } from '../utils/uploadImage';
import { URL } from '../../env';

class Home React.Component {
    state = {
        uploading: false,
        image: null,
        imageUrl: null
    }


    handleImagePicked = async () => {
        // let uploadResponse, uploadResult;
        
        try {
            const pickerResult = await takeImage();

            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                const apiUrl = `${URL}/api/users/upload`;
                
                uploadImageAsync(pickerResult.uri, apiUrl).then(
                    res => {
                        const url = URL + res.data.url;
                        this.setState({ imageUrl: url });
                    }
                );
            }
        } catch (e) {
            alert('Tải ảnh lên máy chủ thất bại');
        } finally {
            this.setState({ uploading: false });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header>
                    <Text style={styles.headerTitle}>SERP</Text>
                </Header>
                <View style={styles.contentContainer}>
                    <Text>
                        This is Content Section
                    </Text>
                    
                    <Button
                        title="Chọn ảnh tải lên"
                        onPress={this.handleImagePicked}
                    />
                    {
                        this.state.imageUrl &&
                        <Image style={{ width: 200, height: 200 }} source={{ uri: this.state.imageUrl }} />
                    }
                </View>


                <Footer />
            </View>
        );
    }
    // <View>
    //     {this._maybeRenderImage()}
    //     {this._maybeRenderUploadingOverlay()}
    // </View>
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
        const { image } = this.state;
        if (!image) {
            return;
        }
        return (
            <View
                style={{
                marginTop: 30,
                width: 250,
                borderRadius: 3,
                elevation: 2,
                shadowColor: 'rgba(0,0,0,1)',
                shadowOpacity: 0.2,
                shadowOffset: { width: 4, height: 4 },
                shadowRadius: 5,
            }}
            >
                <View style={{ borderTopRightRadius: 3, borderTopLeftRadius: 3, overflow: 'hidden' }}>
                    <Image
                        source={{ uri: image }}
                        style={{ width: 250, height: 250 }}
                    />
                </View>

                <Text
                    onPress={this._copyToClipboard}
                    onLongPress={this._share}
                    style={{ paddingVertical: 10, paddingHorizontal: 10 }}
                >
                    {image}
                </Text>
            </View>
        );
    }


}

const styles = {
    container: {
        flex: 1,
        // alignItems: 'center',
        // backgroundColor: 'rgb(253,253,253)',
    },
    holder: {
        // flex: 0.25,
        // justifyContent: 'center',
    },
    text: {
        // fontSize: 32,
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
};

export default Home;
