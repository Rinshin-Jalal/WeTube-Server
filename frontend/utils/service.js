import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:6521",
});

// instance.interceptors.request.use(
//   (config) => {
//     if (!config.headers.Authorization) {
//       const token = JSON.parse(localStorage.getItem("keyCloak")).token;

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default instance;
