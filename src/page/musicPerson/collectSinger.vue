<template>
  <div class="songs-container">
    <div>
      <div>
        <div class="songsList">
          <div>
            <h1>我的歌手（{{ singersSize }}）</h1>
          </div>
          <hr style="color: red" />
          <div v-loading="tableloading">
            <el-card
              class="box-card"
              v-for="item in collectsingers"
              :key="item.id"
            >
              <img
                :src="item.picUrl"
                alt=""
                style="width: 120px;height: 120px"
              />
              <div style="display:inline-block;text-align:center">
                <p>{{ item.name }}</p>
                <p>{{ item.albumSize }}个专辑</p>
              </div>
            </el-card>
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
      singInformation: "",
      index: "",
      singersSize: collectsingers.length
    };
  },
  props: {
    collectsingers: {
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

          console.log("大海沟", response);
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
</style>
