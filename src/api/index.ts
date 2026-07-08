import axios from 'axios';
import type { AxiosResponse } from 'axios';

declare module 'axios' {
  interface AxiosInstance {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  }
}

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
});

request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    ElMessage.error('无法连接至服务器，请检查网络连接。');
    return Promise.reject(error);
  }
);

export default request;
