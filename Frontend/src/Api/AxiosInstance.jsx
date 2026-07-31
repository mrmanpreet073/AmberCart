import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://ambercart.onrender.com/api",
  withCredentials: true, // sends the httpOnly refresh cookie automatically on every request
});

// Attach access token to every outgoing request
AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired access tokens automatically
let isRefreshing = false;
let requestQueue = []; // holds requests that arrived while refresh is in-flight

const processQueue = (error, newToken = null) => {
  requestQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(newToken);
  });
  requestQueue = [];
};

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401s, and only retry once per request
    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        // A refresh is already happening — queue this request until it finishes
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return AxiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // const { data } = await AxiosInstance.post("/user/refresh");
        const refreshToken = localStorage.getItem("refreshToken");

        const { data } = await AxiosInstance.post("/user/refresh", {
          refreshToken,
        });
        const newAccessToken = data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        AxiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return AxiosInstance(originalRequest); // retry the original failed request
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        //  localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // refresh failed too → force re-login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;