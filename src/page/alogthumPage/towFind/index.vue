<template>
  <div class="songs-container">
    <div>
      <div>
        <div class="songsList">
          <h1>二分查找</h1>
          <div class="block">
            <div class="playControl">
              <div class="iconClass">
                <i class="el-icon-caret-left"></i>
              </div>

              <div class="iconClass">
                <i class="el-icon-video-pause"></i>
              </div>

              <div class="iconClass">
                <i class="el-icon-caret-right"></i>
              </div>

            </div>
            <div class="navBar">
              <el-slider v-model="value3" :show-tooltip="false"></el-slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// import testMd from "@/alogthum/dp/1.md"

export default {
  name: 'towFind',
  components: {
    // testMd
  },
  data () {
    return {
      singInformation: "",
      value3: '35',
      name: '动态规划算法练习',
      tableloading: false
    };
  },
  created () {
    //  this.value = testMd
  },
  methods: {
  }
};
</script>

<style scoped>
.block {
  display: flex;
}
.playControl {
  vertical-align: bottom;
  display: flex;
}
.navBar {
  width: 100%;
}
.iconClass {
  font-size: 35px;
  /* line-height: 5px; */
}
.mdText {
  background-color: #333;
  color: white;
}
.markdown-body {
  background-color: #333;
  color: darkgoldenrod;
}

/* markdown 高亮 */
.hljs-name {
  color: #22863a;
}
.hljs-attr {
  color: #6f42c1;
}
.hljs-keyword {
  color: red;
}
.hljs-string {
  color: #032f62;
}
</style>
