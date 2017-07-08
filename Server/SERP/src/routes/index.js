import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import Main from '../components/Main';
const Routes = (
        <Router history = {browserHistory}>
            <Route path = "/" component = {Main}>
            </Route>
        </Router>
);

export default Routes;