import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';

import store from './store';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './index.css';

import App from "./App";
import PrivateRoute from "./PrivateRoute";
import Private from "./pages/Private";
import Login from "./pages/Login";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/recommendation" component={App} />
        <PrivateRoute exact path="/private" component={Private} />
        <Route exact path="/login" component={Login} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root')
);
