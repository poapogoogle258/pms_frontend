import axios from "axios";

axios.defaults.withCredentials = true

export default axios.create({
  baseURL: "http://10.201.30.27/pms/backend",
  headers: {
    "Content-type": "application/json",
  }
});