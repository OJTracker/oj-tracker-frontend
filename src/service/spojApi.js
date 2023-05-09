import axios from "axios";

const spojApi = axios.create({
  baseURL: process.env.REACT_APP_SPOJ_API_URL,
});

export { spojApi };
