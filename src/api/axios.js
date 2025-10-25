import axios from 'axios';
import useAuthStore from '@/store/authStore';
const api = axios.create({ baseURL: '/api' });
api.interceptors.request.use((config)=>{ const { accessToken } = useAuthStore.getState(); if(accessToken){ config.headers = config.headers||{}; config.headers['Authorization'] = `Bearer ${accessToken}`;} return config;});
export default api;
