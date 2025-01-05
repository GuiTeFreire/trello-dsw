import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4331',
});

export default api;
