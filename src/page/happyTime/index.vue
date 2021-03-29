<template>
  <div class="myMusic-container">
    <div style="height: auto; border-right: 1px solid #eee;border-left: 1px solid #eee;" class="container-content">
      <div class="content-left">
        <div style="height: auto">
          <div style="margin: 10px 0" class="event-header">
            <div class="text">
              <span class="comment-title" style="font-size: 25px">我们试着像以前一样快乐。。。</span>
            </div>
          </div>
          <div class="hr"></div>
        </div>

        <div class="playListTable">
          <div class="comment-content" v-loading="comentLoading">
            <el-card class="box-card" v-for="(item, index) in happlyList" :key="index">
              <div class="comment">
                <p>
                  {{ item.content }}
                </p>

                <div class="showImgBox">
                  <div class="imgbox" v-for="(img, i) in item.pics" :key="i">
                    <el-image style="width: 100px; height: 100px" :src="img.pcRectangleUrl"
                      :preview-src-list="[img.pcRectangleUrl]">
                    </el-image>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 地下评论 -->
        <div>
          <div class="commentBox">
            <el-card class="box-card">
              <div class="pagination">
                <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="total"
                  :page-sizes="[10, 20]" @size-change="sizeChange" @next-click="nextClick"
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
import { submitComment } from "@/api/listenSing";
import { getPlayListDetail, getRelatedPlayList } from "@/api/getSongsSheet";
import { mapState } from "vuex";
import $ from 'jquery'
export default {
  name: "singInfo",
  data () {
    return {
      id: this.$route.params.id,
      index: "",
      flag: true,
      songsId: 0,
      eventData: [],
      aboutUser: null,
      showTime: 0,
      textarea: "",
      simiPlayList: "",
      simiPlaysongs: "",
      total: 100,
      comentLoading: false,
      loadIndex: Infinity,
      userCommentInfo: {
        comments: null,
        hotComments: null,
        total: 0,
        userId: 0
      },
      happlyList: []
    };
  },
  computed: {
    ...mapState({
      userImg: state => state.user.userAvatarUrl,
      buttonIndex: state => state.myTest.playButtonIndex,
      playListId: state => state.myTest.playListId
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
  created () {
    // this.getEventIfno();

    this.getHappyContent()
  },
  mounted () {
    this.songsId = this.playListId;
    // this.getComment();
    // this.getPlaylist();
    // this.getRelatedList();
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

    sizeChange (data) {
      this.pageSize = data;
      this.getHappyContent()

    },
    nextClick (p) {
      this.offset = p;
      // 下一页
      this.flag = false;
      this.getHappyContent(p)
    },
    currentChange (p) {
      if (this.flag) {
        this.offset = p;
        this.getHappyContent(p)

      }
      this.flag = true;
    },
    getHappyContent (num = 1) {
      var tmp = Date.parse(new Date()).toString();
      tmp = tmp.substr(0, 10);
      var params = {
        key: '6e5562f4870ea8399cf3ed47156fa17e',
        time: tmp,
        sort: 'desc',
        pageSize: 20,
        page: num
      }
      // 临时存组件实例
      var _this = this
      $.ajax({
        type: 'get',
        url: "http://v.juhe.cn/joke/content/list.php",
        data: params,
        dataType: "jsonp", //xml json html script jsonp text
        success: function (res) {
          var data = JSON.stringify(res)
          var data2 = JSON.parse(data)
          _this.happlyList = data2.result.data
        },
        //查看服务器错误信息
        error: function (data) {
          console.log('请求失败了');
        }
      });

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
/* 用户评论 */
.userCommentbox {
  margin-top: 10px;
}
</style>
