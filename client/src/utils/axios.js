import axios from 'axios';

// configure the base URL for axios requests
const api = axios.create({
    baseURL:'http://localhost:5000/api',
    headers:{
        'Content-Type':'application/json'
    }
})

// Interceptors to handle request globally (before request sent)
api.interceptors.request.use((config) => {
    // getting the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
})

export default api;