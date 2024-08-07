import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';

import store from './store';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import './index.css';

import PrivateRoute from "./PrivateRoute";

import App from "./App";
import Login from "./pages/Login";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00a6eb',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#db7734',
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
     <ThemeProvider theme={theme}>
        <Router basename="/ojtracker">
          <Switch>
          <PrivateRoute exact path="/" component={App} />
          <PrivateRoute exact path="/stats" component={App} />
          <PrivateRoute exact path="/recommendation" component={App} />
          <PrivateRoute exact path="/curated-lists" component={App} />
          <PrivateRoute exact={false} path="/curated-list/:id" component={App} />
          <PrivateRoute exact path="/user-management" component={App} />
          <PrivateRoute exact path="/coaching" component={App} />
          <PrivateRoute exact path="/coaching/:id" component={App} />
          <PrivateRoute exact path="/coaching/:id/training/:index" component={App} />
          <PrivateRoute exact path="/coaching/:id/training/:index/:successCode" component={App} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup"><Login signup={true}/></Route>
        </Switch>
      </Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);
