import axios from "axios";

const codeforcesApi = axios.create({
  baseURL: process.env.REACT_APP_CODEFORCES_API_URL,
});

export { codeforcesApi };
