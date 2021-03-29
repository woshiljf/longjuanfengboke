<template>
  <div class="myMusic-container">
    <div style="height: auto; border-left: 1px solid #eee;border-right: 1px solid #eee;" class="container-content">
      <div class="content-left">
        <div style="height: auto">
          <div class="playListTitle">

            <div class="logbox">

              <div class="logform">

                <div class=" common phone">

                  <el-input placeholder="请输入手机号" v-model="phoneNumber"></el-input>
                </div>

                <div class="common pwds">
                  <el-input placeholder="请输入登录密码" v-model="password" show-password></el-input>

                </div>
                <div class="common submit">
                  <el-button type="danger" @click="loginHandle" :loading="logining">立即登录</el-button>

                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { get } from "@/utils/request";
import { getSimPlaysings, submitComment } from "@/api/listenSing";
import { getUserInfo } from "@/api/userlikesings";
import { mapState } from "vuex";
import { getToken } from '@/utils/auth'

export default {
  name: "singInfo",
  data () {
    return {
      phoneNumber: '',
      password: '',
      logining: false
    };
  },


  computed: {
    ...mapState({
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
  created () { },
  mounted () {



  },
  methods: {
    loginHandle () {

      if (this.password == '' || this.phoneNumber == '') {
        this.$message({
          message: '请输入手机号或密码',
          type: 'warning',
          duration: 3 * 1000
        })
        return
      }

      this.logining = true
      const params = {
        userCode: this.phoneNumber,
        password: this.password
      }

      this.$store.dispatch('LoginByUsername', params).then((res) => {

        console.log('agkfjsdfjsk ');
        if (!getToken()) {
          this.$notify({
            title: '登录失败',
            message: '登录失败',
            type: 'error',
            duration: 2000
          })
          // loginLoading.close()
          return
        }
        // 不是陌生人
        var iSstranger = false
        sessionStorage.setItem("stranger", JSON.stringify({ iSstranger }));
        this.$store.commit('changeStronger', false)
        this.logining = false
        // loginLoading.close()
        this.$router.push({ path: "/" })  // 去主页
        console.log('ABC的');
        this.$message({
          message: '晚上好，小宝贝',
          type: 'success',
          duration: 3 * 1000
        })

      }).catch((error) => {
        console.log(error)
        if (error.response) {
          this.$message({
            message: error.response.data.errorMsg || '用户名或密码错误，登录失败',
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).finally(() => {
        this.logining = false
        // loginLoading.close()
      })
    }





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
  min-width: 1420px;
  padding-bottom: 80px;
}
.coverImgurl {
  width: 50px;
  height: 50px;
}

.playListTitle {
  display: flex;
  justify-content: center;
}
.logbox {
  width: 500px;
  height: 300px;
  border: 1px solid red;
  padding: 20px 20px;
}
/* 登录 */
.logform {
  margin: 10px auto;
}
.common {
  margin-bottom: 20px;
}
.submit {
  text-align: center;
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
  border-right: 1px solid #ccc;
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
</style>
