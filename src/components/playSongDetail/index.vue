<template>
  <div class="myMusic-container">
    <div
      style="height: auto; border-left: 1px solid #eee;border-right: 1px solid #eee"
      class="container-content"
    >
      <div class="content-left">
        <div style="height: auto">
          <div class="lrc" v-if="geciFlag">
            <div class="lyric">
              <scroll
                class="lyric-wrapper"
                ref="lyricList"
                :data="geci && geci.lines"
              >
                <div>
                  <div class="lyric">
                    <p
                      v-for="(line, index) in geci.lines"
                      ref="lyricLine"
                      :class="{ current: currentLineNum === index }"
                      class="text"
                      :key="index"
                    >
                      {{ line.txt }}
                    </p>
                  </div>
                </div>
              </scroll>
            </div>
          </div>

          <div class="album-class" v-if="albumFlag">
            <!-- 专辑头部 -->
            <div class="playListTitle">
              <div class="imagcover">
                <img
                  :src="playListInfo.coverImgUrl"
                  alt=""
                  style="width: 270px;heigth: 260px"
                />
              </div>
              <div class="description">
                <div class="con play-title">
                  <span class="nametitle">{{ playListInfo.nameTitle }}</span>
                </div>

                <div class="con creator">
                  <img
                    :src="creatorInfo.cAvatarUrl"
                    alt=""
                    style="width: 25px;height: 25px; vertical-align: middle;"
                  />
                  <span>{{ creatorInfo.cNickName }}</span>
                  <span
                    >{{
                      playListInfo.createTime
                        | formatDate(playListInfo.createTime)
                    }}创建</span
                  >
                </div>

                <div class="con button">
                  <el-button type="primary" @click="playHandle">播放</el-button>
                  <el-button type="success">收藏</el-button>
                  <el-button type="info">分享</el-button>
                  <el-button type="warning">下载</el-button>
                  <el-button type="danger">评论</el-button>
                </div>
                <div class="con tag">
                  <span>标签</span>
                  <el-button
                    round
                    size="mini"
                    v-for="(item, i) in playListInfo.playListTags"
                    :key="i"
                    >{{ item }}
                  </el-button>
                </div>
                <div class=" con dec-content">
                  <p>{{ playListInfo.description }}</p>
                </div>
              </div>
            </div>

            <!-- table-start -->

            <!-- table -->
            <div class="playListTable">
              <el-table
                :data="dataSongs"
                stripe
                style="width: 100%"
                ref="playList"
                highlight-current-row
                :header-cell-style="{
                  background: '#333',
                  color: 'white',
                  padding: '1px 0',
                  height: '50px'
                }"
              >
                <el-table-column type="index" width="50" :index="indexMethod">
                </el-table-column>
                <el-table-column label="听歌">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      :type="scope.$index === buttonIndex ? 'goon' : 'default'"
                      @click="handleEdit(scope.$index, scope.row);"
                      :loading="scope.$index === index"
                      >播放
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="title" label="歌曲标题" width="180">
                  <template slot-scope="scope">
                    <router-link
                      :to="{ name: 'singInfo', params: { id: scope.row.id } }"
                    >
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
                    <img
                      :src="userImg"
                      alt=""
                      style="width: 50px;height: 50px"
                    />
                  </div>
                  <div class="my-comment">
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="评论"
                      v-model="textarea"
                      style="width: 100%"
                    >
                    </el-input>
                    <div class="commentclick">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="submitMyComment"
                        >评论</el-button
                      >
                    </div>
                  </div>
                </div>
              </el-card>
            </div>

            <div class="comment-content" v-loading="comentLoading">
              <el-card
                class="box-card"
                v-for="item in singComment"
                :key="item.commentId"
              >
                <div class="img">
                  <img
                    :src="item.user.avatarUrl"
                    alt=""
                    style="width: 100px;height: 100px"
                  />
                </div>
                <div class="comment">
                  <p>
                    {{ item.user.nickname }}: <span>{{ item.content }}</span>
                  </p>

                  <p>{{ item.time | formatDate(item.time) }}</p>
                </div>

                <div class="anwser">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="anwserHandle(item.commentId);"
                    >回复</el-button
                  >
                </div>
                <div class="my-comment" v-if="item.commentId == commentIndex">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="回复"
                    v-model="textarea2"
                    style="width: 100%"
                  >
                  </el-input>
                  <div class="commentclick">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="answerMyComment(item.commentId);"
                      >评论</el-button
                    >
                  </div>
                </div>
              </el-card>
            </div>

            <el-card class="box-card">
              <div class="pagination">
                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                  :page-sizes="[10, 20, 30, 40, 50]"
                  @size-change="sizeChange"
                  @next-click="nextClick"
                  @current-change="currentChange"
                >
                </el-pagination>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="one">
          <h3>包含这首歌的歌单</h3>
          <hr />
          <div class="simi-content">
            <ul style="list-style: none;padding:0;margin: 0">
              <li v-for="(item, index) in simiPlayList" :key="index">
                <div class="img">
                  <img
                    :src="item.coverImgUrl"
                    alt=""
                    style="width: 50px;height: 50px"
                  />
                </div>
                <div class="playlist-title">
                  <p @click="playSong(item.id);">{{ item.name }}</p>

                  <p>{{ item.creator.nickname }}</p>
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
                  <div
                    style="padding: 0;margin: 5px 0px;display:flex;justify-content: space-between;"
                  >
                    <span> {{ item.name }}</span>
                    <span
                      @click="playSong(item.id);"
                      :loading="item.id === loadIndex"
                      ><i class="el-icon-caret-right"></i
                    ></span>
                  </div>
                  <p style="padding: 0;margin: 0;color: #666">
                    {{ item.artists[0].name }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div class="box-test"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "@/utils/request";
import {
  getSimPlayList,
  getSimPlaysings,
  submitComment,
  getalubmInfo,
  getCommentAlbum
} from "@/api/listenSing";
import { getPlayListDetail, getRelatedPlayList } from "@/api/getSongsSheet";
import Scroll from "../../components/baseScroll";
import Lyric from "lyric-parser";
import { mapState } from "vuex";
export default {
  components: {
    Scroll
  },
  data() {
    return {
      geci: "",
      total: 0,
      pageSize: 10,
      offset: 1,
      flag: true,
      comentLoading: false,
      currentLineNum: 0,
      playing: true,
      loadIndex: 0,
      textarea: "",
      textarea2: "",
      commentIndex: 0,
      singComment: [],
      simiPlaysongs: [],
      simiPlayList: [],
      albumFlag: false,
      geciFlag: true,
      dataSongs: [],
      creatorInfo: {
        cAvatarUrl: "",
        cNickName: ""
      },
      songid: "",
      index: "",
      // 歌单信息
      playListInfo: {
        trackCount: 0, //歌单曲目数量
        playCount: 0, // 播放次数
        createTime: 0, // 创建时间
        playListTags: [], // 歌单标签
        description: "", // 歌单描述
        coverImgUrl: "", //歌单图片
        nameTitle: "" // 歌单名字标题
      }
    };
  },
  props: {
    targetId: {
      type: Number,
      default: () => {
        return 0;
      }
    },
    targetInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  watch: {
    // 监听路由变化
    $route: function(to, from) {
      // this.getComment()
      // this.getLrc()
    }
  },
  computed: {
    ...mapState({
      userImg: state => state.user.userAvatarUrl,
      buttonIndex: state => state.myTest.playButtonIndex,
      playListId: state => state.myTest.playListId
    })
  },

  filters: {
    formatDate: function(time) {
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
    formMin: function(time) {
      var t = new Date(time);
      var m = t.getMinutes();
      var s = t.getSeconds();
      m = m > 9 ? m : "0" + m;
      s = s > 9 ? s : "0" + s;
      return m + ":" + s;
    }
  },
  mounted() {
    this.getSwitchInfo();
  },
  methods: {
    getSwitchInfo() {
      var targetType = this.targetInfo.targetType;
      switch (targetType) {
        case 1:
          this.getLrc();
          this.playSing();
          this.getComment();
          this.getsimiInfo();
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          break;
        case 10:
          this.getAlubmShow();
          this.getCommentA();
          this.getRelatedList();
          break;
      }
    },
    getRelatedList() {
      var params = this.targetId;
      Promise.all([getRelatedPlayList(params)]).then(res => {
        this.simiPlayList = res[0].data.playlists;
      });
    },

    getsimiInfo() {
      var params = {
        id: this.targetId
      };
      Promise.all([getSimPlayList(params), getSimPlaysings(params)]).then(
        res => {
          this.simiPlayList = res[0].data.playlists;
          this.simiPlaysongs = res[1].data.songs;
        }
      );
    },
    // 播放歌曲
    playSong(songid) {
      this.$store.commit("changePlayListId", songid);
      this.id = songid;
      this.getComment();
      this.getPlaylist();
      this.getRelatedList();
    },

    getPlaylist() {
      var params = {
        id: this.playListId
      };
      get("api/playlist/detail", params)
        .then(response => {
          console.log("歌单", response);

          this.handlePlayListInfo1(response.data.playlist);
        })
        .catch(e => {
          console.log(e);
        })
        .finally(e => {});
    },

    handlePlayListInfo1(songList) {
      var dataSongs = songList.tracks;
      var songsLength = dataSongs.length;
      // this.creatorInfo = {
      //   cNickName: songList.playlist.creator.nickname || 0,
      //   cAvatarUrl: songList.playlist.creator.avatarUrl || 0
      // };
      this.playListInfo = {
        trackCount: songsLength, //歌单曲目数量
        playCount: songList.playCount, // 播放次数
        createTime: songList.createTime, // 创建时间
        playListTags: songList.tags || 0, // 歌单标签
        description: songList.description, // 歌单描述
        coverImgUrl: songList.coverImgUrl, //歌单图片
        nameTitle: songList.name // 歌单名字标题
      };
      this.show(dataSongs);
    },

    // 歌词相关方法start
    getLrc() {
      this.geciFlag = true;
      this.albumFlag = false;
      var params = {
        id: this.targetId
      };
      get("api/lyric", params)
        .then(res => {
          var getgeci = res.data.lrc.lyric;
          this.geci = new Lyric(getgeci, this.handleLyric);
          if (this.playing) {
            this.geci.play();
          }
        })
        .catch(e => {
          console.log(e);
        })
        .finally(e => {});
    },
    // 歌曲播放相关
    playSing() {
      var params = {
        id: this.targetId
      };
      // this.currentRow = row;
      // 修改当前的播放歌曲id
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
        .finally(e => {});
      // 获取相似歌曲的歌单链表
      // this.getsimiList();
    },

    // 歌词滚动还没有实现
    handleLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      // 若当前行大于5,开始滚动,以保歌词显示于中间位置
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        // 结合better-scroll，滚动歌词
        this.$refs.lyricList.scrollTo(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
    },
    //歌词相关方法end
    // 获取歌曲、歌单评论start
    getComment() {
      var params = {
        id: this.targetId,
        limit: this.pageSize,
        offset: this.offset
      };
      this.comentLoading = true;
      get("api/comment/music", params).then(res => {
        // console.log('下一页开始', res);
        this.comentLoading = false;
        this.singComment = [];
        this.singComment = res.data.comments;
        this.total = res.data.total;
      });
    },

    getCommentA() {
      var params = {
        id: this.targetId,
        limit: this.pageSize,
        offset: this.offset
      };
      this.comentLoading = true;
      get("api/comment/album", params).then(res => {
        // console.log('下一页开始', res);
        this.comentLoading = false;
        this.singComment = [];
        this.singComment = res.data.comments;
        this.total = res.data.total;
      });
    },

    // 获取歌词，歌单评论end

    // 评论相关方法start
    commentHandle(params) {
      if (params.content == "") {
        this.$message({
          type: "warning",
          message: "输入点内容吧"
        });
        return;
      }

      submitComment(params)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "评论成功"
            });
            this.textarea = "";
            this.textarea2 = "";
            this.commentIndex = 0;
          }
        })
        .catch(err => {
          console.log("评论失败", err);
          this.$message({
            type: "warning",
            message: "暂时不能评论"
          });

          this.textarea = "";
          this.textarea2 = "";
          this.commentIndex = 0;
        });
    },
    anwserHandle(commentId) {
      this.commentIndex = commentId;
    },
    submitMyComment() {
      var params = {
        id: this.targetId,
        content: this.textarea
      };

      this.commentHandle(params);
    },
    answerMyComment(commentId) {
      var params = {
        t: 2,
        id: this.targetId,
        content: this.textarea2,
        commentId: commentId
      };
      this.commentHandle(params);
    },
    // 评论相关方法end
    // pagination方法start

    sizeChange(data) {
      this.pageSize = data;
      this.getComment();
    },
    nextClick(p) {
      this.offset = p;
      // 下一页
      this.flag = false;
      this.getComment();
    },
    currentChange(p) {
      if (this.flag) {
        this.offset = p;
        this.getComment();
      }
      this.flag = true;
    },
    // 获取专辑相关得方法
    // 专辑。歌单数据处理方法
    getAlubmShow() {
      this.geciFlag = false;
      this.albumFlag = true;
      var params = {
        id: this.targetId
      };
      get("api/album", params)
        .then(response => {
          this.handlePlayListInfo(response.data);
        })
        .catch(e => {
          console.log(e);
        })
        .finally(e => {});
    },
    handlePlayListInfo(songList) {
      var dataSongs = songList.songs;
      var songsLength = dataSongs.length;
      // this.creatorInfo = {
      //   cNickName: songList.playlist.creator.nickname || 0,
      //   cAvatarUrl: songList.playlist.creator.avatarUrl || 0
      // };
      this.playListInfo = {
        trackCount: songsLength, //歌单曲目数量
        playCount: songList.album.playCount, // 播放次数
        createTime: songList.album.publishTime, // 创建时间
        playListTags: songList.album.tags || 0, // 歌单标签
        description: songList.album.description, // 歌单描述
        coverImgUrl: songList.album.picUrl, //歌单图片
        nameTitle: songList.album.name // 歌单名字标题
      };
      this.show(dataSongs);
    },
    show(data) {
      var dataList = [];
      for (let i = 0; i < data.length; i++) {
        var obj = {};
        obj.title = data[i].name;
        obj.singer = data[i].ar[0].name;
        obj.zj = data[i].al.name;
        obj.time = data[i].dt;
        obj.id = data[i].id;
        dataList.push(obj);
      }

      this.dataSongs = dataList;
    },
    playHandle() {
      this.$store.commit("SET_PLAYSTATS", true);
    },
    indexMethod(index) {
      return index * 1 + 1;
    },

    // 播放歌单的操作（这是歌单的播放）
    handleEdit(index, row) {
      this.songid = row.id;
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
        .finally(e => {});

      if (this.flag) {
        var temp = [];
        this.dataSongs.forEach(item => temp.push(item.id));
        this.$store.commit("changePlayList", temp);
        this.flag = false;
      }

      // 获取相似歌曲的歌单链表
      // this.getsimiList();
    }
  },

  // 组件导航钩子

  beforeRouteEnter(to, from, next) {
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
  border-right: 1px solid #ccc;
}

.content-right {
  height: auto;
  width: 340px !important;
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
.content-left {
  width: 100%;
  padding: 20px 15px;
  border-right: 1px solid #ccc;
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
.playlist-title {
  cursor: pointer;
}
.playlist-title :hover {
  text-decoration: underline;
}
</style>
