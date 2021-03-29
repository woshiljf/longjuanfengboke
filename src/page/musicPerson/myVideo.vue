<template>
  <div class="songs-container">
    <div>
      <div>
        <div class="songsList">
          <div>
            <h1>我的MV（{{ singersSize }}）</h1>
          </div>
          <hr style="color: red" />
          <div>
            <div v-loading="tableloading">
              <el-row :gutter="2">
                <el-col :span="8" v-for="item in collectvedio" :key="item.id">
                  <el-card shadow="always" class="box-card">
                    <img :src="item.coverUrl" alt="" style="height: 120px" />
                    <div style="display:inline-block">
                      <h3 class="title">
                        <router-link
                          :to="{ name: 'collectMv', params: { id: item.vid } }"
                        >
                          {{ item.title }}
                        </router-link>
                      </h3>
                      <h5 class="byusername">
                        By{{ item.creator[0].userName }}
                      </h5>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>

            <el-card> </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nowListenMusic } from "../../api/listenSing";
export default {
  data() {
    return {
      singersSize: 50
    };
  },
  props: {
    collectvedio: {
      type: Array,
      default: function() {
        return [];
      }
    },
    id: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    imgUrl: {
      type: String,
      default: () => {
        return "";
      }
    },
    songsDescription: {
      type: String,
      default: () => {
        return "";
      }
    },
    songsTitle: {
      type: String,
      default: () => {
        return "";
      }
    },
    tableloading: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  methods: {
    indexMethod(index) {
      return index * 1;
    },
    handleEdit(index, row) {
      this.index = index;
      nowListenMusic(row.id)
        .then(response => {
          this.index = "";
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {}
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
.box-card {
  height: 220px;
  cursor: pointer;
}
.title,
.byusername {
  margin: 5px;
  cursor: pointer;
}
.title:hover {
  text-decoration: underline;
}
.byusername {
  color: darkgray;
}
</style>
