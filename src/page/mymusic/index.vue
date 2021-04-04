<template>
  <div class="myLikeandCollect myMusic-container">
    <el-container style="height: 100vh; border-right: 1px solid #eee">
      <el-aside width="300px" height="100vh" style="background-color: #1e131d;" class="menu-side3">
        <el-menu :default-openeds="['2']">
          <el-menu-item index="1-3" @click="getCollectSinger">我的歌手</el-menu-item>
          <el-menu-item index="1-4" @click="getVedio">我的视频</el-menu-item>
          <el-menu-item index="1-5">我的电台</el-menu-item>

          <el-submenu index="2">
            <template slot="title">创建的歌单</template>

            <el-menu-item :index="item.name" v-for="item in buildPlayList" :key="item.id" class="songs-menue" @click="
                getSongs(
                  item.id,
                  item.coverImgUrl,
                  item.description,
                  item.name
                );
              " style="padding-left: 20px">
              <img :src="item.coverImgUrl" alt="" class="coverImgurl" />
              <span> {{ item.name }}({{ item.trackCount }})</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">收藏的音乐</template>
            <el-menu-item :index="item.name" v-for="item in collectPlayList" :key="item.id" class="songs-menue" @click="
                getSongs(
                  item.id,
                  item.coverImgUrl,
                  item.description,
                  item.name
                );
              " style="padding-left: 20px">
              <img :src="item.coverImgUrl" alt="" class="coverImgurl" />
              {{ item.name }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container class="contentLike">
        <el-main>
          <!-- <button @click="testClick">点我一下</button> -->
          <keep-alive>
            <songs-detail :datalist="dataSongs" :id="sonsId" :img-url="coverImg" :songs-description="songsDescription"
              :songs-title="songsname" :tableloading="loading" v-if="status.songs" class="songs-detail">
            </songs-detail>
            <collect-singers :collectsingers="mycollectsingers" v-if="status.singers" :tableloading="loading">
            </collect-singers>
            <my-vedio :collectvedio="likeVedio" :tableloading="loading" v-if="status.mv"></my-vedio>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getuserplaylist } from "../../api/userlikesings";
import { getSingers } from "../../api/getCollectSingers";
import { getMyVedio } from "../../api/myVedio";
import { getMvUrl } from "../../api/watchMv";

import SongsDetail from "./songsDetail";
import CollectSingers from "./collectSinger";
import MyVedio from "./myVideo";
import { getSonsSheet } from "../../api/getSongsSheet";

import { Loading } from "element-ui";

export default {
  components: {
    SongsDetail,
    CollectSingers,
    MyVedio
  },
  data () {
    return {
      buildPlayList: null,
      collectPlayList: null,
      dataSongs: [],
      sonsId: 0,
      loading: false,
      coverImg: "",
      songsDescription: "",
      songsname: "",
      mycollectsingers: null,
      likeVedio: null,
      status: {
        mv: false,
        singers: false,
        songs: true
      }
    };
  },
  created () {
    var user = sessionStorage.getItem("userId");
    if (user) {
      user = JSON.parse(user);
      this.userId = user.userId || "";
    }
    this.getplaylist(this.userId);
  },
  mounted () {
    // 首次加载，打开喜欢的音乐
    var userLike = this.buildPlayList[0];
    this.getSongs(
      userLike.id,
      userLike.coverImgUrl,
      userLike.description,
      userLike.name
    );
  },
  methods: {
    getplaylist (userId) {
      // console.log('dahaigou');
      var dataPlayList = sessionStorage.getItem("dataList");

      if (dataPlayList) {
        dataPlayList = JSON.parse(dataPlayList).data;

        this.buildPlayList = dataPlayList.slice(0, 30);
        this.collectPlayList = dataPlayList.slice(30);
      } else {
        getuserplaylist(userId).then(response => {
          this.buildPlayList = response.data.playlist.slice(0, 30);
          this.collectPlayList = response.data.playlist.slice(30);
          var data = response.data.playlist;

          sessionStorage.setItem("dataList", JSON.stringify({ data }));
        });
      }
    },
    getSongs (id, img, description, name) {
      for (const key in this.status) {
        if (this.status.hasOwnProperty(key)) {
          this.status[key] = false;
        }
      }

      // this.loading = this.openLoading();
      this.loading = true;
      this.status.songs = true;
      this.sonsId = id;
      // this.loading = true
      getSonsSheet(id)
        .then(response => {
          this.loading = false;
          // this.loading.close();
          var dataSongs = response.data.playlist.tracks;
          this.coverImg = img;
          this.songsDescription = description;
          this.songsname = name;
          this.show(dataSongs);
        })
        .catch(e => {
          this.loading = false;
          // this.loading.close();
        });
    },
    show (data) {
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
    },
    getCollectSinger () {
      for (const key in this.status) {
        if (this.status.hasOwnProperty(key)) {
          this.status[key] = false;
        }
      }
      this.status.singers = true;

      this.loading = true;

      getSingers()
        .then(response => {
          this.loading = false;
          this.mycollectsingers = response.data.data;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    getVedio () {
      for (const key in this.status) {
        if (this.status.hasOwnProperty(key)) {
          this.status[key] = false;
        }
      }
      this.status.mv = true;
      this.loading = true;

      getMyVedio()
        .then(response => {
          this.loading = false;

          this.likeVedio = response.data.data;
        })
        .catch(e => {
          this.loading = false;
        });
    },
    testClick () {
      var id = 5436712;
      getMvUrl(id).then(res => { });
    },
    openLoading () {
      return Loading.service({
        text: "正在加载",
        target: document.querySelector(".songs-detail")
      });
    }
  }
};
</script>

<style scope>
.myLikeandCollect {
  margin-top: 80px;
}
.myMusic-container {
  padding: 0 20px;
  background-color: #1e131d;
  min-width: 100vh;
}
.coverImgurl {
  width: 50px;
  height: 50px;
}
.menu-side3 {
  width: 300px;
}
.songs-menue {
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.contentLike {
  margin-left: 2px;
}
</style>
