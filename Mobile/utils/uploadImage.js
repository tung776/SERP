import axios from 'axios';
import { ImagePicker } from 'expo';
import { AsyncStorage } from 'react-native';


export const uploadImageAsync = async (uri, apiUrl) => {

    const uriParts = uri.split('.');

    const fileType = uriParts[uriParts.length - 1];

    const formData = new FormData();
    formData.append('photo', {
        uri,
        name: `photo.${fileType}`,
        filename: `photo.${fileType}`,
        type: `image/${fileType}`
    });

    const token = await AsyncStorage.getItem('jwtToken')
    const options = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    };

    return axios.post(apiUrl, formData, options);
}

export const takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: flase,        
        base64: true
    });

    return pickerResult;
}


export const takeImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false
    });

    return pickerResult;
}