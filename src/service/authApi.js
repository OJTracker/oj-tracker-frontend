import axios from "axios";

const authApi = axios.create({
  baseURL: process.env.REACT_APP_AUTH_API_URL,
});

export { authApi };
