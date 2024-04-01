import { Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import PropTypes from "prop-types";

import { isAuth, isSpecialUser } from "./utils/auth";
import { clearAcceptedSubmissions } from "./utils/acceptedSubmissions";

import { handleActions } from "./store/handles";
import { userActions } from "./store/user";

const PrivateRoute = ({ component, exact, path }) => {
    const dispatch = useDispatch();

    if (isAuth()) {
        if (isSpecialUser() && path === "/") {
            window.location = "/curated-lists";
            return;
        }

        return (
            <Route exact={exact} path={path} component={component} />
        );
    }

    localStorage.removeItem("tk");

    clearAcceptedSubmissions();

    dispatch(handleActions.clearHandles());
    dispatch(userActions.clearUserInfo());

    window.location = "/login";
};

PrivateRoute.propTypes = {
    component: PropTypes.any.isRequired,
    exact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired
}

export default PrivateRoute;
