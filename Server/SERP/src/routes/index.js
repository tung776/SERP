import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Main from '../components/Main';
import Home from '../components/Home';
import Signup from '../components/Signup';
import Login from '../components/Login';
const Routes = (
        <Router history = {browserHistory}>
            <Route path = "/" component = {Main}>
                <IndexRoute component = { Home } />
                <Route path = "signup" component = { Signup } />
                <Route path = "login" component = { Login } />
            </Route>
        </Router>
);

export default Routes;