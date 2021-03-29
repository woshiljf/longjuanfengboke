<template>
  <div>
    <search-box
    :list-query="listQuery"
    :search-options="searchOptions"
    :orderUpdate="orderReturnDetailUpdate"
    />
  </div>
</template>
<script>
import {orderReturnDetailUpdate} from '../../api/order'
import SearchBox from '../../components/searchBox'
export default {
  name: 'OmsTaskStatusUpdate',
  components: {
    SearchBox
  },
  data(){
    return {
      listQuery: {
        id: '', //主键值
        barCode: '', // 商品条码
        productCode: '', // 商品货号
      },
      orderReturnDetailUpdate: orderReturnDetailUpdate,
      searchOptions:[
        {
          label: '主键值:',
          rules: [
          {
          required: true,
          message: "请输入主键值",
          trigger: "blur"
          }],
          prop: 'id',type: 'id',name: 'id',
          placeholder: '请输入主键值',
          proptype: 'input'
        },
        {
          label: '商品条码:',
          rules:[],
          prop: 'barCode',type: 'barCode',name: 'barCode',
          placeholder: '请输入商品条码',
          proptype: 'input'
        },
        {
          label: '商品货号:',
          rules: [],
          prop: 'productCode',type: 'productCode',name: 'productCode',
          placeholder: '请输入商品货号',
          proptype: 'input'
        }
      ]
    }
  },

}
</script>
