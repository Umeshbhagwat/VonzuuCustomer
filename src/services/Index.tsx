import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class APIService {
  static apiCustomHeader(headers: any) {
    return axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
      headers: headers,
    });
  }

  static async api(isFile = false) {
    const jwtToken = await AsyncStorage.getItem('token');
    const api = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
      headers: {
        'Content-Type': isFile ? 'multipart/form-data' : 'application/json',
        Authorization: 'Bearer ' + jwtToken,
      },
    });
    api.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            // Handle unauthorized or forbidden access
            // For example, navigate to login screen in your React Native app
            return Promise.reject(err);
          } else {
            return Promise.reject(err.response.data);
          }
        }
        return Promise.reject(err);
      },
    );
    return api;
  }

  static apiNoAuth() {
    return axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
