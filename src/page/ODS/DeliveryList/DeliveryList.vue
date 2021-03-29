<template>
  <div class="ODS-deliveryList">
    <el-container class="order-box ODSOrderBox">
      <delivery-search :delivery-time="deliveryTime" @searchData="search"/>
      <!-- 列表表格部分 -->
      <delivery-table :table-data="tableData" :loading="loading"/>
      <!-- 分页器部分 -->
      <page-common
        ref="page"
        :page-size-list="[50, 100]"
        :default-parameters="deliveryTime"
        :hide-last="true"
        layout="total, sizes, prev, pager, next"
        api="/bff/api/v1/dispatch/_page"
        method="post"
        @query="query"
        @loading="load"
      />
    </el-container>
  </div>
</template>

<script>
import DeliverySearch from './DeliverySearch'
import DeliveryTable from './DeliveryTable'
import PageCommon from '@/components/PageCommon'
export default{
  name: 'DeliveryList',
  components: {
    PageCommon, // 分页器组件
    DeliverySearch,
    DeliveryTable
  },
  data() {
    return {
      tableData: [], // 表格数组
      loading: false, // 加载动画变量
      deliveryTime: { // 初始化默认搜索参数
        fromCreateTime: '',
        toCreateTime: ''
      }
    }
  },
  mounted() {
    this.deliveryTime = {
      fromCreateTime: '',
      toCreateTime: ''
    }
  },
  methods: {
    // 搜索查询方法
    search(params) {
      this.$refs.page.getList(params)
    },
    // 获取列表数据
    query(data) {
      this.tableData = data
    },
    // 加载动画方法
    load(status) {
      this.loading = status
    }
  }
}
</script>
