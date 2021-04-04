<template>
  <div class="playListCatgary dashboard">
    <div class="dash-container">
      <div class="main-content">
        <div>
          <hr />
        </div>
        <div class="suggestion-sing">
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

import staticData from "@/textResources/staticData.js"
export default {
  data () {
    return {

      personData: [],
      newalbums: [],
    };
  },
  created () {


  },
  methods: {

    // 获取歌单列表
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

    handleClick () {
      console.log("a");
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

.playListCatgary {
  margin-top: 80px;
}

.dashboard {
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
.sug {
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
  width: 220px;
  height: 220px;
}
.image {
  width: 220px;
  height: 220px;
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
