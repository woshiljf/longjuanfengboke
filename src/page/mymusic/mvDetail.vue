<template>
  <div class="myMvDetail myMusic-container">
    <div style="height: auto; border-left: 1px solid #eee;border-right: 1px solid #eee" class="container-content">
      <div class="content-left">
        <div style="height: auto">
          <div class="lrc">
            <h2 style="padding: 0;margin:0">{{ mvInfo.title }}</h2>
            <video :src="myMvurl" width="100%" height="max-height: 830px;" controls="controls">
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div>
          <div>
            <span class="comment-title">评论</span>
            <span class="comment-title">共{{ total }}条评论</span>
            <div class="hr"></div>
          </div>
          <!-- <button @click="testClick">点我一下</button> -->

          <div class="commentBox">
            <div class="writeComment">
              <el-card class="box-card">
                <div class="commentText">
                  <div class="img">
                    <img :src="userImg" alt="" style="width: 50px;height: 50px" />
                  </div>
                  <div class="my-comment">
                    <el-input type="textarea" :rows="2" placeholder="评论" v-model="textarea" style="width: 100%">
                    </el-input>
                    <div class="commentclick">
                      <el-button type="primary" size="mini" @click="submitMyComment">评论</el-button>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>

            <div class="comment-content" v-loading="comentLoading">
              <el-card class="box-card" v-for="item in singComment" :key="item.commentId">
                <div class="img">
                  <img :src="item.user.avatarUrl" alt="" style="width: 100px;height: 100px" />
                </div>
                <div class="comment">
                  <p>
                    {{ item.user.nickname }}: <span>{{ item.content }}</span>
                  </p>

                  <p>{{ item.time | formatDate(item.time) }}</p>
                </div>

                <div class="anwser">
                  <el-button type="danger" size="mini" @click="anwserHandle(item.commentId);">回复</el-button>
                </div>
                <div class="my-comment" v-if="item.commentId == commentIndex">
                  <el-input type="textarea" :rows="2" placeholder="回复" v-model="textarea2" style="width: 100%">
                  </el-input>
                  <div class="commentclick">
                    <el-button type="primary" size="mini" @click="answerMyComment(item.commentId);">评论</el-button>
                  </div>
                </div>
              </el-card>
            </div>

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
          <h3>相似的MV</h3>
          <hr />
          <div class="simi-content">
            <ul style="list-style: none;padding:0;margin: 0">
              <li v-for="(item, index) in realatedMv" :key="index" class="title-li">
                <div class="simi-content">
                  <div style="margin-right: 5px">
                    <img :src="item.coverUrl" alt="" style="width:70px;height: 50px" />
                  </div>
                  <div class="content-title">
                    <!-- <p>{{ item.title }}</p> -->
                    <span @click="playSong(item.vid);" :loading="item.id === loadIndex" class="play-class">
                      {{ item.title }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="two">
          <h3></h3>
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
import { playMv } from "@/api/myVedio";
import Scroll from "../../components/baseScroll";
import Lyric from "lyric-parser";
import { mapState } from "vuex";
import { getMvDetail, getRelatedMv } from "@/api/myVedio";
import { submitComment } from "@/api/listenSing";
export default {
  name: "singInfo",
  components: {
    Scroll
  },
  data () {
    return {
      id: this.$route.params.id,
      geci: "",
      singComment: [],
      total: 0,
      pageSize: 10,
      offset: 1,
      flag: true,
      comentLoading: false,
      currentLineNum: 0,
      playing: true,
      simiPlayList: [],
      simiPlaysongs: [],
      loadIndex: 0,
      textarea: "",
      textarea2: "",
      commentIndex: 0,
      myMvurl: "",
      mvInfo: "",
      realatedMv: []
    };
  },
  watch: {
    // 监听路由变化
    $route: function (to, from) {
      // this.getComment()
      // this.getLrc()
    }
  },
  computed: {
    ...mapState({
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
    }
  },
  mounted () {
    this.firstGetInfo();
    this.userImg = JSON.parse(sessionStorage.getItem("userImage")).userImage
    // this.getsimiInfo();
  },
  methods: {
    firstGetInfo () {
      this.getMvUrl();
      this.getMvInfo();
      this.getSameMv();
      this.getComment();
    },
    getSameMv () {
      var mid = this.id;
      getRelatedMv(mid).then(res => {
        this.realatedMv = res.data.data;
        console.log("mv信息", this.realatedMv);
      });
    },

    getComment () {
      var params = {
        id: this.id,
        limit: this.pageSize,
        offset: this.offset
      };
      this.comentLoading = true;
      get("api/comment/video", params).then(res => {
        // console.log('下一页开始', res);
        this.comentLoading = false;

        this.singComment = [];
        this.singComment = res.data.comments;
        this.total = res.data.total;
      });
    },
    getMvUrl () {
      var params = {
        id: this.id
      };

      get("api/video/url", params)
        .then(res => {
          this.myMvurl = res.data.urls[0].url;
        })
        .catch(e => {
          console.log(e);
        })
        .finally(e => { });
    },
    //

    getMvInfo () {
      var id = this.id;
      getMvDetail(id).then(res => {
        this.mvInfo = res.data.data;
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
    getsimiInfo () {
      var params = {
        id: this.$route.params.id
      };
      Promise.all([getSimPlayList(params), getSimPlaysings(params)]).then(
        res => {
          this.simiPlayList = res[0].data.playlists;
          this.simiPlaysongs = res[1].data.songs;
        }
      );
    },
    playSong (songid) {
      this.loadIndex = songid;
      var params = {
        id: songid
      };
      this.id = songid;
      // this.$store.commit("changeShowOrHidden", true);
      // 请求歌词
      // this.getLrc();
      this.getMvUrl();
      this.getMvInfo();
      this.getSameMv();
      this.getComment();
    },
    commentHandle (params) {
      if (params.content == "") {
        this.$message({
          type: "warning",
          message: "输入点内容吧"
        });
        return;
      }

      submitComment(params).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "评论成功"
          });
          this.textarea = "";
          this.textarea2 = "";
          this.commentIndex = 0;
        }
      });
    },
    anwserHandle (commentId) {
      this.commentIndex = commentId;
    },
    submitMyComment () {
      var params = {
        id: this.id,
        content: this.textarea,
        type: 5
      };
      this.commentHandle(params);
    },
    answerMyComment (commentId) {
      var params = {
        t: 2,
        id: this.id,
        type: 5,
        content: this.textarea2,
        commentId: commentId
      };
      this.commentHandle(params);
    }
  },
  // 组件导航钩子

  beforeRouteEnter (to, from, next) {
    next();
  }
};
</script>

<style scoped>
.myMvDetail {
  margin-top: 80px;
}
.myMusic-container {
  padding: 0 200px;
  height: auto;
  justify-content: space-between;
}
.coverImgurl {
  width: 50px;
  height: 50px;
}

.lrc {
  text-align: center;
  line-height: 50px;
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
  /* border-right: 1px solid #ccc; */
  padding: 0 20px;
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
.simi-content {
  display: flex;
  justify-content: space-around;
}
.content-title {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.title-li {
  margin-bottom: 8px;
}
.play-class:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
