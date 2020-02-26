/*
 * @Author: MuRong
 * @Date: 2020-02-25 19:00:26
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-25 19:07:13
 * @Description: vue config
 * @FilePath: \vue-music-rank\vue.config.js
 */

module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3002",
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }
  }
};
