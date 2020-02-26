/*
 * @Author: MuRong
 * @Date: 2020-02-24 14:12:04
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-25 15:50:49
 * @Description: 
 * @FilePath: \node-crawler\src\app.ts
 */
import koa from 'koa'
import router from './routers'

const app = new koa()
app.use(router.routes())
app.listen(3002)

console.log('Service started successfully Port:3000')