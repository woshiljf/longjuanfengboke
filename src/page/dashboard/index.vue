<template>
  <div class="dashboard">
    <div class="dash-container">
      <div class="menu">
      </div>
      <div class="lunbotumain">
        <div class="lunbotu">
          <el-carousel :interval="5000" arrow="always" class="carousel">
            <el-carousel-item v-for="item in imgurl" :key="item.imgageUrl">
              <img :src="item.imageUrl" :alt="item.typeTitle" @click="
                  gotoHomeSong(item.targetId, item.targetType, item.typeTitle);
                " />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <div class="main-content">

        <div class="suggestionType" style="color: white">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="热门推荐" name="1">热门推荐</el-tab-pane>
            <el-tab-pane label="华语" name="2"></el-tab-pane>
            <el-tab-pane label="流行" name="3"></el-tab-pane>
            <el-tab-pane label="摇滚" name="4"></el-tab-pane>
            <el-tab-pane label="民谣" name="5"></el-tab-pane>
            <el-tab-pane label="电子" name="6"></el-tab-pane>
            <el-tab-pane class="more" label="更多" name="7" style="position: absolute;right: 0"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="suggestion-sing" v-loading="loading" element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
          <div class="hot-sug">
            <ul class="sugImg">
              <li class="sug-sings" v-for="item in personData" :key="item.id">
                <div class="sug-class" @click="goToPlayList(item.id);">
                  <img :src="item.picUrl" alt="" />
                  <div>
                    <span> {{ item.name }} </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <hr />
      </div>
    </div>
  </div>
</template>
<script>
import {
  getHomePage,
  gerPersona,
  getNewAlbum,
  getTop
} from "../../api/homepage";
import { getHomeLubo } from "../../api/getHomeLubotu";
import { getuserplaylist } from "../../api/userlikesings";
import staticData from "@/textResources/staticData.js"
import { getPlayListCatgary } from "@/api/getSingerDetail";
export default {
  data () {
    return {
      userName: "",
      imgurl: [],
      singinfo: null,
      creatives: [],
      activeName: "0",
      styleSuggestion: [],
      personData: staticData,
      newalbums: [],
      loading: false
    };
  },
  created () {
    this.isGujiaping = true
    this.getHomeInfor();
    this.getHome();
    this.getPersonList();
    this.getnewAb();
    var user = sessionStorage.getItem("userId");
    if (user) {
      user = JSON.parse(user);
      this.userId = user.userId || "";
    }
    this.getplaylist(this.userId);
  },
  methods: {
    getHomeInfor () {
      getHomePage()
        .then(res => {
          this.singinfo = res.data.data.blocks;
          this.creatives = res.data.data.blocks[0].creatives;
          this.styleSuggestion = res.data.data.blocks[2];
        })
        .catch(e => { });
    },
    // 获取歌单列表
    getplaylist (userId) {

      console.log(userId);
      if (userId !== undefined) {
        getuserplaylist(userId).then(response => {

          var data = response.data.playlist;
          sessionStorage.setItem("dataList", JSON.stringify({ data }));
        });
      }

    },
    getHome () {
      getHomeLubo().then(res => {
        this.imgurl = res.data.banners;
      });
    },
    getPersonList () {
      gerPersona().then(res => {
        this.personData = res.data.result.slice(0, 12);

      });
    },
    getnewAb () {
      getNewAlbum(20, 0).then(res => {
        // this.newalbums = res.data.album.slice(0, 10);
        this.newalbums = res.data.weekData.slice(0, 10);
      });
    },
    goToPlayList (sId) {
      // 解决歌单页面跳转无法请求得问题
      this.$store.commit("changePlayListId", sId);
      this.$router.push({
        name: "playlist",
        params: {
          id: sId
        }
      });
    },
    gotoHomeSong (id, type, title) {
      this.$router.push({
        name: "homePlay",
        query: {
          targetId: id,
          targetType: type,
          typeTitle: title
        }
      });
    },
    //  获取歌单类型
    handleClick (e) {
      this.loading = true
      if (e.label == '热门推荐' || e.label == '更多') {
        e.label = '全部'
      }
      this.getTagInfo(e.label)
    },
    // 获取标签的歌单
    getTagInfo (tag) {
      getPlayListCatgary(50, tag, 50)
        .then(response => {

          var responseData = response.data.playlists
          var data = []
          // 对数据过滤一下，选取有用的就行
          for (let i = 0; i < responseData.length; i++) {

            var obj = {}
            var temp = responseData[i]
            obj['coverImgUrl'] = temp['coverImgUrl']
            obj['id'] = temp['id']
            obj['name'] = temp['name']
            obj['description'] = temp['description']
            obj['userId'] = temp['userId']
            obj['creator'] = temp['creator'].nickname
            data.push(obj)
          }
          // 跳转到分类歌单
          this.loading = false
          this.$store.commit('changePlayListCatgory', data)
          this.$router.push({
            name: 'playListCatgory',
          })
        })
        .catch(e => {
          console.log(e);
        })
        .finally(e => {

          console.log(e);
        });
    },

    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    }
  }
};
</script>
<style scoped>
ul {
  padding: 0;
  margin: 0;
}
.dashboard {
  height: 1200px;
  width: 100%;
  color: #fff;
  min-width: 1420px;
  margin-top: 75px;
}
.el-menu-demo {
  color: #fff;
}
.suggestion-title {
  height: 40px;
  padding: 0;
}

.main-content {
  width: 100%;
  height: auto;
  /* border: 1px solid #ccc; */
}
.suggestion-sing {
  margin: 0 20px;
  /* border: 1px solid #ccc; */
  height: 100%;
  float: left;
}
.suggestionType {
  margin: 0 150px;
  color: #fff;
}
.lunbotumain {
  width: 100%;
  text-align: center;
}
.lunbotu {
  padding: 0 150px;
  width: 100%;
  height: auto;
  /* border-bottom: 1px solid #333; */
  background-color: #1e131d;
}
.hot-sug {
  width: 100%;
  margin-bottom: 15px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hot-sug ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sugImg {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.sugImg li {
  float: left;
  text-align: center;
}
.sug-sings {
  height: 241px;
  /* border: 1px solid #000; */
  width: 15%;
  /* margin-left: 18px; */
  margin-bottom: 35px;
  cursor: pointer;
}
.sug-sings img {
  width: 85%;
  height: auto;
}
.el-main {
  padding: 0;
  margin-top: -19px;
  padding: 0 150px;
}
.el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
}
.menu {
  padding-left: 300px;
  background-color: #c20c0c;
}
.el-card {
}

/* 新碟上架部分 */
.title {
  display: flex;
  justify-content: space-between;
  padding: 0px 5px;
}
.newAblum {
  color: #333;
  font-size: 20px;
  font-weight: bold;
}
.more {
  color: red;
  cursor: pointer;
}
.ablum-li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.img-li {
  width: 200px;
  height: 200px;
  list-style: none;

  margin-bottom: 5px;
}
.img-li img {
  width: 100%;
  height: 100%;
}
</style>
