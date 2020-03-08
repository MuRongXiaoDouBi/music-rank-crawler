/*
 * @Author: MuRong
 * @Date: 2020-02-24 19:06:53
 * @LastEditors: MuRong
 * @LastEditTime: 2020-03-08 19:25:54
 * @Description:
 * @FilePath: \music-rank-crawler\server\src\crawler\kuwo.ts
 */
import BaseCrawler from "./base";
import JieBa from "nodejieba";

import {
  typeResultInterface,
  typeListInterface,
  routerSongsRequestInterface
} from "../interface";
import { Success, Failed } from "../excepthin";
import { songsResultInterface } from "../interface";

const headers = {
  csrf: "G3UO2NPMVEDE",
  Cookie:
    "_ga=GA1.2.1128737581.1577963223; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1582525661; _gid=GA1.2.279739541.1582525661; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1582544843; _gat=1; kw_token=G3UO2NPMVEDE"
};

class KuWoCrawler extends BaseCrawler {
  SongsUrl: string = "http://www.kuwo.cn/api/www/bang/bang/musicList";
  RankUrl: string = "http://www.kuwo.cn/api/www/bang/bang/bangMenu";
  constructor() {
    super();
  }

  /**
   * 获取酷我音乐排行榜详情
   *
   * @returns
   * @memberof KuWoCrawler
   */
  async getRankingList() {
    const { code, data, message } = await this.getJson(
      this.RankUrl,
      {},
      headers
    );
    let result: typeResultInterface[] = [];
    if (code === 200) {
      data.forEach((items: any) => {
        let list: typeListInterface[] = [];
        items.list.forEach((item: any) => {
          list.push({
            bangId: Number(item.sourceid),
            title: item.name
          });
        });
        result.push({
          title: items.name,
          list
        });
      });
      return new Success({ body: result });
    } else {
      return new Failed({ msg: message });
    }
  }

  /**
   *
   * 获取酷我指定歌曲列表
   * 默认返回100条
   *
   * @param {routerSongsRequestInterface} [params]
   * @returns
   * @memberof KuWoCrawler
   */
  async getSongsList(params?: routerSongsRequestInterface) {
    const { data, code, message } = await this.getJson(
      this.SongsUrl,
      {
        bangId: params?.id || 93,
        pn: params?.page || 1,
        rn: params?.num || 100
      },
      headers
    );
    if (code === 200) {
      const total: number = Number(data.num);
      let names: string = "";
      let result: songsResultInterface = data.musicList.map(
        (item: any, index: number) => {
          const songTime = item.songTimeMinutes;
          const id = item.rid;
          const imgUrl = item.pic;
          const name = item.name;
          names += name;
          const singerName = item.artist.split("&").join("/");
          const rank = index + 1;
          const url = `http://www.kuwo.cn/play_detail/${item.rid}`;
          return {
            songTime,
            id,
            imgUrl,
            singerName,
            name,
            rank,
            url
          };
        }
      );
      return new Success({
        body: Object.assign(
          { result },
          { total },
          { words: JieBa.extract(names, 100) }
        )
      });
    } else {
      return new Failed({ msg: message });
    }
  }
}

export default KuWoCrawler;
