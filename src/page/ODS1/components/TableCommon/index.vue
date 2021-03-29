<template>
  <div class="ODS-table">
    <el-table
      ref="multipleTable"
      :data="tableList"
      :cell-style="changeCell ? changeCellStyle : ''"
      :height="`calc(100vh - ${height}px)`"
      :header-cell-style="{background: '#204060', color: 'white', padding: '6px 0'}"
      border
      size="small"
      tooltip-effect="dark"
      class="tableHeader">
      <el-table-column
        v-for="(item, index) in tableHeader"
        :prop="item.prop"
        :label="item.label"
        :show-overflow-tooltip="item.showOverFlowTooltip"
        :key="index"
        :fixed="item.fixed"
        :sortable="item.sort"
        :width="item.width || null"
        align="center">
        <template slot-scope="scope">
          <router-link v-if="item.link && (scope.row['bizType'] === 'B2B_RECEIVE' || scope.row['bizType'] === 'B2B_DISPATCH')" :to="{path: `${item.to}/${scope.row[item.prop]}`}" class="routerLink">{{ scope.row[item.prop] }}</router-link>
          <router-link v-else-if="item.link && (scope.row['bizType'] !== 'B2B_RECEIVE' || scope.row['bizType'] !== 'B2B_DISPATCH') && item.prop !== 'orderNo'" :to="{path: `${item.to}/${scope.row[item.prop]}`}" class="routerLink">{{ scope.row[item.prop] }}</router-link>
          <router-link v-else-if="item.link && (scope.row['bizType'] === 'ALLOCATE_RECEIVE' || scope.row['bizType'] === 'ALLOCATE_DISPATCH') && item.prop === 'orderNo'" :to="{path: `${item.to1}/${scope.row[item.prop]}`}" class="routerLink" >{{ scope.row[item.prop] }}</router-link>
          <span v-else class="span">{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="tableButton" :width="tableButtonWidth" fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <slot :rowData="scope" name="btn"/>
          <el-button
            v-if="hasChild"
            size="mini"
            type="danger"
            @click="removeOrder(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
export default {
  name: 'TableCommon',
  props: {
    tableHeader: {
      type: Array,
      default: function() {
        return []
      }
    },
    tableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    height: {
      type: Number,
      default: null
    },
    tableButtonWidth: {
      type: Number,
      default: 120
    },
    changeCell: {
      type: Array,
      default: function() {
        return []
      }
    },
    changeCellColor: {
      type: String,
      default: 'red'
    },
    changeCellType: {
      type: String,
      default: 'color'
    },
    exportOptions: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      multipleSelection: [],
      saveTable: [],
      tableList: this.tableData,
      hasChild: false,
      tableButton: true
    }
  },
  watch: {
    tableData: {
      handler(newVal) {
        this.tableList = newVal
        this.getData()
      },
      deep: true
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.tableList.map(item => {
        for (var k in item) {
          if (item[k] instanceof Array && item[k].length) {
            item['productIdList'] = item[k]
            delete item[k]
            this.hasChild = true
          }
        }
      })
      if (this.hasChild) {
        this.saveTable = this.tableList
        this.dealTable(this.tableList)
      }
    },
    // 发货差异颜色不同。
    changeCellStyle(data) {
      const arr = this.changeCell
      let color = ''
      if (this.changeCellColor && (data.row[data.column.property] === '是' || data.row[data.column.property] > 0)) {
        color = `${this.changeCellType}:` + this.changeCellColor
      }
      // 如果需要改变的是列的颜色, 传入changeCellType: background,   默认为color模式.
      for (let i = 0; i < arr.length; i++) {
        if (data.columnIndex === arr[i]) {
          return color
        }
      }
    },
    // 处理表格数据
    dealTable(table) {
      const getDate = [] // 存储新表格数据
      const typeIndex = [0] // 保存id,订单需要合并的值
      table.forEach((v, index) => {
        if (v.productIdList && v.productIdList.length) {
          v.productIdList.forEach((subV, i, typeData) => {
            if (i === typeData.length - 1) {
              typeIndex.push(typeData.length) // 类型循环完成后把数据长度存起来
            }
            for (var k in v) {
              if (k !== 'productIdList') {
                subV[k] = v[k]
              }
            }
            getDate.push(subV)
          })
        }
      })
      let t = 0
      typeIndex.forEach((v, i, typeArr) => {
        if (typeArr[i + 1]) {
          getDate[t].nameIndex = typeArr[i + 1]
          t += typeArr[i + 1]
        }
      })
      this.tableList = getDate
    },
    async Send(id, param) {
      // 提供导出传递参数
      this.exportOptions.data.billNoList = [id]
      await this.exportExcel(param)
    },
    // 导出单条数据
    exportExcel(param) {
      this.$nextTick(() => {
        const params = this.exportOptions
        let flag = true
        if (params.hasParams) {
          for (var k in params.data) {
            if (!params.data[k]) {
              flag = false
            }
          }
          if (!flag) {
            this.$notify({
              title: '错误',
              message: '请选择导出项',
              type: 'error',
              duration: 2000
            })
            return
          }
        }
        this.$axios({
          method: params.method,
          url: params.url,
          data: params.data
          // responseType: 'blob' // 这里注明一下, 如果导出EXCEL为[object blob]的话, 把这段responseType:'blob' 注释掉就行了.
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
          link.download = decodeURI(res.headers['content-disposition'].split('=')[1]) || param + '.csv'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        })
      })
    }
  }
}
</script>
