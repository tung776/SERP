/**
 * Sample React Native App
 * https://github.com/tung776/SERP
 */
import 'whatwg-fetch';
import type, { StackFrame } from 'parseErrorStack';
import React, { Component } from 'react';
import {
  View, Text,
  StatusBar,
  Navigator
} from 'react-native';
import { Router } from 'react-native-router-flux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk'
import reduxLogger from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import Routers from './Mobile/Routers';
import Reducers from './Mobile/Reducers';
// import Expo from 'expo';
// import {Spinner} from './Mobile/components/commons/Spinner';
import { AsyncStorage } from 'react-native';
import { setAuthorizationToken } from './Shared/utils/setAuthorizationToken';
import { SetCurrentUser } from './Shared/actions/authCommon';
import jwt from 'jwt-decode';
import { AppBody, AppHeader, AppFooter } from './Mobile/components/commons';
// import { FontAwesome } from "@expo/vector-icons";
// import CustomComponents from 'react-native-deprecated-custom-components';
import Splash from './Mobile/components/Splash';

StatusBar.setHidden(true);

// function cacheImages(images) {
//   return images.map(image => {
//     if (typeof image === 'string') {
//       return Image.prefetch(image);
//     } else {
//       return Expo.Asset.fromModule(image).downloadAsync();
//     }
//   });
// }

// function cacheFonts(fonts) {
//   return fonts.map(font => Expo.Font.loadAsync(font));
// }


export default class serp extends Component {
  state = { appIsReady: false }

  // async _loadAssetsAsync() {
  //   const imageAssets = cacheImages([
  //     require('./Shared/images/Logo.png')
  //   ]);

    // const fontAssets = cacheFonts([
    //   FontAwesome.font,
    // ]);

  //   await Promise.all([
  //     ...imageAssets,
  //     // ...fontAssets,
  //   ]);

  //   this.setState({appIsReady: true});
  // }

  componentWillMount() {
    this.setState({appIsReady: true});
  }

  render() {
    const store = createStore(Reducers, compose(
      applyMiddleware(ReduxThunk, reduxLogger)));
    AsyncStorage.getItem('jwtToken').then(
      token => {
        if (token) {
          console.log("token = ", token)
          setAuthorizationToken(token);
          store.dispatch(SetCurrentUser(jwt(token)));
        }
      }
    )

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
    //Tạm thời Navigator bị ngừng hỗ trợ nên tạm cài đặt CustomComponents
    // return (
    //   <Provider store = { store }>
    //     <CustomComponents.Navigator
    //       initialRoute = {{ name: 'MAIN' }}
    //       renderScene = { (route, navigator) => {
    //         switch(route.name) {
    //           case 'MAIN': return <Main />
    //           default: return <Main />
    //         }
    //       } }
    //     />
    //   </Provider>
    // );
  }
}

