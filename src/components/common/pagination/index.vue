<template>
  <div class="page-bar">
    <el-pagination
      :base-url="url"
      :small="false"
      :current-page="params.pageNum"
      :page-sizes="pageSizeList"
      :page-size="params.pageSize"
      :total="totalPage"
      :url="api"
      :method="method"
      :param="defaultParameters"
      :layout="layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'PageCommon',
  props: {
    pageSizeList: {
      type: Array,
      default: function() {
        return [10, 20, 50, 100]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    url: {
      type: String,
      default: ''
    },
    api: {
      type: String,
      default: ''
    },
    method: {
      type: String,
      default: 'get'
    },
    defaultParameters: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      params: {
        pageSize: 10,
        pageNum: 1
      },
      totalPage: 0
    }
  },
  created() {
    if (this.pageSizeList && this.pageSizeList.length > 0) {
      this.params.pageSize = this.pageSizeList[0]
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    removeEmptyParmas(parmas) {
      for (const k in parmas) {
        if (parmas[k] === null || parmas[k] === '' || parmas[k] === {} || parmas === []) {
          delete parmas[k]
        }
      }
      return parmas
    },
    // 处理请求来的数据
    processing(data) {
      const list = data.data.data
      this.totalPage = list.total
      // 如果后端传回list为无数据时, 但返回格式不为[],而为null,则转换为[]
      if (!list.list) {
        list.list = []
      }
      list.list.map(item => {
        for (var k in item) {
          if (item[k] === '' || item[k] === null) {
            item[k] = ''
          }
        }
      })
      this.$emit('query', list.list)
    },
    // 请求数据
    async getList(item, reset) {
      // 追加参数
      for (var k in item) {
        if (!item[k]) {
          delete item[k]
        }
      }
      if (item) {
        const params = { pageSize: this.params.pageSize }
        this.params = { ...this.defaultParameters, ...params, ...item }
      } else {
        this.params = { ...this.defaultParameters, ...this.params, ...item }
      }
      if (!this.params.pageNum) {
        this.params['pageNum'] = 1
      }
      for (const k in this.params) {
        if (this.params[k] === 'all') {
          this.params[k] = null
        }
      }
      // 修改基础地址
      const url = this.url ? this.url : ''
      // loading动画&获取数据
      this.$emit('loading', true)
      // 带参请求
      if (!reset) {
        try {
          let data
          if (this.method === 'get') {
            const CopyParams = JSON.parse(JSON.stringify(this.params))
            const param = this.removeEmptyParmas(CopyParams)
            data = await this.$axios[this.method](url + this.api, params)
          } else {
            data = await this.$axios[this.method](url + this.api, this.params)
          }
          if (data.data.code !== '0') {
            this.$notify({
              title: '提示',
              message: data.data.msg,
              duration: 2000
            })
            data = {
              data: {
                data: {
                  total: 0,
                  list: []
                }
              }
            }
          }
          this.processing(data)
        } catch (e) {
          console.log(e)
        } finally {
          this.$emit('loading', false)
        }
      }

      // 无参请求
      if (reset) {
        try {
          let data
          if (this.method === 'get') {
            data = this.$axios[this.method](url + this.api, {
              params: {
                pageSize: this.params.pageSize,
                pageNum: this.params.pageNum
              }
            })
          } else {
            data = this.$axios[this.method](url + this.api, {
              pageSize: this.params.pageSize,
              pageNum: this.params.pageNum
            })
          }
          if (data.data.code !== '0') {
            this.$notify({
              title: '提示',
              message: data.data.msg,
              duration: 2000
            })
            data = {
              data: {
                data: {
                  total: 0,
                  list: []
                }
              }
            }
          }
          this.processing(data)
        } finally {
          this.$emit('loading', false)
        }
      }
    },
    // 翻页
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getList()
    },
    // 设置每页显示的条数
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getList()
    }
  }
}
</script>

<style scoped>
  .page-bar {
    margin-top: 20px;
    text-align: right;
  }
  .el-pagination {
    white-space: normal;
  }
</style>
