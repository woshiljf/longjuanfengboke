<template>
  <div class="songs-container">
    <div>
      <div>
        <div class="songsList">
          <div>
            <h1>{{name}}</h1>
          </div>
          <hr style="color: red" />
          <div v-loading="tableloading">
            <el-card>
              <div style="display:inline-block;text-align:center">
                <p>小狗</p>
                <p></p>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'dpAlgorithms',
  data() {
    return {
      singInformation: "",
      index: "",
      name: '动态规划算法练习',
      tableloading: true
    };
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
</style>
