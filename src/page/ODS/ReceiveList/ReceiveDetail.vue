<template>
  <div class="ODS-receiverDetail">
    <el-container class="order-box ReceiveDetail">
      <el-button v-preventReClick class="export-btn" type="primary" @click="exportWord">导出</el-button>
      <!-- 详情组件 -->
      <detail-view :options="receiveOptions" :data="baseText" />
      <detail-search
        @searchData="search"
      />
      <!-- 表格组件 -->
      <table-common v-loading="loading" :height="360" :table-header="receiveDetailtableHeader" :change-cell="[8]" :change-cell-color="'red'" :table-data="tableData" @getSortList="getSortMethod"/>
      <!-- 分页组件 -->
      <page-common
        ref="page"
        :page-size-list="[50, 100]"
        :default-parameters="params"
        :api="`/bff/api/v1/receive/details?billNo=${encodeURI(this.$route.params.id)}`"
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
import TableText from '@/textResources/tableText'
import detailText from '@/textResources/detail'
import detailView from '@/components/detailView'
import DetailSearch from './DetailSearch'
// import moment from 'moment'
export default {
  name: 'ReceiveDetail',
  components: {
    PageCommon, // 分页组件
    TableCommon, // 表格组件
    detailView, // 详情组件
    DetailSearch // 详情搜索组件
  },
  data() {
    return {
      loading: false, // 加载动画变量
      receiveOptions: detailText.receiveOptions, // 详情组件选项变量
      receiveDetailtableHeader: TableText.receiveDetailtableHeader, // 表格组件选项变量
      tableData: [], // 表格数据来源
      baseText: {}, // 详情数据来源
      params: { // 默认参数
        columnName: ''
      }
    }
  },
  async created() {
    if (sessionStorage.getItem('urlName') !== 'ODS管理-收货单详情页面') {
      window._paq.push(['setDocumentTitle', 'ODS管理-收货单详情页面'])
      window._paq.push(['trackPageView'])
      sessionStorage.setItem('urlName', 'ODS管理-收货单详情页面')
    }
    // 获取基本信息
    const id = this.$route.params.id
    const res = await this.$api.getReceive(id)
    this.baseText = res.data.data
  },
  methods: {
    // 表格排序方法
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
    // 查询: 方法在pagecommon组件
    search(params) {
      this.$refs.page.getList(params)
    },
    // 获取表格数据源
    query(data) {
      this.tableData = data
    },
    // 加载动画
    load(status) {
      this.loading = status
    },
    // 数据导出
    exportWord() {
      this.$axios({
        method: 'post',
        url: '/bff/api/v1/receive/_export',
        data: { billNoList: [this.$route.params.id] }
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
        // const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(res.data)
        // 通过创建a标签实现
        const link = document.createElement('a')
        link.href = url
        // 对下载的文件命名
        link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || '发货单导出数据表.csv'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    }
  }
}
</script>

