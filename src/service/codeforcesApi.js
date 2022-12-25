import axios from "axios";

const codeforcesApi = axios.create({
  baseURL: "https://oj-tracker-codeforces-api.herokuapp.com",
});

export { codeforcesApi };