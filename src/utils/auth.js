import jwt_decode from 'jwt-decode';

const isAuth = () => {
    const token = localStorage.getItem("tk");
    const decodedToken = jwt_decode(token);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp > currentTime) {
        return true;
    } else {
        return false;
    }
}

export default isAuth;
