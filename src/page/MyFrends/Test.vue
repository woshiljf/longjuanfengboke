<template>
  <div class="box">
    <h1>我是一个BOX+==={{ value }}</h1>
    <button @click="fn">点我</button>
  </div>
</template>

<script>
import { get } from "../../utils/request";
export default {
  data() {
    return {
      msg: "开不了口"
    };
  },
  props: {
    value: {
      type: String
    }
  },
  created() {},
  mounted() {
    this.$busEvent.$on("handleTest", msg => {
      console.log(msg);
    });
  },
  methods: {
    fn() {
      var params = {
        id: 156128
      };
      get("api/song/url", params).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style></style>
