import axios from "axios";

const atcoderApi = axios.create({
  baseURL: "https://oj-tracker-atcoder-api.herokuapp.com",
});

export { atcoderApi };