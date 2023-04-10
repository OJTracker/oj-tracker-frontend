import axios from "axios";

const uvaApi = axios.create({
  baseURL: process.env.REACT_APP_UVA_API_URL,
});

export { uvaApi };
