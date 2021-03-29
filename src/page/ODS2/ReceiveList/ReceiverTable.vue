<template>
  <div>
    <table-common v-loading="loading" ref="table" :height="150" :table-header="receivetableHeader" :change-cell="[12]" :change-cell-color="'red'" :table-data="tableData" :table-button-width="120" :export-options="defaultExportOptions" table-button>
      <template slot="btn" slot-scope="scope">
        <el-button
          type="text"
          size="mini"
          @click="$router.push(`/ODS/ReceiveList/ReceiveDetail/${scope.rowData.row.billNo}`)">查看</el-button>
        <el-button
          :disabled="isDisable && (currentBillNo === scope.rowData.row.billNo)"
          type="text"
          size="mini"
          @click="exportData(scope.rowData.row.billNo)">导出</el-button>
      </template>
    </table-common>
  </div>
</template>
<script>
import TableText from '@/textResources/tableText'
import TableCommon from '../components/TableCommon'
export default {
  name: 'ReceiverTable',
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
      defaultExportOptions: { // 默认导出变量
        url: '/bff/api/v1/receive/_export', // 导出地址
        data: { // 导出参数
          billNoList: ''
        },
        method: 'post', // 导出方法
        hasParams: true // 是否有导出参数
      },
      currentBillNo: '',
      receivetableHeader: TableText.receivetableHeader, // 表格表头选项变量
      isDisable: false,
      timeoutId: 0
    }
  },
  beforeDestroy() {
    // 清除计时器
    clearTimeout(this.timeoutId)
  },
  methods: {
    // 导出
    exportData(id) {
      // 防止重复点击
      this.currentBillNo = id
      this.isDisable = true
      var that = this
      this.$refs.table.Send(id, '收货单导出数据表')
      this.timeoutId = setTimeout(() => {
        that.isDisable = false
      }, 2000)
    }
  }
}
</script>
