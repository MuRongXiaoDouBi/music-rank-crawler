/*
 * @Author: MuRong
 * @Date: 2020-02-24 21:06:40
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-24 21:10:47
 * @Description: 工具函数
 * @FilePath: \node-crawler\src\utils.ts
 */
export function s_to_hs(s: any) {
  //计算分钟
  //算法：将秒数除以60，然后下舍入，既得到分钟数
  let h: any;
  h = Math.floor(s / 60);
  //计算秒
  //算法：取得秒%60的余数，既得到秒数
  s = s % 60;
  //将变量转换为字符串
  h = String(h);
  s = String(s);
  //如果只有一位数，前面增加一个0
  h = h.length == 1 ? "0" + h : h;
  s = s.length == 1 ? "0" + s : s;
  return h + ":" + s;
}
