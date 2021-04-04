	<template>
  <div class="mymusicPlay">
    <audio :src="musicUrl" autoplay class="playMusicAudio" ref="audio" @canplay="getDuration"
      @timeupdate="durationUpdate"></audio>

    <div id="audioFunc">

      <div class="block">
        <!-- 播放控制 -->
        <div class="playControl">
          <div class="iconClass">
            <i class="el-icon-caret-left" @click="playPre"></i>
          </div>
          <!-- 停止 等于号-->
          <div v-show="isPlaying" class="iconClass1 iconClass" @click="pauseSong">
            <i class="el-icon-video-pause"></i>
          </div>
          <!-- 播放 三角形 -->
          <div v-show="!isPlaying" class="iconClass1 iconClass" @click="playSong">
            <i class="el-icon-video-play"></i>
          </div>

          <div class="iconClass">
            <i class="el-icon-caret-right" @click="playNext"></i>
          </div>

          <div class="imgsing iconClass">
            <el-tooltip class="item" effect="dark" content="歌曲详情" placement="top">
              <i class="el-icon-s-grid" @click="getSingDetail"></i>
            </el-tooltip>

          </div>
          <!-- 
          <div class="loadingClass imgsing iconClass">

            <i class="el-icon-loading"></i>

          </div> -->

        </div>

        <div class="navBar ">
          <el-slider id="sildbar" style="color： red" v-model="musicDuration" :max="musicAllDuration"
            :show-tooltip="false" @change="changeMusicDuration" @mousedown.native="isChange = true"
            @mouseup.native="isChange = false">
          </el-slider>
          <!-- 时间刻度 -->
        </div>
        <div class="timeShow">
          <span style="color:white">{{musicDuration | formatDate(musicDuration)}}</span>
          <span>/</span>
          <span style="color:white">{{musicAllDuration | formatDate(musicAllDuration)}}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { get } from '../../../utils/request'
import { mapState } from "vuex";
export default {
  name: 'musicPlay',
  props: {
    musicUrl: String
  },
  data () {
    return {
      // 判断当前是否在播放
      isPlaying: false,
      //判断播放顺序模式
      playOrd: 0,
      //歌曲总时长
      musicAllDuration: 0,
      // 歌曲当前时长
      musicDuration: 0,
      //判断是否被拖动
      isChange: false,
      value3: 35,
      flag: true,
      playbar: true,
      params: { id: 0 },
      msg: "效果",
      count: 0
    }
  },
  filters: {
    formatDate: function (time) {
      if (Object.is(time) == NaN) return
      var m = parseInt(time / 60)

      var s = parseInt(time % 60)
      m = m >= 10 ? m : '0' + m
      s = s >= 10 ? s : '0' + s
      return m + ":" + s;
    }
  },

  computed: {
    ...mapState({
      playIndex: state => state.myTest.playButtonIndex,
      showOrHidden: state => state.myTest.playbarshowOrHidden,
      singId: state => state.myTest.singId,
    })
  },
  methods: {
    // 播放音乐
    playSong () {
      if (!this.musicUrl) {
        const h = this.$createElement;
        this.$message.error({
          message: h('p', null, [
            h('span', null, '列表中没有可播放的歌曲'),
            h('i', {
              style: 'color: red'
            }, '')
          ]),
          offset: 280,
          center: true,
          showClose: true
        });
        return
      }
      this.isPlaying = true
      this.$refs.audio.play()
    },
    // 暂停音乐
    pauseSong () {
      this.isPlaying = false
      this.$refs.audio.pause()
    },
    //变化播放模式
    changeOrd () {
      if (this.playOrd === 3) return this.playOrd = 0
      this.playOrd++
    },
    //获得播放歌曲总时长
    getDuration () {
      this.musicAllDuration = this.$refs.audio.duration
    },
    //更新当前时长
    durationUpdate () {

      if (this.isChange === true) return

      this.musicDuration = this.$refs.audio.currentTime
      // 歌曲时长大于总时长，播放下一首
      if (this.musicDuration >= this.musicAllDuration && this.musicDuration !== 0) {

        this.playNext()
      }

    },
    //鼠标拖拽松开时
    changeMusicDuration () {
      if (this.musicAllDuration === 0) return
      this.$refs.audio.currentTime = this.musicDuration
      this.isChange = false
    },

    getSingDetail () {
      // 防止多次点击
      if (location.hash == '#/playsing') return

      this.$router.push({
        name: 'singInfo',
        params: {
          id: this.singId
        }
      })
    },
    // 播放控制在这里
    playbarHandle () {
      this.$store.commit('changeShowOrHidden', false)
    },
    // 播放下一首
    playNext () {
      // console.log('执行了吗');
      // 获取当前歌单的播放列表
      this.isPlaying = false

      this.getPlayId(1)
      //播放歌曲

      var playI = this.playIndex
      this.$store.commit('changePlayButtonIndex', playI + 1)

      this.nowPlayMuisc()
    },
    // 播放上一首
    playPre () {
      if (this.getPlayId(-1)) {
        this.isPlaying = false
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
        this.$store.commit('commitSingId', this.params.id)
        this.isPlaying = true
      })
    }

  },
}
</script>

<style lang="scss" scoped>
.mymusicPlay {
  .block {
    display: flex;
    justify-content: center;
    align-content: center;
  }
  .playControl {
    vertical-align: bottom;
    display: flex;
    cursor: pointer;
  }

  .loadingClass {
    position: absolute;
    top: 0;
    left: 10px;
  }
  .navBar {
    position: relative;
    width: 50%;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    padding-top: 5px;
    cursor: pointer;
    margin-right: 10px;
  }
  .iconClass {
    font-size: 40px;
    /* line-height: 5px; */
    margin-right: 15px;
    height: 80px;
  }
  .iconClass:hover {
    color: red;
  }
  .iconClass1 {
    border: 0;
  }
  .el-slider__bar {
    background-color: red;
  }
}
</style>

