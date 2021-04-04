<template>
  <div class="singerDetail myMusic-container">
    <div style="height: auto; border-left: 1px solid #eee;border-right: 1px solid #eee;" class="container-content">
      <div class="content-left">
        <div style="height: auto">
          <div class="playListTitle">
            <div class="imagcover">
              <img :src="singerInfo.img1v1Url || singerInfo.picUrl" alt="" style="width: 270px;heigth: 260px" />
            </div>
            <div class="description">
              <div class="con play-title">
                <span class="nametitle">{{ singerInfo.name }}</span>
              </div>

              <div class="con creator">
                <span>发布时间</span>
                <span>{{singerInfo.publishTime | formatDate(singerInfo.publishTime)}}</span>
              </div>

              <div class="con button">
                <el-button type="danger">动态：</el-button>
                <el-button type="danger">关注：</el-button>
                <el-button type="danger">粉丝：</el-button>
              </div>
              <div class="con tag">
                <span>个人介绍</span>
              </div>
              <div class=" con dec-content">
                <p>{{ singerInfo.briefDesc}}</p>
              </div>
            </div>
          </div>
        </div>
        <div>热门50首</div>
        <div class="table-title" style="width: 100%;   display: flex;
             justify-content: space-between;margin-top: 20px"></div>
        <div class="playListTable">
          <el-table :data="dataSongs" stripe style="width: 100%" ref="playList" highlight-current-row
            :header-cell-style="{
              background: '#333',
              color: 'white',
              padding: '1px 0',
              height: '50px'
            }">
            <el-table-column type="index" width="50" :index="indexMethod">
            </el-table-column>
            <el-table-column label="听歌">
              <template slot-scope="scope">
                <el-button size="mini" :type="scope.$index === buttonIndex ? 'goon' : 'default'"
                  @click="handleEdit(scope.$index, scope.row,scope.row.id);" :loading="scope.$index === index">播放
                </el-button>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="歌曲标题" width="180">
              <template slot-scope="scope">
                <router-link :to="{ name: 'singInfo', params: { id: scope.row.id } }">
                  <span class="singName">{{ scope.row.title }}</span>
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时长" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.time | formMin(scope.row.time) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="singer" label="歌手"> </el-table-column>
            <el-table-column prop="zj" label="专辑"> </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "@/utils/request";
import { mapState } from "vuex";

export default {
  name: "singInfo",
  data () {
    return {
      index: "",
      flag: true,
      showColor: 0,
      singComment: [],
      total: 0,
      pageSize: 10,
      offset: 1,
      comentLoading: false,
      currentLineNum: 0,
      playing: true,
      simiPlayList: [],
      simiPlaysongs: [],
      loadIndex: 0,
      dataSongs: [],
      creatorInfo: {
        cAvatarUrl: "",
        cNickName: ""
      },
      // 歌单信息,
      songid: 0,
      showColor: 1,
      songsId: 0,
      singerInfo: null,
    };
  },
  computed: {
    ...mapState({
      userImg: state => state.user.userAvatarUrl,
      buttonIndex: state => state.myTest.playButtonIndex,
      playListId: state => state.myTest.playListId,
      singerDetail: state => state.myTest.singerDetail
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
  created () { },
  mounted () {

    // this.songsId = this.singerDetail[0].id;
    this.getSingerData();
  },

  watch: {
    datalist: function () {
      this.index = "";
      this.flag = true;
    },
    $route: function (to, from) {
      console.log("路由变化了");
    }
  },

  methods: {
    indexMethod (index) {
      return index * 1 + 1;
    },
    getSingerData () {
      var singerId = this.singerDetail[0].id

      //   获取歌手信息
      get("api/artists", { id: singerId })
        .then(res => {
          // 保存歌手信息
          this.singerInfo = res.data.artist
          this.handlePlayListInfo(res.data.hotSongs)

        })
        .catch(e => {
          console.log(e);
        })
        .finally(e => { });


    },

    handlePlayListInfo (songList) {

      var dataSongs = songList
      this.show(dataSongs);
    },
    show (data) {
      // console.log("歌曲信息", data);
      var dataList = [];
      for (let i = 0; i < data.length; i++) {
        var obj = {};
        obj.title = data[i].name;
        obj.singer = data[i].ar[0].name;
        obj.zj = data[i].al.name;
        obj.time = data[i].dt;
        obj.id = data[i].id;
        obj.singerDetail = data[i].ar
        dataList.push(obj);
      }

      this.dataSongs = dataList;
      // console.log("处理的数据", this.dataSongs);
    },

    // 播放歌曲
    handleEdit (index, row, id) {

      this.songid = row.id;
      this.$store.commit('commitSingId', id)
      this.index = index;
      var params = {
        id: row.id
      };
      // this.currentRow = row;
      // 修改当前的播放歌曲id
      this.showColor = 1;
      this.$store.commit("changeNowPlayId", row.id);
      this.$store.commit("changePlayButtonIndex", index);
      this.$store.commit("changeShowOrHidden", true);
      get("api/song/url", params)
        .then(res => {
          this.index = "";
          var url = res.data.data[0].url;
          if (url !== null) {
            this.$store.commit("changePlayurl", url);
          } else {
            this.$message({
              message: "穷人听不起，要会员的。。。",
              type: "warning"
            });
          }
        })
        .catch(e => {
          console.log(e);
        })
        .finally(e => { });

      if (this.flag) {
        var temp = [];
        this.dataSongs.forEach(item => temp.push(item.id));
        this.$store.commit("changePlayList", temp);
        this.flag = false;
      }

      // 获取相似歌曲的歌单链表
      // this.getsimiList();
    },

    // 获取包含正在播放歌曲的歌单
    getRelatedList () {
      var params = this.playListId;
      Promise.all([getRelatedPlayList(params)]).then(res => {
        this.simiPlayList = res[0].data.playlists;
      });
    },

  },
  // 组件导航钩子
  beforeRouteEnter (to, from, next) {
    // 重新请求

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
.singerDetail {
  margin-top: 60px;
}
.myMusic-container {
  padding: 0 200px;
  height: auto;
  justify-content: space-between;
  min-width: 1420px;
  padding-bottom: 80px;
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
  border-right: 1px solid #ccc;
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
</style>
