<template>
  <div class="songs-container">
    <div>
      <div>
        <div class="songsList">
          <div v-loading="tableloading">
            <el-card class="markdown-body">
              <test-md class="code"></test-md>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import testMd from "@/alogthum/dp/1.md"

export default {
  name: 'dpAlgorithms',
  components:{
    testMd
  },
  data() {
    return {
      singInformation: "",
      value: '',
      name: '动态规划算法练习',
      tableloading: false
    };
  },
  created(){
    //  this.value = testMd
  },
  methods: {
  }
};
</script>

<style scoped>
.songsImg {
  width: 260px;
  height: 260px;
}
.songs-container {
  width: 100%;
  height: 100%;
}
.songs-title {
  display: flex;
  justify-content: space-around;
}
.description {
  margin-left: 10px;
}


.mdText{
  
  background-color: #333;
  color:white;
}
.markdown-body{
    background-color: #333;
    color: darkgoldenrod;
}


/* markdown 高亮 */
.hljs-name{
    color: #22863a;
}
.hljs-attr{
    color: #6f42c1;
}
.hljs-keyword{
    color: red;
}
.hljs-string{
    color: #032f62;
}

</style>
