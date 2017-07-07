/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Expo from 'expo';
import { Container, Content, Icon } from 'native-base';

export default class serp extends Component {
    async componentWillMount() {
        await Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
    }

  render() {
      const {containerStyles} = styles;
    return (
      <Container style = {containerStyles}>
        <Content>
          <Icon name='home' />
          <Icon ios='ios-menu' android="md-menu" style={{fontSize: 20, color: 'red'}}/>
        </Content>
      </Container>
    );
  }
}

const styles = {
    containerStyles: {
        marginTop: 20
    },
 
};
