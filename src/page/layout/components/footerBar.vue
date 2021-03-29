<template>
  <div class="container-header">

    <div class="playBar" v-show="showOrHidden">
      <div class="preplay">
        <el-button type="primary" @click="playPre">上一曲</el-button>
      </div>
      <div class="playaudio">
        <audio :src="nowplayurl" controls="controls" class="btnPlay audio" autoplay ref="audio"
          @ended.native="playPause()" loop>
          Your browser does not support the audio element.
        </audio>
      </div>
      <div class="nextplay">
        <el-button type="primary" @click="playNext">下一曲</el-button>
        <el-button type="primary" @click="playbarHandle">隐藏</el-button>

      </div>

    </div>

  </div>
</template>
<script>
import { get } from '../../../utils/request'
import { mapGetters, mapState } from "vuex";
export default {
  name: 'Head',
  components: {
    // Audio
  },
  data () {
    return {
      sysName: '网抑云音乐',
      flag: true,
      playbar: true,
      params: { id: 0 },
    }
  },
  props: {

    playmuisc: {
      type: Boolean,
      default: () => { return false }
    }


  },

  computed: {
    ...mapState({
      nowplayurl: state => state.myTest.playurl,
      playIndex: state => state.myTest.playButtonIndex,
      showOrHidden: state => state.myTest.playbarshowOrHidden,
    })
  },
  mounted () {

  },
  methods: {
    playPause () {
      console.log('播放结束')
    },
    playbarHandle () {
      this.$store.commit('changeShowOrHidden', false)
    },
    // 播放下一首
    playNext () {
      // 获取当前歌单的播放列表
      this.getPlayId(1)
      //播放歌曲
      var playI = this.playIndex
      this.$store.commit('changePlayButtonIndex', playI + 1)
      this.nowPlayMuisc()
    },
    // 播放上一首
    playPre () {
      if (this.getPlayId(-1)) {
        var playI = this.playIndex
        this.$store.commit('changePlayButtonIndex', playI - 1)
        this.nowPlayMuisc()

      }
      //播放歌曲
    },
    getPlayId (p) {
      var dataList = this.$store.state.myTest.playList

      var nowPlayId = this.$store.state.myTest.nowPlayId

      var index = dataList.indexOf(nowPlayId)  //得到当前的播放index
      if (index + p <= dataList.length - 1 && index + p >= 0) {
        console.log('index-p', index + p);
        this.params.id = dataList[index + p]
        this.$store.commit('changeNowPlayId', this.params.id)
        return true
      } else if (index + p > dataList.length) {
        this.$message({
          message: '到头了哥。。。',
          type: 'warning'
        })
        return false
      }
      else if (index + p < 0) {
        this.$message({
          message: '到顶了哥。。。',
          type: 'warning'
        })
        return false
      }
    },
    //获取音乐播放链接
    nowPlayMuisc () {
      get('api/song/url', this.params).then(res => {
        this.index = ''
        var url = res.data.data[0].url
        if (url !== null) {
          this.$store.commit('changePlayurl', url)
        } else {
          this.$message({
            message: '穷人听不起，要会员的。。。',
            type: 'warning'
          });
        }
      }).catch(e => {
        console.log(e);
      }).finally(e => {
        this.$store.commit('changeNowPlayId', this.params.id)
      })
    }

  },



}
</script>
<style scoped>
.container-header {
  margin: 0;
  padding: 0;
}
.playBar {
  width: 100%;
  height: 80px;
  background-color: #333;
  position: fixed;
  bottom: 0;
  padding: 0;
  line-height: 80px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 5s;
}
.btnPlay {
  background-color: #fff;
  display: inline-block;
  margin: 5px 10px;
}
.playaudio {
  margin: 0 10px;
  padding-top: 35px;
}
</style>