<!--
 * @Author: MuRong
 * @Date: 2020-02-25 18:29:11
 * @LastEditors: MuRong
 * @LastEditTime: 2020-02-25 21:03:39
 * @Description: 
 * @FilePath: \vue-music-rank\src\App.vue
 -->
<template>
  <div class="home">
    <el-container>
      <el-header>
        <el-tabs v-model="activeName" @tab-click="handleClickTab">
          <el-tab-pane
            :label="nav.title"
            :name="String(nav.type)"
            v-for="nav in tabList"
            :key="nav.type"
          >
            <el-container>
              <el-aside width="300px">
                <el-menu v-if="navList">
                  <el-submenu
                    :index="String(index)"
                    v-for="(nav, index) in navList"
                    :key="nav.type"
                  >
                    <template slot="title">
                      <span slot="title">{{ nav.title }}</span>
                    </template>
                    <el-menu-item
                      :index="String(child.bangId)"
                      v-for="child in nav.list"
                      :key="child.bangId"
                      @click="handleClickNav(child)"
                      >{{ child.title }}
                    </el-menu-item>
                  </el-submenu>
                </el-menu>
              </el-aside>
              <el-main>
                <el-table
                  :data="tableData"
                  stripe
                  style="width: 100%"
                  v-loading.body="tableLoading"
                >
                  <el-table-column prop="rank" label="排名" align="center">
                    <template slot-scope="scope">
                      <span
                        class="rank-text"
                        :class="{
                          'rank-first': scope.row.rank === 1,
                          'rank-second': scope.row.rank === 2,
                          'rank-third': scope.row.rank === 3
                        }"
                        >{{ scope.row.rank }}</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="imgUrl"
                    label="歌曲缩略图"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-image
                        :src="scope.row.imgUrl"
                        style="width: 40px;height: 40px;"
                      ></el-image>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="歌曲名称" align="center">
                    <template slot-scope="scope">
                      <el-link type="primary" :href="scope.row.url">{{ scope.row.name }}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="singerName"
                    label="歌手姓名"
                    align="center"
                  ></el-table-column>
                  <el-table-column
                    prop="songTime"
                    label="歌曲时间"
                    align="center"
                  ></el-table-column>
                </el-table>
              </el-main>
            </el-container>
          </el-tab-pane>
        </el-tabs>
      </el-header>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import request from "./request";
interface params {
  type: any;
  num: any;
  id: any;
  page: any;
}
@Component
export default class App extends Vue {
  tabList: any = [];
  navList: any = [];
  activeName: string = "0";
  tableData: any = [];
  tableLoading: boolean = true;
  params: params = {
    type: undefined,
    num: undefined,
    id: undefined,
    page: undefined
  };
  resetParams() {
    this.params = {
      type: undefined,
      num: undefined,
      id: undefined,
      page: undefined
    };
  }
  handleClickNav(nav: any) {
    this.params.id = nav.bangId;
    this.getSongsList();
  }
  handleClickTab(tab: any, event: any) {
    this.resetParams()
    const type = Number(tab.name);
    this.params.type = type;
    this.getRankingList(type);
    this.getSongsList();
  }
  async getVenderList() {
    const res = await request("/vender");
    this.tabList = res;
  }
  async getRankingList(type?: number) {
    const res = await request("/getRankingList", {
      params: {
        type
      }
    });
    this.navList = res;
  }
  async getSongsList() {
    this.tableLoading = true;
    let res: any;
    res = await request("/getSongsList", {
      params: this.params
    });
    this.tableLoading = false;
    this.tableData = res.result;
  }
  created() {
    this.getVenderList();
    this.getRankingList();
    this.getSongsList();
  }
}
</script>

<style>
.home {
  padding: 30px 50px;
}
.el-tabs__nav-scroll {
  line-height: 80px;
}
.rank-text {
  width: 40px;
  top: 2px;
  left: 0;
  text-align: right;
  font-size: 24px;
  color: #333;
}
.rank-first {
  color: #ff4422;
}
.rank-second {
  color: #ff4222;
}
.rank-third {
  color: #ff2222;
}
</style>
