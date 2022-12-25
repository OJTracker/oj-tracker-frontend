import React from "react";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Stats from "./pages/Stats";

const Routes = () => {
  return (
    <Router>
      <Route path="/" exact component={Stats}/>
    </Router>
  )
}

export default Routes;
