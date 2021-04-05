<template>
  <div class="playListCatgary playListCatgarydashboard">
    <div class="dash-container">
      <div class="main-content">

        <div class="block1111">

          <div class="choose">
            <el-cascader v-model="value" :options="options" clearable @change="handleChange" placeholder="选择分类">
            </el-cascader>
          </div>
        </div>
        <div>
          <hr />
        </div>
        <div class="suggestion-sing">
          <div class="hot-sug">
            <ul class="sugImg">
              <li class="sug-sings" v-for="item in personData" :key="item.id" v-loading="loading"
                element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">
                <div class="sug-class" @click="goToPlayList(item.id);">
                  <img :src="item.coverImgUrl" alt="" />
                  <div class="desciptionClass">
                    <div> {{ item.name }} </div>
                    <div> by{{ item.creator }} </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>
        <div>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { get } from "@/utils/request";
import { getPlayListCatgary } from "@/api/getSingerDetail";
export default {
  data () {
    return {
      value: ['1', '全部'],
      options: [],
      loading: false
    };
  },
  created () {

  },
  mounted () {
    this.getType()
  },
  computed: {
    ...mapState({
      personData: state => state.myTest.playListData
    })
  },
  filters: {
    transform (value) {
      return value[1]
    }

  },
  methods: {

    // 获取歌单列表
    goToPlayList (sId) {
      // 解决歌单页面跳转无法请求得问题
      this.$store.commit("changePlayListId", sId);
      this.$router.push({
        name: "playlist",
        params: {
          id: sId
        }
      });
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    getType () {

      get('api/playlist/catlist').then(res => {

        var categories = res.data.categories
        var sub = res.data.sub
        this.dataFilter(categories, sub)
      })
    },
    dataFilter (categories, sub) {

      // 风格过滤
      for (const key in categories) {
        if (Object.hasOwnProperty.call(categories, key)) {
          var obj = {}
          obj['value'] = key
          obj['label'] = categories[key]
          this.options.push(obj)
        }
      }
      var options = this.options
      for (let i = 0; i < options.length; i++) {
        var item = options[i]
        item['children'] = []
        for (let j = 0; j < sub.length; j++) {
          var cat = sub[j]
          if (cat.category == item.value) {
            item['children'].push({
              value: cat.name,
              label: cat.name
            })
          }
        }

      }
    },
    // 重新获取分类歌曲
    handleChange (tag) {
      this.loading = true
      this.handleClick(tag[1])
    },
    //  获取歌单类型
    handleClick (type) {

      this.getTagInfo(type)
    },
    // 获取标签的歌单
    getTagInfo (tag) {
      getPlayListCatgary(50, tag, 50)
        .then(response => {

          var responseData = response.data.playlists
          var data = []
          // 对数据过滤一下，选取有用的就行
          for (let i = 0; i < responseData.length; i++) {

            var obj = {}
            var temp = responseData[i]
            obj['coverImgUrl'] = temp['coverImgUrl']
            obj['id'] = temp['id']
            obj['name'] = temp['name']
            obj['description'] = temp['description']
            obj['userId'] = temp['userId']
            obj['creator'] = temp['creator'].nickname
            data.push(obj)
          }
          // 跳转到分类歌单
          this.loading = false
          this.$store.commit('changePlayListCatgory', data)
        })
        .catch(e => {
          console.log(e);
        })
        .finally(e => {

          console.log(e);
        });
    },
  }
};
</script>
<style scoped>
ul {
  padding: 0;
  margin: 0;
}
.block1111 {
  margin-left: 155px;
}

.playListCatgary,
.dash-container {
  margin-top: 100px;
}

.playListCatgarydashboard {
  width: 100%;
  color: #fff;
  min-width: 1420px;
  margin-top: 75px;
}
.el-menu-demo {
  color: #fff;
}
.suggestion-title {
  height: 40px;
  padding: 0;
}

.main-content {
  width: 100%;
  height: auto;
  /* border: 1px solid #ccc; */
}
.suggestion-sing {
  margin: 0 20px;
  /* border: 1px solid #ccc; */
  height: 100%;
  float: left;
  overflow: scroll;
}

.hot-sug {
  width: 100%;
  margin-bottom: 15px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hot-sug ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sugImg {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.sugImg li {
  float: left;
  text-align: center;
  font-size: 10px;
}

.desciptionClass {
  text-align: center;
}

.sug-sings {
  height: 241px;
  /* border: 1px solid #000; */
  width: 18%;
  /* margin-left: 18px; */
  margin-bottom: 35px;
  cursor: pointer;
}
.sug-sings img {
  width: 80%;
  height: 220px;
}
.el-main {
  padding: 0;
  margin-top: -19px;
  padding: 0 150px;
}
.el-menu--horizontal > .el-menu-item {
  height: 40px;
  line-height: 40px;
}
.menu {
  padding-left: 300px;
  background-color: #c20c0c;
}
/* 新碟上架部分 */
.title {
  display: flex;
  justify-content: space-between;
  padding: 0px 5px;
}
.newAblum {
  color: #333;
  font-size: 20px;
  font-weight: bold;
}
.more {
  color: red;
  cursor: pointer;
}
.ablum-li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.img-li {
  width: 200px;
  height: 200px;
  list-style: none;

  margin-bottom: 5px;
}
.img-li img {
  width: 100%;
  height: 100%;
}
</style>
