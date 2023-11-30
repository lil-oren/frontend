import CONSTANTS from '@/constants/constants';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: CONSTANTS.BASEURL,
  withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${CONSTANTS.BASEURL}/auth/refresh-token`,
      null,
      { withCredentials: true },
    );
    return response;
  } catch (error: any) {
    return error;
  }
};

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const refreshReponse = await refreshAccessToken();
        if (
          refreshReponse &&
          refreshReponse.response &&
          refreshReponse.response.data &&
          refreshReponse.response.data.message &&
          refreshReponse.response.data.message === CONSTANTS.ALREADY_LOGGED_OUT
        ) {
          return Promise.reject(CONSTANTS.ALREADY_LOGGED_OUT);
        }
        return axiosInstance(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    } else {
      return Promise.reject(JSON.parse(err.request.response));
    }
  },
);

export default axiosInstance;
