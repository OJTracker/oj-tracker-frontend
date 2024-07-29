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
      <Route path="/ojtracker" exact component={Stats}/>
      <Route path="/ojtracker/stats" exact component={Stats}/>
      <Route path="/ojtracker/recommendation" exact component={Recommendation}/>
      <Route path="/ojtracker/curated-lists" exact component={CuratedLists}/>
      <Route path="/ojtracker/curated-list/:id" component={CuratedList}/>
      <Route path="/ojtracker/user-management" component={UserManagement}/>
      <Route exact path="/ojtracker/coaching" component={Coaching}/>
      <Route exact path="/ojtracker/coaching/:id" component={Coaching}/>
      <Route exact path="/ojtracker/coaching/:id/training/:index" component={Coaching}/>
      <Route exact path="/ojtracker/coaching/:id/training/:index/:successCode" component={Coaching}/>
    </Router>
  )
}

export default Routes;
