import React from "react";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import Recommendation from "./pages/Recommendation";
import Stats from "./pages/Stats";
import CuratedLists from "./pages/CuratedLists";
import CuratedList from "./pages/CuratedList";

const Routes = () => {
  return (
    <Router>
      <Route path="/" exact component={Stats}/>
      <Route path="/stats" exact component={Stats}/>
      <Route path="/recommendation" exact component={Recommendation}/>
      <Route path="/curated-lists" exact component={CuratedLists}/>
      <Route path="/curated-list/:id" component={CuratedList}/>
    </Router>
  )
}

export default Routes;
