/*
 * @Author: MuRong
 * @Date: 2020-02-24 17:41:52
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-25 21:00:20
 * @Description: 全局路由
 * @FilePath: \node-crawler\src\routers.ts
 */
import Router from "koa-router";
import QqCrawler from "./crawler/qq";
import { routerSongsRequestInterface } from "./interface";
import { CrawlerSite } from "./enum";
import KuWoCrawler from "./crawler/kuwo";
import WangyiCrawler from "./crawler/163";
import { Success } from "./excepthin";

const router: Router = new Router();
router.prefix("/api");

const qqCrawler = new QqCrawler();
const kuWoCrawler = new KuWoCrawler();
const wangyiCrawler = new WangyiCrawler();

router.get('/vender', async ctx=> {
  const result = [{
    title: 'QQ音乐',
    type: CrawlerSite.QQ
  }, {
    title: '网易云音乐',
    type: CrawlerSite.WY
  }, {
    title: '酷我音乐',
    type: CrawlerSite.KUWO
  }]
  ctx.body =  new Success({ body: result });
})

router.get("/getRankingList", async ctx => {
  const type: number | undefined = Number(ctx.request.query.type) || 0;
  let result: any = undefined;
  switch (type) {
    case CrawlerSite.QQ:
      result = await qqCrawler.getRankingList();
      break;
    case CrawlerSite.KUWO:
      result = await kuWoCrawler.getRankingList();
      break;
    case CrawlerSite.WY:
      result = await wangyiCrawler.getRankingList();
      break;
    default:
      break;
  }
  ctx.body = result;
});

router.get("/getSongsList", async ctx => {
  const query: routerSongsRequestInterface = ctx.request.query;
  const type: number | undefined = Number(ctx.request.query.type) || 0;
  const params: routerSongsRequestInterface = {
    num: query.num ? Number(query.num) : undefined,
    id: query.id ? Number(query.id) : undefined,
    page: query.page ? Number(query.page) : undefined
  };
  let result: any = undefined;
  switch (type) {
    case CrawlerSite.QQ:
      result = await qqCrawler.getSongsList(params);
      break;
    case CrawlerSite.KUWO:
      result = await kuWoCrawler.getSongsList(params);
      break;
    case CrawlerSite.WY:
      result = await wangyiCrawler.getSongsList(params.id);
    default:
      break;
  }
  ctx.body = result;
});

export default router;
