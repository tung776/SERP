/**
 * Sample React Native App
 * https://github.com/tung776/SERP
 */
import React, { Component } from 'react';
import {
  StatusBar,
  Image
} from 'react-native';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import Routers from './Mobile/Routers';
import Reducers from './Mobile/Reducers';
import Expo from 'expo';
// import {Spinner} from './Mobile/components/commons/Spinner';
import { AsyncStorage } from 'react-native';
import { setAuthorizationToken } from './Shared/utils/setAuthorizationToken';
import { SetCurrentUser } from './Shared/actions/authCommon';
import jwt from 'jwt-decode';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
// import CustomComponents from 'react-native-deprecated-custom-components';
import Splash from './Mobile/components/Splash';

console.log("__DEV__ = ", __DEV__);
StatusBar.setHidden(true);
__DEV__ = false;

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }
    return Expo.Asset.fromModule(image).downloadAsync();
  });
}

function cacheFonts(fonts) {
  return fonts.map(font => Expo.Font.loadAsync(font));
}
let store;
if (__DEV__) {
  store = createStore(Reducers, compose(
    applyMiddleware(ReduxThunk, reduxLogger)));
} else {
  store = createStore(Reducers, compose(
  applyMiddleware(ReduxThunk)));
}


export default class serp extends Component {
  state = { appIsReady: false }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    });

    const imageAssets = cacheImages([
      require('./Shared/images/Logo.png')
    ]);

    const fontAssets = cacheFonts([
      FontAwesome.font,
      Ionicons.font
    ]);

    await Promise.all([
      ...imageAssets,
      ...fontAssets,
    ]);

    const token = await AsyncStorage.getItem('jwtToken');

    if (token) {
      setAuthorizationToken(token);
      store.dispatch(SetCurrentUser(jwt(token)));
    }

    this.setState({ appIsReady: true });
  }

  render() {
    if (!this.state.appIsReady) {
      return (
        <Splash />
      );
    }

    return (
      <Provider store={store}>
        <Routers />
      </Provider>
    );
  }
}

