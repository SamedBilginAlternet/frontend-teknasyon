import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.20.43:8083/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
