<template>
  <div class="songs-container">
    <div>
      <div>
        <div class="songsList">
          <h1>二分查找</h1>
          <el-button type="primary" @click="getType">点我一下</el-button>
          <div class="block1111">
            <el-cascader v-model="value" :options="options" clearable @change="handleChange"></el-cascader>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get } from "@/utils/request";
export default {
  name: 'towFind',
  components: {
    // testMd
  },
  data () {
    return {
      value: [],
      options: []
    };
  },
  created () {
    //  this.value = testMd
  },
  methods: {
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
            var ran = Math.random()
            item['children'].push({
              value: cat.name,
              label: cat.name
            })
          }
        }

      }



    },
    handleChange (tag) {
      console.log(tag);
    }
  }
};
</script>

<style>
.block1111 {
  display: flex;
  width: 50%;
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
/* 修改面板 */
.el-cascader-menu:nth-child(2) .el-cascader-node {
  float: left !important;
}

.el-cascader-panel {
  width: 500px !important;
}
</style>
