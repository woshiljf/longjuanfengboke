<template>
  <div>
    <search-box
    :list-query="listQuery"
    :search-options="searchOptions"
    :orderUpdate="orderUpdate"
    />
  </div>
</template>
<script>
import {orderUpdate} from '../../api/order'
import SearchBox from '../../components/searchBox'
export default {
  components: {
    SearchBox
  },
  data(){
    return {
      listQuery: {
        // OMS订单取消状态12
        cancelStatus: [{
          value: 2,
          label: '全部取消'
        }, {
          value: 39,
          label: '取消失败'
        }], 
         // OMS订单状态
        orderStatus: [{
          value: 6,
          label: '已审核'
        }, {
          value: 8,
          label: '占库中'
        },{
          value: 40,
          label: '已完成'
        }, {
          value: 32,
          label: '已取消'
        }],
        // 是否缺货标志
        stockout: [{
          value: 0,
          label: '否'
        },{
          value: 1,
          label: '是'
        }], 
        orderNo: '', //订单号
      },
      // 订单更新函数
      orderUpdate: orderUpdate,
      // 查询参数
      searchOptions:[
        {
          label: 'OMS订单号:',
          rules: [
          {
          required: true,
          message: "请输入订单号",
          trigger: "blur"
          }],
          prop: 'orderNo',type: 'orderNo',name: 'orderNo',
          placeholder: '请输入订单号',
          proptype: 'input'
        },
        {
          label: 'OMS订单取消状态:',
          rules: [],
          prop: 'cancelStatus',type: 'cancelStatus',name: 'cancelStatus',
          placeholder: '请输入OMS订单取消状态',
          proptype: 'select'
        },
        {
          label: '是否缺货标志:',
          rules: [],
          prop: 'stockout',type: 'stockout',name: 'stockout',
          placeholder: '是否缺货标志',
          proptype: 'select'
        },
        {
          label: 'OMS订单状态:',
          rules: [],
          prop: 'orderStatus',type: 'orderStatus',name: 'orderStatus',
          placeholder: '请输入订单状态',
          proptype: 'select'
        }
      ],
    }
  },
}
</script>
