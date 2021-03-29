<template>
  <div>
    <table-common v-loading="loading" ref="table" :height="100" :table-header="deliverytableHeader" :table-data="tableData" :change-cell="[12]" :change-cell-color="'red'" :table-button-width="150" :export-options="defaultExportOptions">
      <template slot="btn" slot-scope="scope">
        <el-button
          type="text"
          size="mini"
          @click="$router.push(`/ODS/DeliveryList/DeliveryDetail/${scope.rowData.row.billNo}`)">查看</el-button>
        <el-button
          :disabled="isDisable && currentBillNo ===scope.rowData.row.billNo "
          type="text"
          size="mini"
          @click="exportData(scope.rowData.row.billNo)">导出</el-button>
          <!-- 可以用循环自定义设置按键名称及个数 -->
      </template>
    </table-common>
  </div>
</template>
<script>
import TableCommon from '../components/TableCommon'
import TableText from '@/textResources/tableText'

export default {
  name: 'DeliveryTable',
  components: {
    TableCommon
  },
  props: {
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDisable: false, // 防重复点击控制变量
      deliverytableHeader: TableText.deliverytableHeader, // 表格表头项变量
      defaultExportOptions: { // 初始化默认导出参数
        url: '/bff/api/v1/dispatch/_export', // 导出接口
        data: {
          billNoList: [] // 导出传递参数
        },
        method: 'post', // 导出方法
        hasParams: true // 导出参数是否存在
      },
      currentBillNo: '',
      timeoutId: 0
    }
  },
  beforeDestroy() {
    // 清除计时器
    clearTimeout(this.timeoutId)
  },
  methods: {
    // 导出数据
    exportData(id) {
      // isDisable 防止多此点击
      this.currentBillNo = id
      this.isDisable = true
      var that = this
      this.$refs.table.Send(id, '发货导出数据表')
      this.timeoutId = setTimeout(() => {
        that.isDisable = false
      }, 2000)
    }
  }
}
</script>
