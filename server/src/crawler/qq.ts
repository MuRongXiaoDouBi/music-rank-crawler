/*
 * @Author: MuRong
 * @Date: 2020-02-24 14:46:56
 * @LastEditors: MuRong
 * @LastEditTime: 2020-03-07 20:39:51
 * @Description: QQ音乐类
 * @FilePath: \music-rank-crawler\server\src\crawler\qq.ts
 */
import BaseCrawler from "./base";
import cheerio from "cheerio";
import JieBa from 'nodejieba'
import {
  typeResultInterface,
  typeListInterface,
  songsResultInterface,
  routerSongsRequestInterface
} from "../interface";
import { Success, Failed } from "../excepthin";
import { s_to_hs } from "../utils";

const requestParams = (param: {
  topId: number;
  offset: number;
  num: number;
}) => {
  return {
    format: "json",
    inCharset: "utf8",
    outCharset: "utf-8",
    notice: 0,
    needNewCode: 0,
    data: {
      detail: {
        module: "musicToplist.ToplistInfoServer",
        method: "GetDetail",
        param
      }
    }
  };
};

class QqCrawler extends BaseCrawler {
  BaseUrl: string = "https://y.qq.com";
  RankUrl: string = "/n/yqq/toplist/62.html#stat=y_new.toplist.menu.62";
  RequestUrl: string = "https://u.y.qq.com/cgi-bin/musicu.fcg";
  constructor() {
    super();
  }

  /**
   * 爬取QQ音乐排行榜详情
   *
   * @returns
   * @memberof QqCrawler
   */
  async getRankingList() {
    try {
      const dom = await this.getDom(this.BaseUrl + this.RankUrl);
      const $: CheerioStatic = cheerio.load(dom);
      const main: Cheerio = $(".main .toplist_nav .toplist_nav__list");
      let result: typeResultInterface[] = [];
      main.map((index: number, element: CheerioElement) => {
        const el: Cheerio = $(element);
        const key: string = el.find(".toplist_nav__tit").text();
        const items: Cheerio = el.find(".toplist_nav__item");
        let list: typeListInterface[] = [];
        items.map((index: number, element: CheerioElement) => {
          const el: Cheerio = $(element).find("a");
          let bangId: number | undefined = Number(
            el
              .attr("href")
              ?.split(".")
              .pop()
          );
          let title: string = el.text();
          if (title !== "MV榜") {
            list.push({
              bangId,
              title
            });
          }
        });
        result.push({
          title: key,
          list
        });
      });
      return new Success({ body: result });
    } catch (error) {
      return new Failed({ body: error });
    }
  }

  /**
   *
   * 获取指定歌曲列表
   * 默认返回100条
   *
   * @param {routerSongsRequestInterface} [param]
   * @returns
   * @memberof QqCrawler
   */
  async getSongsList(param?: routerSongsRequestInterface) {
    const { detail, code } = await this.getJson(
      this.RequestUrl,
      requestParams({
        topId: param?.id || 62,
        offset: param?.page || 0,
        num: param?.num || 100
      })
    );
    if (code === 0) {
      let data = detail.data.songInfoList;
      const total = detail.data.data.totalNum;
      let names: string = '';
      let result: songsResultInterface[] = data.map(
        (item: any, index: number) => {
          const songTime = s_to_hs(item.interval);
          const id = item.id;
          const imgUrl = `http://y.gtimg.cn/music/photo_new/T002R90x90M000${item.album.mid}.jpg`;
          const name = item.title;
          names += name
          const singerName = item.singer
            .map((singer: any) => {
              return singer.name;
            })
            .join("/");
          const rank = index + 1;
          const url = `https://y.qq.com/n/yqq/song/${item.mid}.html`;
          return {
            songTime,
            id,
            imgUrl,
            name,
            singerName,
            rank,
            url
          };
        }
      );
      return new Success({
        body: Object.assign({ result }, { total }, { words: JieBa.extract(names, 100) })
      });
    } else {
      return new Failed({ msg: "获取QQ音乐歌曲列表错误" });
    }
  }
}
export default QqCrawler;
