<template>
  <div class="ODS-deliveryDetail">
    <el-container class="order-box ODSOrderDetailBox DeliveryDetail">
      <el-button v-preventReClick class="export-btn" type="primary" @click="exportWord">导出</el-button>
      <el-col :span="24" />
      <!-- // data接受传过来的集合内容, options设定当前每一个字段对应展示的label, key:设定的label,对应集合中的什么字段., -->
      <detail-view :options="detailOptions" :data="baseText" />
      <!-- 详情组件搜索 -->
      <detail-search
        @searchData="search"
      />
      <!-- 列表表格 -->
      <table-common v-loading="loading" v-if="flag" :height="360" :table-header="deliveryDetailtableHeader" :change-cell="[9]" :change-cell-color="'red'" :table-data="tableData" class="del" @getSortList="getSortMethod" />
      <!-- 分页器 -->
      <page-common
        ref="page"
        :page-size-list="[50, 100]"
        :api="`/bff/api/v1/dispatch/details/_page?billNo=${encodeURI(this.$route.params.id)}`"
        method="post"
        @query="query"
        @loading="load"
      />
    </el-container>
  </div>

</template>

<script>
import PageCommon from '@/components/PageCommon'
import TableCommon from '@/components/TableCommon'
import detailView from '@/components/detailView'
import TableText from '@/textResources/tableText'
import detailText from '@/textResources/detail'
import DetailSearch from './DetailSearch'
// import moment from 'moment'
export default {
  name: 'DeliveryDetail',
  components: {
    PageCommon, // 分页器组件
    TableCommon, // 表格组件
    detailView, // 详情组件
    DetailSearch // 搜索组件
  },
  data() {
    return {
      detailOptions: detailText.deliveryOptions, // 详情组件选项参数
      deliveryDetailtableHeader: TableText.deliveryDetailtableHeader, // 表格组件选项参数
      tableData: [], // 表格数组
      flag: false, // 控制表格显示变量
      baseText: {}, // 详情数据来源变量
      defaultExportOptions: { // 默认导出变量
        url: '/bff/api/v1/dispatch/_export', // 导出地址
        data: {
          billNoList: [this.$route.params.id] // 导出参数
        },
        method: 'post', // 导出方法
        hasParams: true // 导出参数是否存在
      },
      loading: false // 加载动画变量
    }
  },
  async created() {
    if (sessionStorage.getItem('urlName') !== 'ODS管理-发货单详情页面') {
      window._paq.push(['setDocumentTitle', 'ODS管理-发货单详情页面'])
      window._paq.push(['trackPageView'])
      sessionStorage.setItem('urlName', 'ODS管理-发货单详情页面')
    }
    // 获取基本信息,发起请求。
    const id = this.$route.params.id
    // 获取详情
    const res = await this.$api.getDelivery(id)
    this.baseText = res.data.data
  },
  mounted() {
    this.flag = true
  },
  methods: {
    // 列表排序方法
    getSortMethod(column) {
      if (column.order) {
        console.log('点击触发排序,', column.order)
        const data = {
          orderByList: [{
            columnName: 'difference_amount',
            order: column.order
          }]
        }
        this.$refs.page.getList(data)
      }
    },
    // 导出
    exportWord() {
      const params = this.defaultExportOptions
      this.$axios({
        method: params.method,
        url: params.url,
        data: params.data
        // responseType: 'blob'
      }).then(res => {
        if (res.data.code) {
          this.$notify({
            title: '错误',
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return
        }
        const blob = new Blob(['\ufeff' + res.data], { type: 'text/csv;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '发货单导出数据表.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    // 查询方法：查询方法是绑定在pagecommon组件
    search(params) {
      this.$refs.page.getList(params)
    },
    // 获取列表数据，pagecommon组件上的查询方法。首次渲染调用
    query(data) {
      this.tableData = data
    },
    // 加载动画
    load(status) {
      this.loading = status
    }
  }
}
</script>
