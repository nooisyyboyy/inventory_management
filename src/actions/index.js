import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});

API.interceptors.response.use(
  function (response) {
    console.log({ response }, "");
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    console.log({ error }, "error");
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response.status === 401) {
      localStorage.removeItem("toekn");
      localStorage.removeItem("name");
      location.replace(`/?message=Session Expired Please Login Again`);
    }
    return Promise.reject(error);
  }
);

export default API;

export const handleLogout = (err) => {
  console.log(err);
};
