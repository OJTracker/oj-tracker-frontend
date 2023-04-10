import axios from "axios";

const atcoderApi = axios.create({
  baseURL: process.env.REACT_APP_ATCODER_API_URL,
});

export { atcoderApi };
