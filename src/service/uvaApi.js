import axios from "axios";

const uvaApi = axios.create({
  baseURL: "https://oj-tracker-uva-api.herokuapp.com",
});

export { uvaApi };