<template>
  <div>
    <search-box
    :list-query="listQuery"
    :search-options="searchOptions"
    :orderUpdate="orderReturnUpdate"
    />
  </div>
</template>
<script>
import {orderReturnUpdate} from '../../api/order'
import SearchBox from '../../components/searchBox'
export default {
  name: 'OmsReturnGoods',
  components: {
    SearchBox
  },
  data(){
    return {
      listQuery: {
        returnNo: '', // 退货单号
        cancelStatus: [
          { value: 2, label: '全部取消'}
        ], // 退货单取取消状态
        returnStatus: [
          {value: 40, label: '已完成'},
          {value: 32, label: '已取消'}
        ], // 退货单状态
      },
      orderReturnUpdate: orderReturnUpdate,
      searchOptions:[
        {
          label: '退货单号:',
          rules:[
          {
            required: true,
            message: "请输入退货单号",
            trigger: "blur"
          }],
          prop: 'returnNo',type: 'returnNo',name: 'returnNo',
          placeholder: '请输入退货单号',
          proptype: 'input'
        },
        {
          label: '退货单取消状态:',
          rules: [],
          prop: 'cancelStatus',type: 'cancelStatus',name: 'cancelStatus',
          placeholder: '请输入退货单取消状态',
          proptype: 'select'
        },
        {
          label: '退货单状态:',
          rules: [],
          prop: 'returnStatus',type: 'returnStatus',name: 'returnStatus',
          placeholder: '请输入退货单状态',
          proptype: 'select'
        },
      ]
    }
  },
}
</script>
