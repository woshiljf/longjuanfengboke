<template>
  <div class="playListTable">

    <div class="comment-content" v-loading="comentLoading">
      <el-card class="box-card">

        <ul style="padding:0;margin:0">

          <li v-for="item in searchOut.songs" :key="item.id" class="singBox">

            <div class="singName">

              <span class="caret-right1" @click="playSong(item.id);" :loading="item.id === loadIndex">
                <i class="el-icon-caret-right caret-right"></i>
              </span>

              <span @click="gotoPlaySing(item.id)">{{item.name}}</span>

            </div>
            <div class="singerName">
              <span> {{item.artists[0].name}}</span>
            </div>
            <div class="singAlbum">
              <span>{{aleft}}</span> <span> {{item.album.name}}</span> <span>{{aright}}</span>
            </div>
            <div class="singTime">
              <span>{{item.duration |formMin(item.duration) }}</span>
            </div>

          </li>

        </ul>

      </el-card>
    </div>

  </div>
</template>

<script>
import { get } from "../../utils/request";
export default {

  data () {
    return {
      comentLoading: '',
      aleft: '《',
      aright: '》',
      loadIndex: ''
    }
  },

  props: {
    searchOut: {
      type: Object,
      default: () => {
        return {}
      }
    }
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

  methods: {
    gotoPlaySing (singId) {
      this.handleEdit(singId)
      this.$router.push(
        { name: 'singInfo', params: { id: singId } }
      )

    },

    playSong (singId) {
      this.loadIndex = singId
      this.handleEdit(singId)
      this.loadIndex = ''

    },


    // 听歌
    handleEdit (singId) {
      var params = {
        id: singId
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
        .finally(e => { });
    },


  }




}
</script>

<style scope>
.singBox {
  display: flex;
  justify-content: space-between;
  height: 50px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  line-height: 50px;
  cursor: pointer;
}

.singName:hover {
  text-decoration: underline;
}
.caret-right {
  width: 20px;
  height: 20px;
  display: inline-block;
  color: #333;
  border: 1px solid #333;
  text-align: center;
  line-height: 20px;
  border-radius: 50%;
}
.caret-right:hover {
  background-color: red;
  color: aliceblue;
}
</style>