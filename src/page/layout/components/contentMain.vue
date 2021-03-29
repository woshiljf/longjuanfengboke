<template>
  <div class="contentMain">
    <transition name="fade-transform" mode="out-in">
      <keep-alive exclude="singInfo">
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { getHomePage } from "../../../api/homepage.js";
export default {
  name: "Content",
  components: {},
  data () {
    return {
      activepath: ""
    };
  },
  watch: {
    $route (to, from) {
      this.activepath = to.path;
    }
  },
  created () {
    this.getHomeInfor();
  },
  mounted () {
    //首次添加router
  },
  methods: {
    getHomeInfor () {
      getHomePage()
        .then(res => {
          // console.log(res.data.blocks)
          this.singinfo = res.data.blocks;
        })
        .catch(e => { });
    }
  }
};
</script>
<style scoped lang="scss">
.contentMain {
  position: relative;
  height: 100%;
  width: 100%;

  overflow-y: scroll;
}

.menu {
  width: 100%;
  height: 40px;
  position: absolute;
  left: 20%;
  background-color: #c20c0c;
}
.suggestion-sing {
  margin-top: 10px;
  padding: 0 20px;
  text-align: center;
}
.suggestion {
  // border-left: 1px solid #ccc;
  // border-right: 1px solid #ccc;
}
.carousel {
  text-align: center;
}
.el-menu-item.is-active {
  color: #ffffff;
  background-color: rgba($color: #000, $alpha: 0.5) !important;
}
.el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
  border-radius: 20px;
  border: 0;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-main {
  padding: 0;
  margin-top: -19px;
}
.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
