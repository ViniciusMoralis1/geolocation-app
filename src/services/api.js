import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hooks.zapier.com/hooks/catch/09rj5z/'
});

export default api;