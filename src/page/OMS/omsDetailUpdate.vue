<template>
  <div>
    <search-box
    :list-query="listQuery"
    :search-options="searchOptions"
    :orderUpdate="orderDetailUpdate"
    />
  </div>
</template>
<script>
import {orderDetailUpdate} from '../../api/order'
import SearchBox from '../../components/searchBox'
export default {
  name: 'OmsOrderDetailUpdate',
  components: {
    SearchBox
  },
  data(){
    return {
      listQuery: {
        id: '', //主键值
        balaPrice: '', // 结算价（单价)
        barCode: '', // 商品条码
        salePrice: '', // 平台销售价单价
      },
      orderDetailUpdate: orderDetailUpdate,
      // 搜索框参数
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
          label: '结算价(单价):',
          rules:[],
          prop: 'balaPrice',type: 'balaPrice',name: 'balaPrice',
          placeholder: '请输入结算价',
          proptype: 'input'
        },
        {
          label: '商品条码:',
          rules: [],
          prop: 'barCode',type: 'barCode',name: 'barCode',
          placeholder: '请输入商品条码',
          proptype: 'input'
        },
        {
          label: '销售价:',
          rules: [],
          prop: 'salePrice',type: 'salePrice',name: 'salePrice',
          placeholder: '请输入销售价',
          proptype: 'input'
        },
      ],
    }
  },

}
</script>
