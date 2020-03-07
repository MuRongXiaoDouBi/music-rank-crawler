/*
 * @Author: MuRong
 * @Date: 2020-02-24 14:12:04
 * @LastEditors: MuRong
 * @LastEditTime: 2020-03-07 19:07:02
 * @Description: 
 * @FilePath: \music-rank-crawler\server\src\app.ts
 */
import koa from 'koa'
import router from './routers'

const app = new koa()
app.use(router.routes())
const port = 3002
app.listen(port)

console.log(`Service started successfully Port:${port}`)