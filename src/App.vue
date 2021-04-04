<template>
  <div id="app" @mouseleave="moveEvent" @click="moveEvent" @mouseenter="browerPlayEnter">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  data () {
    return {
      isRouterAlive: true,
      timmer: null,
      timeId: null
    };
  },
  created () {
    this.moveEvent();
  },
  mounted () {
    console.log(this.mesg, "大海");
  },

  computed: {
    ...mapState({
      nowplayurl: state => state.myTest.playurl
    })
  },

  methods: {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
    moveEvent1 () {
      // 只要鼠标在页面活动，清除计时器，重新计时
      const path = ["/login"];
      if (document.URL.indexOf(path) === -1) {
        // 如果不是登录页面的话页面停止进行30分钟后清空session
        clearTimeout(this.timmer);
        this.init();
      }
    },
    init () {
      this.timmer = setTimeout(() => {
        // 清除session
        sessionStorage.removeItem("sessionData");
        sessionStorage.clear();
        // 跳往登录页面
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push("/login");
          this.$store.commit("clearRouters");
          this.$notify({
            title: "错误",
            message: "登录超时,请重新登录",
            type: "error",
            duration: 2000
          });
          location.reload();
        });
      }, 1000 * 60 * 30); // 设置半小时返回登录页
    },
    handleClose (done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.$store.commit("SET_PLAYSTATS", false);

          done();
        })
        .catch(_ => { });
    },
    playMove () {
      clearTimeout(this.timeId);
      this.$store.commit("SET_PLAYSTATS", true);
      this.startTime();
    },
    startTime () {
      this.timeId = setTimeout(() => {
        this.$store.commit("SET_PLAYSTATS", false);
      }, 1000);
    },

    // 鼠标移动
    browerPlayEnter () {

      this.$store.commit("SET_PLAYSTATS", true);
      this.timeId = setTimeout(() => {
        this.$store.commit('changeShowOrHidden', false)
      }, 3000);
    },
    moveEvent () {
      this.$store.commit('changeShowOrHidden', true)
      clearTimeout(this.timeId)
    }


  }
};
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
  min-width: 1200px;
  // min-height: 1000px;
  background: #1e131d;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  overflow: auto;
  color: #fff;
}
.playBar {
  width: 100%;
  height: 80px;
  background-color: #333;
  position: fixed;
  bottom: 0;
  padding-top: 10px;
  line-height: 80px;
  text-align: center;
  z-index: 1000;
}
.btnPlay {
  background-color: #fff;
}
#app {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  padding-bottom: 80px;
  transition: 2s all;
  overflow: auto;
}
.el-drawer__body {
  background-color: #333;
}
#mp3Btn {
  background-color: #444;
}
</style>
