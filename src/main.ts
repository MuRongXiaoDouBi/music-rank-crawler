/*
 * @Author: MuRong
 * @Date: 2020-02-25 18:29:11
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-25 18:54:08
 * @Description: 
 * @FilePath: \vue-music-rank\src\main.ts
 */
import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  render: h => h(App)
}).$mount('#app')
