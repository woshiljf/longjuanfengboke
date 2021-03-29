<template>
  <div>
    <home-play :target-id="id" :target-info="targetInfo"> </home-play>
  </div>
</template>

<script>
import { get } from "@/utils/request";
import {
  getSimPlayList,
  getSimPlaysings,
  submitComment
} from "@/api/listenSing";
import { getPlayListDetail, getRelatedPlayList } from "@/api/getSongsSheet";
import { mapState } from "vuex";
import HomePlay from "@/components/playSongDetail";
export default {
  name: "singInfo",
  components: {
    HomePlay
  },
  data () {
    return {
      id: this.$route.query.targetId,
      singComment: "",
      simiPlayList: "",
      simiPlaysongs: "",
      targetInfo: this.$route.query
    };
  },
  computed: {
    ...mapState({
      buttonIndex: state => state.myTest.playButtonIndex,
      playListId: state => state.myTest.playListId
    })
  },
  mounted () {
    this.getPlayInfo();
    this.userImg = JSON.parse(sessionStorage.getItem("userImage")).userImage
  },
  methods: {
    getPlayInfo () { },

    getsimiInfo () {
      var params = {
        id: this.$route.params.id
      };
      Promise.all([getSimPlayList(params), getSimPlaysings(params)]).then(
        res => {
          this.simiPlayList = res[0].data.playlists;
          this.simiPlaysongs = res[1].data.songs;
          console.log("simiPlayList", this.simiPlayList);
        }
      );
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
  }
};
</script>

<style scoped></style>
