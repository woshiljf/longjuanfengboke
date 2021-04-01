<template>
  <div class="footerBar container-header">

    <div class="playBar" v-show="showOrHidden">
      <!-- 歌曲播放组件 -->
      <play-bar :musicUrl="nowplayurl"></play-bar>
    </div>

  </div>
</template>
<script>
import playBar from './playBar'
import { mapState } from "vuex";
export default {
  name: 'Head',
  components: {
    // Audio
    playBar
  },
  PlayBara () {
    return {



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
      showOrHidden: state => state.myTest.playbarshowOrHidden,
    })
  },
  methods: {


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
  /* display: flex;
  justify-content: center;
  align-items: center; */
  transition: all 5s;
  padding: 0 200px;
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