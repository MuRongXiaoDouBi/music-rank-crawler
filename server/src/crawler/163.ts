/*
 * @Author: MuRong
 * @Date: 2020-02-25 16:15:49
 * @LastEditors: MuRong
 * @LastEditTime: 2020-03-08 19:24:59
 * @Description:
 * @FilePath: \music-rank-crawler\server\src\crawler\163.ts
 */
import BaseCrawler from "./base";
import JieBa from 'nodejieba'

import {
  typeResultInterface,
  typeListInterface,
  routerSongsRequestInterface,
  songsResultInterface
} from "../interface";
import cheerio from "cheerio";
import { Success, Failed } from "../excepthin";
import { s_to_hs } from "../utils";
class WangyiCrawler extends BaseCrawler {
  BaseUrl: string = "https://music.163.com/discover/toplist";
  constructor() {
    super();
  }

  /**
   * 获取网易云音乐榜单列表
   *
   * @returns
   * @memberof WangyiCrawler
   */
  async getRankingList() {
    try {
      const dom = await this.getDom(this.BaseUrl);
      const $: CheerioStatic = cheerio.load(dom);
      const toplist = $("#toplist .n-minelst");
      let result: typeResultInterface[] = [];
      const el = $(toplist);
      const titles: string[] = [];
      const lists: typeListInterface[][] = [];
      el.find(".f-ff1").map((index: number, element: CheerioElement) => {
        titles.push($(element).text());
      });
      el.find("ul.f-cb").map((index: number, element: CheerioElement) => {
        const el: Cheerio = $(element);
        let list: typeListInterface[] = [];
        el.find("li.mine").map((index: number, element: CheerioElement) => {
          const el = $(element);
          const title: string = el.find(".s-fc0").text();
          const bangId: number = Number(
            el
              .find(".s-fc0")
              .attr("href")
              ?.split("?id=")[1]
          );
          list.push({
            bangId,
            title
          });
        });
        lists.push(list);
      });
      titles.forEach((item: any, index: number) => {
        result.push({
          title: item,
          list: lists[index]
        });
      });
      return new Success({ body: result });
    } catch (error) {
      return new Failed({ body: error });
    }
  }

  /**
   * 获取网易云音乐榜单歌曲列表
   *
   * @returns
   * @memberof WangyiCrawler
   */
  async getSongsList(id?: number) {
    const url = id === undefined ? this.BaseUrl : `${this.BaseUrl}?id=${id}`;
    try {
      const dom = await this.getDom(url);
      const $: CheerioStatic = cheerio.load(dom);
      const songList = JSON.parse($("textarea#song-list-pre-data").text());
      let names: string = "";
      let result: songsResultInterface[] = songList.map(
        (item: any, index: number) => {
          const songTime = s_to_hs(Math.floor(item.duration / 1000));
          const id = item.id;
          const imgUrl = item.album.picUrl;
          const name = item.album.name;
          names += name;
          const singerName = item.artists
            .map((singer: any) => {
              return singer.name;
            })
            .join("/");
          const rank = index + 1;
          const url = `https://music.163.com/#/song?id=${item.id}`;
          return { id, name, songTime, imgUrl, singerName, rank, url };
        }
      );
      return new Success({
        body: Object.assign(
          { result },
          { total: result.length },
          { words: JieBa.extract(names, 100) }
        )
      });
    } catch (error) {
      return new Failed({ body: error });
    }
  }
}
export default WangyiCrawler;
