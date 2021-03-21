import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hooks.zapier.com'
});

export default api;