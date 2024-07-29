import { jwtDecode } from 'jwt-decode';

const isAuth = () => {
    const token = localStorage.getItem("tk");
    if (token === null) return false;

    const decodedToken = jwtDecode(token);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp > currentTime) {
        return true;
    } else {
        return false;
    }
}

const isSpecialUser = () => {
    const token = localStorage.getItem("tk");
    if (token === null) return false;

    const decodedToken = jwtDecode(token);
    if (["ADMIN", "COACH"].includes(decodedToken.groups[0])){
        return true;
    } else {
        return false;
    }
}

const isAdmin = () => {
    const token = localStorage.getItem("tk");
    if (token === null) return false;

    const decodedToken = jwtDecode(token);
    if (["ADMIN"].includes(decodedToken.groups[0])) {
        return true;
    } else {
        return false;
    }
}

const getUsername = () => {
    const token = localStorage.getItem("tk");
    if (token === null) window.location = "/ojtracker";

    const decodedToken = jwtDecode(token);
    return decodedToken.upn;
}

const getSubject = () => {
    const token = localStorage.getItem("tk");
    if (token === null) window.location = "/ojtracker";

    const decodedToken = jwtDecode(token);
    return decodedToken.sub;
}

const getUserRole = () => {
    const token = localStorage.getItem("tk");
    if (token === null) window.location = "/ojtracker";

    const decodedToken = jwtDecode(token);
    return decodedToken.groups[0];
}

const canAct = (author) => {
    const token = localStorage.getItem("tk");
    if (token === null) window.location = "/ojtracker";

    const decodedToken = jwtDecode(token);
    if (["ADMIN"].includes(decodedToken.groups[0])){
        return true;
    } else if (["COACH"].includes(decodedToken.groups[0]) && author === decodedToken.upn) {
        return true;
    } else {
        return false;
    }
}

export { isAuth, isSpecialUser, getUserRole, getUsername, canAct, isAdmin, getSubject };
