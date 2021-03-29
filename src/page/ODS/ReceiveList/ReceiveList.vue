<template>
  <div class="ODS-receiverList">
    <el-container class="order-box ODSReceiveBox">
      <el-col>
        <!-- 搜索组件 -->
        <receiver-search ref="receiverSearch" :delivery-time="deliveryTime" @searchData="search"/>
      </el-col>
      <!-- table组件 -->
      <receiver-table :loading="loading" :table-data="tableData"/>
      <!-- 分页器组件 -->
      <page-common
        ref="page"
        :page-size-list="[50, 100]"
        :default-parameters="deliveryTime"
        :hide-last="true"
        layout="total, sizes, prev, pager, next"
        api="/bff/api/v1/receive/_page"
        method="post"
        @query="query"
        @loading="load"
      />
    </el-container>
  </div>
</template>

<script>
import ReceiverTable from './ReceiverTable'
import ReceiverSearch from './ReceiverSearch'
import PageCommon from '@/components/PageCommon'
export default{
  name: 'ReceiveList',
  components: {
    PageCommon, // 分页组件
    ReceiverSearch, // 搜索组件
    ReceiverTable // 列表组件
  },
  data: function() {
    return {
      loading: false, // 加载动画
      deliveryTime: { // 初始化搜索变量
        fromCreateTime: '',
        toCreateTime: ''
      },
      tableData: [] // 表格数据来源
    }
  },
  mounted() {
    this.deliveryTime = {
      fromCreateTime: '',
      toCreateTime: ''
    }
  },
  methods: {
    // 搜索查询
    search(params) {
      // 发送请求列表数据请求
      this.$refs.page.getList(params)
    },
    // 获取表格数据
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

