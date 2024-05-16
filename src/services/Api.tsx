import axios, { AxiosResponse } from "axios";
import * as logger from "../utils/logger";
import { BASE_URL } from "@env";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // Adjust the timeout as needed (in milliseconds)
  headers: {
    "Content-Type": "application/json",
    // Add other headers as needed
  },
});

// const instanceTwo = axios.create({
//   baseURL: process.env.BASE_URL_TWO,
//   timeout: 5000, // Adjust the timeout as needed (in milliseconds)
//   headers: {
//     'Content-Type': 'application/json',
//     // Add other headers as needed
//   },
// });

const Api = {
  fetchEndpointData: async (endpoint: string): Promise<AxiosResponse<any>> => {
    try {
      const apiUrl = `${instance.getUri()}${endpoint}`;
      logger.debug("Calling GET method :: ", apiUrl);
      const response = await instance.get(endpoint);
      // logger.debug("Response ", JSON.stringify(response));
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  postEndpointData: async (
    endpoint: string,
    data: any
  ): Promise<AxiosResponse<any>> => {
    try {
      const apiUrl = `${instance.getUri()}${endpoint}`;
      logger.debug('Call POST method :: ', apiUrl);
      // logger.debug(JSON.stringify(data));

      const response = await instance.post(endpoint, data);
      // logger.debug("Responce ", JSON.stringify(response));
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  putEndpointData: async (
    endpoint: string,
    data: any
  ): Promise<AxiosResponse<any>> => {
    try {
      const apiUrl = `${instance.getUri()}${endpoint}`;
      logger.debug('Calling POST method ::', apiUrl);
      // logger.debug(JSON.stringify(data));
      const response = await instance.put(endpoint, data);
      // logger.log("Responce ", JSON.stringify(response));
      return response;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  },

  deleteEndpointData: async (
    endpoint: string,
    data: any
  ): Promise<AxiosResponse<any>> => {
    try {
      const response = await instance.delete(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // postEndpointDataTwo: async (endpoint: string, data: any): Promise<AxiosResponse<any>> => {
  //   try {
  //     const apiUrl = `${instanceTwo.getUri()}${endpoint}`;
  //     console.log("####",apiUrl);
  //     const response = await instanceTwo.post(endpoint, data);

  //     return response;
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
  //       // Handle timeout error
  //       console.error('Request timed out:', error);
  //     } else {
  //       throw error;
  //     }
  //   }
  // },
};

export default Api;