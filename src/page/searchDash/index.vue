<template>
  <div class="searchDash myMusic-container">
    <div style="height: auto; border-right: 1px solid #eee;border-left: 1px solid #eee;" class="container-content">
      <div class="content-left">
        <div style="height: auto">
          <div style="margin: 10px 0" class="search-header">
            <div style="margin-top: 15px;">
              <el-input placeholder="请输入内容" v-model="searchContent" class=" input-with-select" style="width: 520px;"
                @keyup.enter.native="searchOutHanle();">
                <el-button slot="append" icon="el-icon-search" @click="searchOutHanle();"></el-button>
              </el-input>

              <div style="min-height: 200px;border: 1px solid #ccc" class="outcome" v-show="searchFlag">
                <div class="come sing">
                  <div class="left" style="width: 83px; border-right: 1px solid #ccc">
                    <span>单曲</span>
                  </div>
                  <div class="right">
                    <li v-for="item in searchSongs" :key="item.id" class="singOne"
                      style="list-style: none;padding: 5px 10px">
                      <span style="color: red" @click="gotoPlay(item.id);">{{
                        item.name
                      }}</span>-
                      <span v-for="s in item.artists" :key="s.id">
                        {{ s.name }}
                      </span>
                    </li>
                  </div>
                </div>

                <!---->
                <div class="come singer">
                  <div class="left" style="width: 83px; border-right: 1px solid #ccc">
                    <span>歌手</span>
                  </div>
                  <div class="right">
                    <p v-for="item in searchArtists" :key="item.id">
                      <span style="color: red">{{ item.name }}</span>
                    </p>
                  </div>
                </div>
                <div class=" come album">
                  <div class="left" style="width: 83px; border-right: 1px solid #ccc">
                    <span>专辑</span>
                  </div>
                  <div class="right">
                    <p v-for="item in searchAlbums" :key="item.id">
                      <span style="color: red">{{ item.name }}</span>- <span
                        style="color: red">{{ item.artist.name }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="searchKey">
            <h3 style="color: #fff">
              搜索<span style="color: red">{{ searchEnterData }}</span>,找到{{ searchOut.songCount }}的单曲
            </h3>
          </div>
          <div class="hr"></div>
        </div>
        <div class="optionsBar">
          <el-tabs type="border-card" @tab-click="optionsPan" v-model="activePan">
            <el-tab-pane label="单曲" name="1">
              <sing-box ref="singBox" :search-out="searchOut"></sing-box>
            </el-tab-pane>
            <el-tab-pane label="歌手" name="100">歌手</el-tab-pane>
            <el-tab-pane label="专辑" name="10">专辑</el-tab-pane>
            <el-tab-pane label="视频" name="1004">视频</el-tab-pane>
            <el-tab-pane label="歌词" name="1006">歌词</el-tab-pane>
            <el-tab-pane label="歌单" name="1000">歌单</el-tab-pane>
            <el-tab-pane label="主播电台" name="1014">主播电台</el-tab-pane>
            <el-tab-pane label="用户" name="1002">用户</el-tab-pane>
          </el-tabs>
        </div>
        <!-- 地下评论 -->
        <div>
          <div class="commentBox">
            <el-card class="box-card">
              <div class="pagination">
                <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
                  :page-sizes="[10, 20, 30, 40, 50]" @size-change="sizeChange" @next-click="nextClick"
                  @current-change="currentChange">
                </el-pagination>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "@/utils/request";
import { getEvent, getUserComment } from "@/api/getFrendEvent";
import { getPlayListDetail, getRelatedPlayList } from "@/api/getSongsSheet";
import { getSearchSug, getCloundSearch } from "@/api/searchApi";
import { mapState } from "vuex";
import SingBox from "./singBox";
export default {
  name: "singInfo",

  components: {
    SingBox
  },

  data () {
    return {
      index: "",
      flag: true,
      songsId: 0,

      total: 10,
      // 搜索文本；
      searchContent: "",
      searchSongs: [],
      searchAlbums: [],
      searchArtists: [],
      order: [],
      searchFlag: false,
      activePan: "1",
      searchEnterData: "",
      firstMount: false
    };
  },
  computed: {
    ...mapState({
      buttonIndex: state => state.myTest.playButtonIndex,
      playListId: state => state.myTest.playListId,
      searchOut: state => state.myTest.searchOutCome
    })
  },
  filters: {
    formatDate: function (time) {
      var now = new Date(time);
      var year = now.getFullYear(); //取得4位数的年份
      var month = now.getMonth() + 1; //取得日期中的月份，其中0表示1月，11表示12月
      var date = now.getDate(); //返回日期月份中的天数（1到31）
      var hour = now.getHours(); //返回日期中的小时数（0到23）
      var minute = now.getMinutes(); //返回日期中的分钟数（0到59）
      var second = now.getSeconds(); //返回日期中的秒数（0到59）
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    formMin: function (time) {
      var t = new Date(time);
      var m = t.getMinutes();
      var s = t.getSeconds();
      m = m > 9 ? m : "0" + m;
      s = s > 9 ? s : "0" + s;
      return m + ":" + s;
    }
  },
  mounted () {
    this.userImg = JSON.parse(sessionStorage.getItem("userImage")).userImage
    this.total = this.searchOut.songCount;
    this.songsId = this.playListId;
    this.searchEnterData = this.searchOut.keywords;
    this.searchContent = this.searchOut.keywords;
  },

  watch: {
    datalist: function () {
      this.index = "";
      this.flag = true;
    },
    $route: function (to, from) {
      console.log("路由变化了");
    },
    searchContent: function (newText, oldText) {
      this.getSearchContent(newText);
    }
  },

  methods: {
    sizeChange (page) {
      // console.log('data是什么', data)
      this.searchOutHanle(page);
    },
    nextClick (page) {
      this.searchOutHanle(page);
    },
    currentChange (p) {
      if (this.flag) {
        this.searchOutHanle(p);
      }
      this.flag = true;
    },
    playSong () { },
    submitMyComment () { },
    // 搜索结果处理
    searchOutHanle (offset = 30) {
      if (this.searchContent == "") {
        return;
      }
      // 搜索参数处理，默认搜索为单曲
      this.searchEnterData = this.searchContent;
      this.firstMount = true;

      const p = {
        keywords: this.searchContent,
        offset: offset
      };
      console.log("参数呢", p);

      getCloundSearch(p)
        .then(res => {
          this.$store.commit("changeSearchOutCome", res.data.result);
          console.log("数据", res.data);
          this.total = res.data.result.songCount;
          this.searchFlag = false;
        })
        .catch(err => {
          console.log(err);
          this.searchFlag = false;
        })
        .finally(e => {
          this.searchFlag = false;
        });
    },

    // 搜索方法start
    getSearchContent (text) {
      if (text == "") {
        this.searchFlag = false;
        return;
      }
      this.searchFlag = true;
      getSearchSug(text).then(res => {
        if (Object.keys(res.data.result).length == 0) {
          this.searchFlag = false;
          return;
        }
        // 保存数据
        console.log("搜索数据", res.data);
        this.searchSongs = res.data.result.songs;
        this.searchAlbums = res.data.result.albums;
        this.searchArtists = res.data.result.artists;
        this.order = res.data.result.order;
      });
    },

    gotoPlay (singId) {
      // console.log(this.$refs)
      // 调用子组件，去听歌
      this.$refs.singBox.gotoPlaySing(singId);
    },

    // 搜索部分
    optionsPan (tab, event) {
      console.log(tab);
      getCloundSearch(params);
    }
  },

  // 组件导航钩子
  beforeRouteEnter (to, from, next) {
    next(vm => {
      var preplayListId = vm.$store.state.myTest.prePlayListId;
      var curPlayListId = vm.$store.state.myTest.playListId;
      // 单曲播放得歌单和前一个歌单不一样，清楚播放记录按钮。
      if (preplayListId !== curPlayListId) {
        vm.$store.commit("changePlayButtonIndex", "");
      }
    });
  },
  beforeRouteLeave (to, from, next) {
    this.$store.commit("changePrePlayListId", this.songsId);
    next();
  }
};
</script>

<style scoped>
.myMusic-container {
  padding: 0 200px;
  height: auto;
  justify-content: space-between;
  min-width: 1420px;
  color: #1e131d;
  padding-bottom: 80px;
}
.searchDash{
  margin-top: 50px;
}
.coverImgurl {
  width: 50px;
  height: 50px;
}

.playListTitle {
  display: flex;
}
.con {
  margin-bottom: 15px;
}
.imagcover {
  margin-right: 15px;
}
.nametitle {
  font-size: 20px;
}

.hr {
  background-color: red;
  width: 100%;
  height: 3px;
}
.box-card {
  margin-bottom: 5px;
  background-color: #1e131d;
  color: #fff;
}
.commentBox {
  text-align: start;
}
.img {
  float: left;
  margin-right: 10px;
}
.pagination {
  float: right;
  padding-bottom: 20px;
}
.current {
  /* float: left; */
  color: red;
}
.container-content {
  display: flex;
}

.content-left {
  width: 100%;
  padding: 20px 15px;
  /* border-right: 1px solid #ccc; */
}
.singName:hover {
  text-decoration: underline;
}

.content-right {
  height: auto;
  width: 340px;
  padding: 0 20px;
}
.commentText {
  display: flex;
}
.my-comment {
  flex: 1;
}
.commentclick {
  margin-left: 5px;
  margin-top: 15px;
}
.anwser {
  float: right;
}
.el-button--goon.is-active,
.el-button--goon:active {
  background: #20b2aa;
  border-color: #20b2aa;
  color: #fff;
}
.el-table__body tr.hover-row > td {
  background-color: #333 !important;
}
.el-button--goon {
  background: red;
  border-color: #48d1cc;
  color: #fff;
}
.relatedS:hover {
  text-decoration: underline;
  cursor: pointer;
}

/* 动态样式start */
.event-header {
  display: flex;
  justify-content: space-between;
}
.showImgBox {
  display: flex;
  flex-wrap: wrap;
}
.imgbox {
  margin-right: 10px;
}

.optionsBar {
  min-width: 900px;
}

.el-tabs__item {
  padding: 0 55px !important;
}

/* 搜索框start */
.search-header {
  display: flex;
  justify-content: center;
}
.outcome {
  width: 520px;
  /* position: absolute; */
  background-color: #fff;
}
.come {
  display: flex;
  height: auto;
  border-bottom: 1px solid #ccc;
}
.right,
.left {
  margin-left: 5px;
  cursor: pointer;
}

.left {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
}
.singOne :hover {
  text-decoration: underline;
  background-color: skyblue;
}
.singOne {
  width: 100%;
  height: auto;
}

/* 搜索结果面板 */
.singBox {
  display: flex;
  justify-content: space-between;
  height: 50px;
  border-bottom: 1px solid red;
  margin-bottom: 10px;
  line-height: 50px;
  cursor: pointer;
}
</style>
