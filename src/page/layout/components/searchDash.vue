<template>
  <div style="min-height: 200px;border: 1px solid #ccc" class="outcome" v-show="isShow">
    <div class="come sing">
      <div class="left" style="width: 83px; border-right: 1px solid #ccc">
        <span>单曲</span>
      </div>
      <div class="right">
        <li v-for=" item in searchSongs" :key="item.id" class="singOne" style="list-style: none;padding: 5px 10px">

          <span style="color: red" @click="gotoPlaySing(item.id)">{{item.name}}</span>-
          <span v-for="s in item.artists" :key="s.id">
            {{s.name}}
          </span>
        </li>
      </div>
    </div>
    <!--  -->
    <div class="come singer">

      <div class="left" style="width: 83px; border-right: 1px solid #ccc">
        <span>歌手</span>
      </div>
      <div class="right">
        <p v-for=" item in searchArtists" :key="item.id">
          <span style="color: red">{{item.name}}</span>
        </p>
      </div>
    </div>
    <div class=" come album">
      <div class="left" style="width: 83px; border-right: 1px solid #ccc">
        <span>专辑</span>
      </div>
      <div class="right">
        <p v-for=" item in searchAlbums" :key="item.id">
          <span style="color: red">{{item.name}}</span>-
          <span style="color: red">{{item.artist.name}}</span>
        </p>
      </div>
    </div>

  </div>
</template>

<script>
import { get } from "@/utils/request";
import { mapGetters, mapState } from 'vuex'
export default {

  data () {
    return {
      msg: '',
      isShow: false
    }
  },
  props: {
    searchSongs: {
      type: Array,
      default: () => {
        return []
      }

    },

    searchArtists: {
      type: Array,
      default: () => {
        return []
      }

    },
    searchAlbums: {
      type: Array,
      default: () => {
        return []
      }

    }
  },

  computed: {
    ...mapState({
      SearchData: state => state.myTest.searchInfo
    })
  },
  watch: {
    SearchData: function (newV, oldV) {
      this.isShow = this.SearchData.isShow
    }
  },

  methods: {
    gotoPlaySing (singId) {
      this.$store.commit('commitSingId', singId)
      this.handleEdit(singId)
      this.$router.push(
        { name: 'singInfo', params: { id: singId } }
      )

    },

    playSong (singId) {
      this.loadIndex = singId
      this.handleEdit(singId)
      this.loadIndex = ''

    },


    // 听歌
    handleEdit (singId) {
      var params = {
        id: singId
      };
      // this.currentRow = row;
      // 修改当前的播放歌曲id
      this.$store.commit("changeShowOrHidden", true);
      get("api/song/url", params)
        .then(res => {
          this.index = "";
          var url = res.data.data[0].url;
          if (url !== null) {
            this.$store.commit("changePlayurl", url);
          } else {
            this.$message({
              message: "穷人听不起，要会员的。。。",
              type: "warning"
            });
          }
        })
        .catch(e => {
          console.log(e);
        })
        .finally(e => { });
    },
  }
}
</script>

<style scoped>
.outcome {
  width: 500px;
  position: absolute;
  background-color: #fff;
  left: 750px;
  z-index: 40;
  top: 75px;
  border-radius: 1%;
  color: black;
  /* box-shadow: 2px 8px 4px #888888 */
}
.come {
  display: flex;
  height: auto;
  border-bottom: 1px solid #ccc;
}
.right,
.left {
  margin-left: 5px;
  cursor: pointer;
}

.left {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
}
</style>