<template>
  <div class="audioProgress">

    <div class="audio-controls">
      ![上一课]()
      <div v-if="!isPlay">
        ![播放]()
      </div>
      <div v-else-if="isPlay&&loading" class="loading-bg">
        <div class="loading-bar"></div>
      </div>
      <div v-else>
        ![暂停]()
      </div>
      ![下一课]()
    </div>
    <div class="progress-box">
      <div class="progressbar" @click="playMusic" ref="runfatbar">
        <div class="bluebar" ref="runbar" :style="{width:indicatorPosition}">
          <span class="tag" ref="tag" @mousedown.prevent="barDown" @touchstart.prevent="barDown">
            <i class="tag_inner"></i>
          </span>
        </div>
      </div>
      <div class="audio-time-box">
        <span class="curTime">{{ currentTime }}</span>
        <span class="durTime">{{ durationTime }}</span>
      </div>
    </div>

    <!-- 播放器资源 -->
    <audio @ended="handleAudioPlayEnded" @timeupdate="handleAudioTimeUpdated" @canplaythrough="hideLoading" preload
      @error="loadError" ref="audio">
      <source :src="audioSrc" type="audio/mp3" />
    </audio>
  </div>

</template>

<script>

export default {
  name: 'audio-paly',
  props: {
    audioSrc: {
      type: String,
      default: ''
    },
    disableUp: {
      type: Boolean,
      default: false
    },
    disableDown: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      // downBtn: [require('../assets/icons/audio_go.png'), require('../assets/icons/audio_go_b.png')],
      // upBtn: [require('../assets/icons/audio_back.png'), require('../assets/icons/audio_back_b.png')],
      // playBtn: [require('../assets/icons/audio_paly.png'), require('../assets/icons/audio_pause.png')],
      isPlay: false,
      currentTime: '00:00', // 已播放时间
      durationTime: '00:00', // 总播放时间,
      indicatorPosition: '0%',
      move: {
        status: false, // 是否可拖动
        startX: 0, // 记录最开始点击的X坐标
        left: 0 // 记录当前已经移动的距离
      },
      isLoading: false,
      loading: true
    }
  },
  watch: {
    "$route": 'handleRouterChange',
    "isPlay" (newVal) {
      if (newVal) this.$refs.audio.play()
      else this.$refs.audio.pause()
    },
    "audioSrc" (newVal) {
      if (this.$refs.audio && this.audioSrc.indexOf('.mp3') !== -1) {
        this.handleRouterChange()
      }
    }
  },
  mounted () {

  },
  methods: {
    // 播放/暂停
    onPlay () {
      if (this.audioSrc.indexOf('.mp3') !== -1) {
        if (this.isPlay) {
          this.isPlay = false
        } else {
          this.isPlay = true
        }

      }
    },
    // 播放结束
    handleAudioPlayEnded () {
      this.isPlay = false // 样式
    },
    // 播放时间格式化
    handleAudioTimeUpdated (e) {
      const { currentTime, duration } = e.target
      this.initialAudio(currentTime, duration)
    },
    //计算播放进度条进度
    initialAudio (currentTime, duration) {
      this.currentTime = audioFormat(currentTime)
      this.durationTime = audioFormat(duration)
      this.indicatorPosition = `${(currentTime / duration) * 100}%`
      let listenLoad = (currentTime / duration) * 100
      if (listenLoad > 0.1) {
        this.loading = false;
      }
    },
    // 路由变化,重置页面
    handleRouterChange () {
      const audio = this.$refs.audio
      this.loading = true;
      this.$nextTick(() => {
        if (this.audioSrc.indexOf('.mp3') === -1) {
          this.durationTime = audioFormat(0)
          this.indicatorPosition = `${0}%`
          return false
        }
        this.bindEvents();
        audio.load();
        audio.oncanplay = () => {
          this.durationTime = audioFormat(audio.duration)
          this.initialAudio(audio.currentTime, audio.duration)
        }
      })
    },
    // 拖拽
    // 添加绑定事件
    bindEvents () {
      const tag = this.$refs.tag
      tag.addEventListener('mousemove', this.barMove)
      tag.addEventListener('mouseup', this.barUp)

      tag.addEventListener('touchmove', this.barMove)
      tag.addEventListener('touchend', this.barUp)
    },
    // 移除绑定事件
    unbindEvents () {
      const tag = this.$refs.tag
      tag.addEventListener('mousemove', this.barMove)
      tag.addEventListener('mouseup', this.barUp)

      tag.removeEventListener('touchmove', this.barMove)
      tag.removeEventListener('touchend', this.barUp)
    },
    // 点击事件
    playMusic (e) {
      let rect = this.$refs.runfatbar.getBoundingClientRect()
      let offsetWidth = Math.min(
        this.$refs.runfatbar.clientWidth,
        Math.max(0, e.clientX - rect.left)
      )
      if (this.audioSrc.indexOf('.mp3') !== -1) {
        this.isPlay = true
        this.moveSilde(offsetWidth)
        this.commitPercent()
      }
    },
    // 鼠标按下事件
    barDown (e) {
      this.move.status = true;
      this.move.startX = e.clientX || e.touches[0].pageX;
      this.move.left = this.$refs.runbar.clientWidth;
    },
    // 鼠标/触摸移动事件
    barMove (e) {
      if (!this.move.status) {
        return false
      }
      let endX = e.clientX || e.targetTouches[0].pageX // 获得触摸拖动的坐标
      let dist = endX - this.move.startX // 触摸拖动的距离
      let offsetWidth = Math.min(
        this.$refs.runfatbar.clientWidth,
        Math.max(0, this.move.left + dist)
      )
      this.moveSilde(offsetWidth)
      this.commitPercent()
      this.isPlay = true
    },
    // 鼠标/触摸释放事件
    barUp (e) {
      e.stopPropagation()
      this.move.status = false
      this.commitPercent()
      this.isPlay = true // 根据播放时间开始播放
    },
    // 进度
    moveSilde (offsetWidth) {
      if (this.$refs.runbar) {
        this.$refs.runbar.style.width = `${offsetWidth}px`
      }
    },
    // 修改播放时间
    commitPercent () {
      const audio = this.$refs.audio // 音频所在对象
      let lineWidth = this.$refs.runfatbar.clientWidth// 底部进度条总宽
      let percent = this.$refs.runbar.clientWidth / lineWidth// 计算进度条所在比例宽度
      let changeTime = audio.duration * percent
      audio.currentTime = changeTime
    },
    loadError (e) {
      console.log("加载错误");
    },
    hideLoading (e) {
      // this.$refs.audio.play()
    }
  }
}
</script>

<style scoped>
.progress-box {
  width: 7.1rem;
  margin: 0.4rem auto 0.3rem;
}
.progressbar {
  width: 6.5rem;
  height: 0.06rem;
  background-color: #aaaaaa;
  border-radius: 0.03rem;
  margin: 0 auto;
}
.audio-time-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.24rem;
  color: #2e2e2e;
  margin-top: 0.15rem;
  position: relative;
}
.bluebar {
  height: 0.06rem;
  width: 0;
  background-color: #ffcb29;
  border-radius: 0.03rem;
  position: relative;
}
.tag {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.tag_inner {
  width: 0.2rem;
  height: 0.2rem;
  border-radius: 50%;
  display: block;
  background-color: #ffcb29;
  box-shadow: 0px 0px 0.15rem #ffcb29;
}
.audio-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0.3rem;
}
.btn-back,
.btn-go {
  width: 0.88rem;
  padding: 0.3rem;
  cursor: pointer;
}
.btn-back.disable,
.btn-go.disable {
  pointer-events: none;
}
.btn-play {
  cursor: pointer;
  width: 1.1rem;
  margin: 0 0.3rem;
}
.loading-bg .btn-play {
  padding: 0.25rem;
}
.loading-bg {
  width: 1.7rem;
  height: 1.1rem;
  background: url("../assets/icons/loading_bg.png") no-repeat center center;
  background-size: auto 100%;
  position: relative;
}
.loading-bg .loading-bar {
  width: 0.5rem;
  height: 0.5rem;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: url("../assets/icons/loading2.png") no-repeat center center;
  background-size: contain;
  animation: loading 2s ease-in-out 0ms infinite normal;
}
@keyframes loading {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
