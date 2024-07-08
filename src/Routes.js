import React from "react";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import Recommendation from "./pages/Recommendation";
import Stats from "./pages/Stats";
import CuratedLists from "./pages/CuratedLists";
import CuratedList from "./pages/CuratedList";
import UserManagement from "./pages/UserManagement";
import Coaching from "./pages/Coaching";

const Routes = () => {
  return (
    <Router>
      <Route path="/" exact component={Stats}/>
      <Route path="/stats" exact component={Stats}/>
      <Route path="/recommendation" exact component={Recommendation}/>
      <Route path="/curated-lists" exact component={CuratedLists}/>
      <Route path="/curated-list/:id" component={CuratedList}/>
      <Route path="/user-management" component={UserManagement}/>
      <Route exact path="/coaching" component={Coaching}/>
      <Route exact path="/coaching/:id" component={Coaching}/>
      <Route exact path="/coaching/:id/training/:index" component={Coaching}/>
      <Route exact path="/coaching/:id/training/:index/:successCode" component={Coaching}/>
    </Router>
  )
}

export default Routes;
