/*
 * @Author: MuRong
 * @Date: 2020-02-25 18:55:43
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-25 19:18:01
 * @Description: Axios封装
 * @FilePath: \vue-music-rank\src\request.ts
 */
import axios, { AxiosResponse } from "axios";
import { Message } from "element-ui";
const instance = axios.create({
  baseURL: "/api",
  timeout: 10000
});
instance.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return new Promise((resolve, reject) => {
      if (response.status === 200) {
        if (response.data.code === 200) {
          resolve(response.data.body);
        } else {
          reject(response.data);
          Message.error(response.data.msg);
        }
      } else {
        reject(response.data);
        Message.error(response.statusText);
      }
    });
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default instance;
