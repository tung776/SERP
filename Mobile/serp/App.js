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

