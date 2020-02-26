/*
 * @Author: MuRong
 * @Date: 2020-02-24 18:32:21
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-25 18:19:33
 * @Description:
 * @FilePath: \node-crawler\src\excepthin.ts
 */

export interface Exception {
  code?: number;
  msg?: any;
  body?: any;
}
export class HttpException extends Error {
  /**
   * http 状态码
   */
  public code: number = 500;

  /**
   * 返回的信息内容
   */
  public msg: any = "服务器未知错误";

  public body = null;
  /**
   * 构造函数
   * @param ex 可选参数，通过{}的形式传入
   */
  constructor(ex?: Exception) {
    super();
    if (ex && ex.code) {
      this.code = ex.code;
    }
    if (ex && ex.msg) {
      this.msg = ex.msg;
    }
    this.body = ex?.body;
  }
}
/**
 * 成功
 */
export class Success extends HttpException {
  public code = 200;
  public msg = "成功";
  public errorCode = 0;
  constructor(ex?: Exception) {
    super(ex);
  }
}
/**
 * 失败
 */
export class Failed extends HttpException {
  public code = 400;
  public msg = "失败";
  public errorCode = 9999;

  constructor(ex?: Exception) {
    super(ex);
  }
}
