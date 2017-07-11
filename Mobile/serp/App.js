/**
 * Sample React Native App
 * https://github.com/tung776/SERP
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import {Router} from 'react-native-router-flux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk'
import reduxLogger from 'redux-logger';
import { createStore,  applyMiddleware, compose } from 'redux';
import Routers from './Routers';
import Reducers from './Reducers';
import Expo from 'expo';
import {Spinner} from 'native-base';
import {AsyncStorage} from 'react-native';
import setAuthorizationToken from './utils/setAuthorizationToken';
import { SetCurrentUser } from './actions/AuthActions';
import jwt from 'jwt-decode';

export default class serp extends Component {
  state = { loadingFont: false  }

     async componentWillMount() {
        this.setState({ loadingFont: true});
        await Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
        this.setState({ loadingFont: false});
    }
    render() {
      const store = createStore(Reducers, compose(
        applyMiddleware(ReduxThunk, reduxLogger)));
        AsyncStorage.getItem('jwtToken').then(
          token=> {
            if(token) {
              console.log("token = ", token)
              setAuthorizationToken(token);
              store.dispatch(SetCurrentUser( jwt( token )));
            }
          }
        )
        
        if(this.state.loadingFont) {
            return (
                <Spinner></Spinner>
            );
        }
        return (
          <Provider store = { store }>
            <Routers />
          </Provider>
        );
    }
}

