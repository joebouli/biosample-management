import axios from 'axios';
import config from './config';

const apiClient = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
});

export default apiClient;
