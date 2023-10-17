import axios from 'axios';
import config2 from '../settings/config';

export const API_URL = config2?.ApiUrl;
export const RefreshUrl = config2?.RefreshUrl;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})


$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$api.interceptors.response.use((config) => {
    return config;
},async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get(`${API_URL}${RefreshUrl}`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken);
            return $api.request(originalRequest);
        } catch (e) {
            // localStorage.removeItem('token')
            console.log('НЕ АВТОРИЗОВАН')
        }
    }
    throw error;
})

export default $api;
