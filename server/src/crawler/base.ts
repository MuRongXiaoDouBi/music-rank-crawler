/*
 * @Author: MuRong
 * @Date: 2020-02-24 14:48:52
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-25 16:18:13
 * @Description: 爬虫基类
 * @FilePath: \node-crawler\src\crawler\base.ts
 */
import axios from "axios";
import { Failed } from "../excepthin";

const headers = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
};
class BaseCrawler {
  async getDom(url: string) {
    const res = await axios(url, {
      method: "GET",
      headers
    });
    if (res.status === 200) {
      return res.data;
    }
  }
  async getJson(url: string, params?: object, customHeader?:object) {
    const res = await axios(url, {
      params,
      method: "GET",
      headers: customHeader || headers
    });
    if (res.status === 200) {
      return res.data;
    } else {
      return new Failed({ msg: res.statusText });
    }
  }
}
export default BaseCrawler;
