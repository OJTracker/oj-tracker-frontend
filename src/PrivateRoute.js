import { Route } from "react-router-dom";

import PropTypes from "prop-types";

import isAuth from "./utils/auth";

const PrivateRoute = ({ component, exact, path }) => {
    if (isAuth()) {
        return (
            <Route exact={exact} path={path}>
                {component}
            </Route>
        );
    }

    localStorage.removeItem("tk");
    window.location = "/login";
};

PrivateRoute.propTypes = {
    component: PropTypes.any.isRequired,
    exact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired
}

export default PrivateRoute;
