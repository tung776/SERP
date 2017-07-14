import React, { Component } from 'react';
import {Scene, Router, Actions} from 'react-native-router-flux';
import LoginForm from '../components/LoginForm';
import Home from '../components/Home';
import ChangeInfor from '../components/ChangeInfor';
import Main from '../components/Main';
import Authentication from '../components/Authentication';
import OrderHistory from '../components/OrderHistory';
import NavigationDrawer from '../components/commons/NavigationDrawer';
import {connect} from 'react-redux';
import Splash from '../components/Splash';
import requireAuth from '../utils/requireAuth';

const RouterComponent = ()=> {
    return (
        <Router hideNavBar= "true" sceneStyle={{backgroundColor:'#F7F7F7'}} >

            <Scene key="drawer" component={requireAuth(NavigationDrawer)} open={false} >
            
                <Scene key = "main" 
                    unmountScenes
                    animation = 'fade'
                >
                    <Scene key = "Main" component = {requireAuth(Main)} title = "Main"  />
                    <Scene key = "Home" component = {Home} title = "Home"  />
                    <Scene key = "ChangeInfor" component = {ChangeInfor} title = "ChangeInfor"  />
                    <Scene key = "Authentication" component = {Authentication} title = "Authentication"  />
                    <Scene key = "OrderHistory" component = {OrderHistory} title = "OrderHistory"  />
                </Scene>
            </Scene>
             <Scene key = "auth">
                <Scene key = "login" component = {LoginForm} title = "Please login" initial={true} />
            </Scene>

            <Scene key = "splash" component = {Splash} />
            
        
        </Router>
    );
};

export default RouterComponent