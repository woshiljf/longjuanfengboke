<template>
  <div class="myDashBorad container-header">
    <div class="myDashHeader header">
      <div class="logo" :class="'logo-width'">
        <span class="logo-title">龙卷风的博客</span>
      </div>

      <div class="navmenue">
        <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
          background-color="#333333" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item index="1" @click="findMusic"> 听听音乐 </el-menu-item>
          <el-menu-item index="2" @click="myMusicHandle" v-show="navFlag">我的音乐</el-menu-item>
          <el-menu-item index="3" @click="frendsHandle" v-show="navFlag">朋友</el-menu-item>
          <el-menu-item index="4" @click="shopHandle"> 前端学习记录 </el-menu-item>
          <el-menu-item index="6" @click="happyTime">快乐一下</el-menu-item>
          <el-menu-item index="7" @click="aboutMe" v-show="!navFlag">关于我</el-menu-item>
        </el-menu>
      </div>


      <div class="searchInput">
        <div class="search">
          <input type="text" class="search-box" v-model="searchKewords" placeholder="音乐/视频/电台/用户"
            @keyup.enter="handlekey()" />
        </div>
      </div>


      <div class="userinfo">
        <img :src="userImg" alt="" class="imgamure" />
        <span class="name"> {{ sysUserName }}</span>
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner el-icon-caret-bottom"></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link :to="{path:'/myHome'}">我的主页</router-link>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logoutFun">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { getSearchSug, getCloundSearch } from "@/api/searchApi";
import SearchDash from "./searchDash";
export default {
  name: "Head",

  data () {
    return {
      sysName: "网抑云音乐",
      sysUserName: "",
      treeArry: [],
      arry: [],
      activeIndex2: "1",
      searchKewords: "",
      searchFlag: true,
      searchSongs: [],
      searchAlbums: [],
      searchArtists: [],
      order: [],
      isStranger: true,
      userImg: '',
      navFlag: true
    };
  },
  computed: {
    ...mapState({
      stronger: state => state.myTest.stronger
    })
  },
  watch: {
    searchKewords: function (newText, oldText) {
      this.getSearchContent(newText);
    }
  },
  created(){
  },
  mounted () {

    var user = sessionStorage.getItem("user");
    var isStranger = sessionStorage.getItem("stranger")
    this.isStranger = JSON.parse(isStranger).iSstranger
    if(this.isStranger){
        var f = sessionStorage.getItem("navFlag");
        this.navFlag = f.navFlag
    }else{
         console.log("执行了吗",this.stronger);
         this.userImg = JSON.parse(sessionStorage.getItem("userImage")).userImage
    }
    if (user) {
      user = JSON.parse(user);
      this.sysUserName = user.loginName || "";
    }
  },
  methods: {
    logoutFun: function () {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            sessionStorage.removeItem("user");
            _this.$router.push("/login");
            // 退出清空router
            this.$store.commit("clearRouters");
          });
        })
        .catch(() => { });
    },
    aboutMe(){
       console.log("关于我");
    },
    myMusicHandle () {

      // var isStranger = sessionStorage.getItem("stranger")
      // this.isStranger = JSON.parse(isStranger).iSstranger

      if (this.isStranger == true) {
        this.$message({
          message: "你没有登录少年",
          type: "warning",
          duration: 2 * 1000
        });
        this.$router.push({ path: "/gotoLogin" });
      } else {
        this.$router.push({ path: "/mymusic" });
      }
    },
    findMusic () {
      this.$router.push({ path: "/" });
    },
    frendsHandle () {
      var isStranger = sessionStorage.getItem("stranger")
      this.isStranger = JSON.parse(isStranger).iSstranger
      if (this.isStranger == true) {
        this.$message({
          message: "你没有登录少年,先去登录一下",
          type: "warning",
          duration: 2 * 1000
        });
        this.$router.push({ path: "/gotoLogin" });
      } else {
        this.$router.push({ path: "/myfrends" });
      }
    },
    shopHandle () {
      this.$router.push({ path: "/study" });
    },
    handleSelect () { },

    happyTime () {

      this.$router.push({ path: "/happyTime" });
    },
    handlekey (e) {
      if (this.searchKewords == "") {
        return;
      }
      var obj = {
        searchSongs: [],
        searchAlbums: [],
        searchArtists: [],
        order: [],
        isShow: false
      };
      this.$store.commit("changeSearchInfo", obj);
      var p = {
        keywords: this.searchKewords
      };
      getCloundSearch(p)
        .then(res => {
          res.data.result.keywords = this.searchKewords;
          this.$store.commit("changeSearchOutCome", res.data.result);

          this.$router.push({ path: "/searchDash" });
          var obj = {
           isShow: false
      };
      this.$store.commit("changeSearchInfo", obj);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(e => {
        var obj = {
 
        isShow: false
      };
      this.$store.commit("changeSearchInfo", obj);
          this.$router.push({ path: "/searchDash" });
        });
    },
    // 搜索数据开始
    getSearchContent (text) {
      if (text == "") {
        var obj = {
          searchSongs: [],
          searchAlbums: [],
          searchArtists: [],
          order: [],
          isShow: false
        };
        this.$store.commit("changeSearchInfo", obj);
        return;
      }
      this.searchFlag = true;
      getSearchSug(text).then(res => {
        if (Object.keys(res.data.result).length == 0) {
          return;
        }
        // 保存数据
        var searchSongs = res.data.result.songs;
        var searchAlbums = res.data.result.albums;
        var searchArtists = res.data.result.artists;
        var order = res.data.result.order;
        var obj = {
          searchSongs,
          searchAlbums,
          searchArtists,
          order,
          isShow: this.searchFlag
        };
        // 点击到确认到搜索界面可以看到搜索关键字
        this.$store.commit("changeSearchInfo", obj);
      });
    }
  },
  created () {
    if (this.userName) {
      this.sysUserName = this.userName;
    } else {
      this.sysUserName = "myFriend";
    }
  }
};
</script>
<style scoped>
.container-header {
  height: 70px;
  min-width: 1420px;
  width: 100%;
  background-color: #333;
  text-align: center;
  line-height: 70px;
  overflow: auto;
  position: fixed;
  z-index: 50;
}
.myDashHeader {
  /* width: 1000px; */
  /* overflow: auto; */
  display: flex;
  justify-content: space-around;
}
.logo {
  position: absolute;
  left: 50px;
}
.imglogo {
  width: 55px;
  vertical-align: middle;
}
.imgamure {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  vertical-align: middle;
}
.navmenue {
  position: absolute;
  left: 300px;
  /* width: 100%; */
}
.logo-title {
  font-size: 20px;
  color: aliceblue;
}
.search {
  position: absolute;
  left: 820px;
  z-index: 10;
}
.search-box {
  width: 350px;
  height: 45px;
  border-radius: 25px;
  padding-left: 25px;
  outline: none;
}
.userinfo {
  color: #fff;
  position: absolute;
  right: 10px;
}
.user-center {
  position: absolute;
  left: 1080px;
}
.el-button--primary {
  color: #fff;
  background-color: #333;
  border-color: #ccc;
}
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 70px;
  line-height: 70px;
}
.el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 70px;
  line-height: 70px;
}
.outcome {
  position: absolute;
  top: 20px;
  left: 500px;
  z-index: 1000;
}
</style>
