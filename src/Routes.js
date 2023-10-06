import React from "react";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import Recommendation from "./pages/Recommendation";
import Stats from "./pages/Stats";

const Routes = () => {
  return (
    <Router>
      <Route path="/" exact component={Stats}/>
      <Route path="/recommendation" exact component={Recommendation}/>
    </Router>
  )
}

export default Routes;
