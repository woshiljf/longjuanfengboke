<template>
  <div class="myMusic-container">
    <div style="height: auto; border-right: 1px solid #eee;border-left: 1px solid #eee;" class="container-content">
      <div class="content-left">
        <div style="height: auto">
          <div style="margin: 10px 0" class="event-header">
            <div class="text">
              <span class="comment-title" style="font-size: 25px">动态</span>
            </div>
            <div class="sendMessage">
              <el-button type="danger" icon="el-icon-edit" round>发动态</el-button>
              <el-button type="danger" icon="el-icon-edit" round>发视频</el-button>
            </div>
          </div>
          <div class="hr"></div>
        </div>

        <div class="playListTable">
          <div class="comment-content" v-loading="comentLoading">
            <el-card class="box-card" v-for="(item, index) in eventData" :key="index">
              <div class="img">
                <el-image style="width: 100px; height: 100px" :src="item.user.avatarUrl"
                  :preview-src-list="[item.user.avatarUrl]">
                </el-image>
              </div>
              <div class="comment">
                <p>
                  {{ item.user.nickname }}: <span>{{ item.info.msg }}</span>
                </p>

                <p>{{ item.showTime | formatDate(item.showTime) }}</p>

                <div class="showImgBox">
                  <div class="imgbox" v-for="(img, i) in item.pics" :key="i">
                    <el-image style="width: 100px; height: 100px" :src="img.pcRectangleUrl"
                      :preview-src-list="[img.pcRectangleUrl]">
                    </el-image>
                  </div>
                </div>
              </div>

              <div class="anwser" style="margin-bottom: 10px">
                <el-button type="danger" size="mini" @click="
                    anwserHandle(
                      item.user.userId,
                      item.commentInfo.threadId,
                      item.showTime
                    );
                  ">
                  打个招呼</el-button>
              </div>

              <!-- 评论框 -->

              <div class="my-comment" v-if="item.showTime == showTime">
                <el-input type="textarea" :rows="2" placeholder="评论" v-model="textarea" style="width: 100%">
                </el-input>
                <div class="commentclick">
                  <el-button type="primary" size="mini" @click="submitMyComment(item)">评论</el-button>
                </div>
                <!-- userCommentInfo -->
                <div class="userCommentbox">
                  <div class="content-card" v-for="item in userCommentInfo.comments" :key="item.time">
                    <el-card :body-style="{ padding: '0px' }">
                      <div class="img">
                        <img :src="item.user.avatarUrl" alt="" style="width: 40px;height: 40px" />
                      </div>
                      <div class="comment">
                        <p>
                          {{ item.user.nickname }}:
                          <span>{{ item.content }}</span>
                        </p>

                        <p>{{ item.time | formatDate(item.time) }}</p>
                      </div>
                    </el-card>
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
                  :page-sizes="[10, 20, 30, 40, 50]" @size-change="sizeChange" @next-click="nextClick"
                  @current-change="currentChange">
                </el-pagination>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="one">
          <h3>相关的歌单</h3>
          <hr />
          <div class="simi-content">
            <ul style="list-style: none;padding:0;margin: 0">
              <li v-for="(item, index) in simiPlayList" :key="index">
                <div class="img">
                  <img :src="item.coverImgUrl" alt="" style="width: 50px;height: 50px" />
                </div>
                <div class="comment">
                  <p class="relatedS" @click="playSong(item.id);">
                    {{ item.name }}
                  </p>
                  <p class="relatedS" style="color: #666;font-size: 12px">
                    by{{ item.creator.nickname }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="two">
          <h3>相似的歌曲</h3>
          <hr />
          <div class="simi-content">
            <ul style="list-style: none;padding:0;margin: 0">
              <li v-for="(item, index) in simiPlaysongs" :key="index">
                <div class="comment">
                  <div style="padding: 0;margin: 5px 0px;display:flex;justify-content: space-between;">
                    <span> {{ item.name }}</span>
                    <span @click="playSong(item.id);" :loading="item.id === loadIndex"><i
                        class="el-icon-caret-right"></i></span>
                  </div>
                  <p style="padding: 0;margin: 0;color: #666">
                    {{ item.artists[0].name }}
                  </p>
                </div>
              </li>
            </ul>
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
      total: 10,
      comentLoading: false,
      loadIndex: Infinity,
      userCommentInfo: {
        comments: null,
        hotComments: null,
        total: 0,
        userId: 0
      }
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
    this.getEventIfno();
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
    getEventIfno () {
      var p = {
        pageSize: 20
      };
      getEvent(p).then(res => {
        console.log("朋友", res);
        this.aboutUser = res.data;
        var temp = res.data.event;

        this.handleData(temp);
      });
    },
    handleData (data) {
      for (let i = 0; i < data.length; i++) {
        var item = data[i];
        var temp = {
          info: JSON.parse(item.json),
          user: item.user,
          showTime: item.showTime,
          id: item.id,
          commentInfo: item.info,
          pics: item.pics
        };
        this.eventData.push(temp);
      }
    },
    anwserHandle (uId, threadId, time) {
      this.showTime = time;
      var params = {
        threadId
      };
      getUserComment(params)
        .then(res => {
          this.userCommentInfo = {
            comments: res.data.comments,
            userId: res.data.userId,
            total: res.data.total,
            hotComments: res.data.hotComments
          };
        })
        .catch(err => {
          console.log(err);
        });
    },
    sizeChange (data) {
      this.pageSize = data;
      this.getComment();
    },
    nextClick (p) {
      this.offset = p;
      // 下一页
      this.flag = false;
      this.getComment();
    },
    currentChange (p) {
      if (this.flag) {
        this.offset = p;
        this.getComment();
      }
      this.flag = true;
    },
    playSong () { },
    submitMyComment (item) {
      if (this.textarea == '') {
        this.$message({
          type: warning,
          title: '说点内容吧'
        })
        return
      }
      var threadId = item.commentInfo.threadId

      var params = {
        type: 6,
        threadId: threadId,
        content: this.textarea,
      }
      submitComment(params).then(res => {


        if (res.data.code == 200) {
          this.$message({
            message: '评论好了',
            type: 'success',
            duration: 1 * 1000
          })
        }

        this.textarea = ''

      })



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
