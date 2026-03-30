import axios from 'axios';

const BASE = 'http://localhost:8080/api';
axios.defaults.withCredentials = true;

// attach token to every request automatically
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('email');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export const registerSendOtp = (data) => axios.post(`${BASE}/auth/register/send-otp`, data);
export const registerVerifyOtp = (data) => axios.post(`${BASE}/auth/register/verify-otp`, data);
export const loginSendOtp = (data) => axios.post(`${BASE}/auth/login/send-otp`, data);
export const loginVerifyOtp = (data) => axios.post(`${BASE}/auth/login/verify-otp`, data);
export const logout = () => axios.post(`${BASE}/auth/logout`);
export const getIncidents = () => axios.get(`${BASE}/incidents`);
export const getUptime = (id) => axios.get(`${BASE}/endpoints/${id}/uptime`);
export const getEndpoints = () => axios.get(`${BASE}/endpoints`);
export const addEndpoint = (data) => axios.post(`${BASE}/endpoints`, data);
export const deleteEndpoint = (id) => axios.delete(`${BASE}/endpoints/${id}`);
export const toggleEndpoint = (id) => axios.patch(`${BASE}/endpoints/${id}/toggle`);
export const getHistory = (id) => axios.get(`${BASE}/endpoints/${id}/history`);
export const joinWaitlist = () => axios.post(`${BASE}/waitlist`);