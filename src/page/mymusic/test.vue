<template>
  <div>
    <p>{{ geci }}</p>
  </div>
</template>

<script>
import { get } from "../../utils/request";
export default {
  data() {
    return {
      id: this.$route.params.id,
      geci: ""
    };
  },
  created() {},
  mathods: {
    getSingComments() {
      console.log("abc");
    },
    setLyc(lyricStr) {
      var lrc = new Lyric({
        onPlay: function(line, text) {
          // 歌词播放时的回调
          console.log(line, text); // line 是当前播放行
          // text 是当前播放的歌词
        },
        onSetLyric: function(lines) {
          // 监听歌词设置事件。当设置歌词时，歌词解析完毕会触发此回调。
          console.log(lines); // lines 是一个数组[{time,text}]，里面包含播放时间及对应的歌词文本。
        },
        offset: 150 // 歌词偏移时间单位毫秒, 默认 190 ms
      });

      lrc.setLyric(lyricStr); // 设置歌词，此处传入lrc文件的文本内容
      // 注意：设置歌词将自动暂停歌词播放
      lrc.play(30000); // 播放歌词，传入开始播放时间，30000是播放时间，单位：ms
      lrc.pause(); // 暂停播放歌词
    }
  },
  // 组件导航钩子

  beforeRouteEnter(to, from, next) {
    console.log("adfsfsdfsdf");
    next(vm => {
      console.log("歌曲id", vm.$route.params.id);
      var params = {
        id: vm.$route.params.id
      };
      get("api/lyric", params)
        .then(res => {
          console.log(res);
          vm.geci = res.data.lrc.lyric;
        })
        .catch(e => {
          console.log(e);
        })
        .finally(e => {});
    });
  }
};
</script>

<style></style>
