import axios from "axios";

const codechefApi = axios.create({
  baseURL: process.env.REACT_APP_CODECHEF_API_URL,
});

export { codechefApi };
