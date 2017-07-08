import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Main from '../components/Main';
import Home from '../components/Home';
import Signup from '../components/Signup';

const Routes = (
        <Router history = {browserHistory}>
            <Route path = "/" component = {Main}>
                <IndexRoute component = { Home } />
                <Route path = "signup" component = { Signup } />
            </Route>
        </Router>
);

export default Routes;