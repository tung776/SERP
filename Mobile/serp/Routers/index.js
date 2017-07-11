import React, { Component } from 'react';
import {Scene, Router, Actions} from 'react-native-router-flux';
import LoginForm from '../components/LoginForm';
import Home from '../components/Home';

const RouterComponent = ()=> {
    return (
        <Router hideNavBar= "true" sceneStyle = {{ paddingTop: 55 }} >
            <Scene key = "main">
                <Scene key = "home" component = {Home} title = "Home"  initial={true}/>
            </Scene>
            <Scene key = "auth">
                <Scene key = "login" component = {LoginForm} title = "Please login" />
            </Scene>
            
        </Router>
    );
};

export default RouterComponent