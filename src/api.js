import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,     

});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.method === 'post') {
    console.log("🟣 POST request to:", config.url);
    console.log("🟣 Body:", config.data);
  }
  return config;
});




export default api;
