import { CrawlerSite } from "./enum";

/*
 * @Author: MuRong
 * @Date: 2020-02-24 14:39:28
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-25 16:10:50
 * @Description: 所有interface
 * @FilePath: \node-crawler\src\interface.ts
 */
export interface siteInterface {
  qq: string;
  wangyi: string;
  sing: string;
  kuwo: string;
}

/**
 * 统一返回排行榜类型接口
 *
 * @export
 * @interface typeResultInterface
 */
export interface typeResultInterface {
  title: string;
  list: typeListInterface[];
}

export interface typeListInterface {
  bangId?: number;
  title: string;
}

/**
 * 统一歌曲列表接口
 *
 * @export
 * @interface songsResultInterface
 */
export interface songsResultInterface {
  // 排名
  rank: number,
  // 缩略图
  imgUrl: string,
  // 歌曲名字
  name: string,
  // 歌手名字
  singerName: string,
  // 歌曲时间
  songTime: string,
  // 歌曲url
  url: string
  id: number | string
}

export interface routerSongsRequestInterface {
  page?: number,
  num?: number,
  id?: number
}