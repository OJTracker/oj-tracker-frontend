import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';

import store from './store';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './index.css';

import PrivateRoute from "./PrivateRoute";

import App from "./App";
import Login from "./pages/Login";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <PrivateRoute exact path="/" component={App} />
        <PrivateRoute exact path="/stats" component={App} />
        <PrivateRoute exact path="/recommendation" component={App} />
        <PrivateRoute exact path="/curated-lists" component={App} />
        <PrivateRoute exact={false} path="/curated-list/:id" component={App} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
