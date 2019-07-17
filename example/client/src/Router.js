/**
 * @file 路由
 * @author yangxiaoxu@baiu.com
 */

import React from 'react';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';

import RouteList from './configure/routes';

export default () => (
    <HashRouter>
        <Switch>
            {
                RouteList.map((route, index) => <Route key={route.path} component={route.component} />)
            }
            <Route><Redirect to="/index" /></Route>
        </Switch>
    </HashRouter>
);
