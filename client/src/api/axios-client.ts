import axios, { Axios } from "axios";
import { CONFIGS } from "../common/configs";
import { store } from "../store";
import queryString from "querystring";
import { storage } from "../storage/storage";
import { authSlice } from "../store/auth-slice";

export const axiosClient = new Axios({
  ...axios.defaults,
  baseURL: CONFIGS.API_HOST + "api",
  headers: {},
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use((req) => {
  const updatePostRequest = () => {
    if (!(req.data instanceof FormData)) return;
    if (req.headers["Content-Type"]) return;
    req.headers["content-type"] = "application/x-www-form-urlencoded";
  };
  // ----------------------------------------------
  updatePostRequest();
  return req;
});

axiosClient.interceptors.request.use((request) => {
  request.headers.Authorization = store.getState().auth.user?.token;
  return request;
});

axiosClient.interceptors.response.use(
  (resp) => resp.data,
  (resp) => {
    if (resp.response?.status === 401) {
      storage.auth.clear();
      store.dispatch(authSlice.actions.logout());
      throw new AuthError();
    }
    if (resp?.data) throw resp.data;
    if (resp?.response?.data) throw resp.response.data;
    throw new NetworkError();
  }
);

export const getDetailRespError = (respError) => {
  return respError as NetworkError & AuthError;
};

// ----------------------------------------------
// Errors
class NetworkError {
  message = "Network error!";
  network = true;
}
class AuthError {
  message = "Unauthorized!";
  unauthorized = true;
}
