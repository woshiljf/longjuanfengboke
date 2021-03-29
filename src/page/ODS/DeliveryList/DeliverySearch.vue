<template>
  <div>
    <el-col>
      <!-- 查询条件搜索框部分 -->
      <search-bar
        ref="sh"
        :options="deliveryListOptions"
        :width-px="120"
        :options-copy="optionsCopy"
        @search="search"/>
    </el-col>
  </div>
</template>
<script>
import SearchBar from '../components/SearchBar'
import searchBarOptions from '@/textResources/searchBarOptions'
import { getNewTime } from '@/textResources/searchBarOptions'
// import moment from 'moment'
export default {
  name: 'DeliverySearch',
  components: {
    SearchBar
  },
  props: {
    deliveryTime: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      optionsCopy: [], // 多选框来源数据变量
      deliveryListOptions: searchBarOptions.deliveryListOptions, // 搜索框选项变量
      moment: moment
    }
  },
  async created() {
    // 刷新最新默认时间
    getNewTime()
    if (sessionStorage.getItem('urlName') !== 'ODS管理-发货单列表页面') {
      window._paq.push(['setDocumentTitle', 'ODS管理-发货单列表页面'])
      window._paq.push(['trackPageView'])
      sessionStorage.setItem('urlName', 'ODS管理-发货单列表页面')
    }
    this.deliveryTime.toCreateTime = this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    this.deliveryTime.fromCreateTime = this.moment(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)).format('YYYY-MM-DD HH:mm:ss')
    const params = ['dispatch_bill_status', 'dispatch_bill_biz_type', 'warehouse_type', 'receive_bill_status', 'receive_bil_biz_type']
    // 获取搜索栏字典数据信息
    const res = await this.$api.getMessage(params)
    const MessageArr = res.data.data
    // 处理字典数据格式,转换为可利用键值对格式
    MessageArr.map(item => {
      item.dictCodes.map(e => {
        e['value'] = e.dictCode
        e['label'] = e.dictValue
      })
    })
    // 对搜索框选项进行添加下拉选项
    this.deliveryListOptions[1].options = MessageArr.filter(item => item.typeCode === 'dispatch_bill_status')[0].dictCodes
    this.deliveryListOptions[5].options = MessageArr.filter(item => item.typeCode === 'dispatch_bill_biz_type')[0].dictCodes
    // 获取客商信息
    const customerData = await this.$api.getCustorm()
    customerData.data.data.map(item => {
      item['label'] = item.vendCustName
      item['value'] = item.vendCustCode
    })
    // 对客商搜索框进行赋值
    this.deliveryListOptions[4].options = customerData.data.data
    // 将原始数据保存便于清空选项时返回数据信息
    this.optionsCopy = customerData.data.data
  },
  methods: {
    // 搜索查询方法
    search(params) {
      // ODS迭代自测流程参数正常,查询条件参数正常,
      // 如果选择创建时间,则拆份为开始与结束时间,否则删除参数属性
      if (params.createTime) {
        params.toCreateTime = moment(params.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
        params.fromCreateTime = moment(params.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        delete params.createTime
      }
      // 如果选择发货时间,则拆份为开始与结束时间,否则删除参数属性, 该参数后台暂未提供查询服务
      if (params.deliveryTime) {
        params.toDeliveryTime = moment(params.deliveryTime[1]).format('YYYY-MM-DD HH:mm:ss')
        params.fromDeliveryTime = moment(params.deliveryTime[0]).format('YYYY-MM-DD HH:mm:ss')
        delete params.deliveryTime
      }
      // 去除参数属性为空的非必要传递属性
      for (var e in params) {
        if (params[e] === '') {
          delete params[e]
        } else if (typeof (params[e]) === 'string') {
          params[e] = params[e].trim()
        }
      }
      // 对仓库代码信息传递格式进行处理
      for (var k in params) {
        if (k === 'fromExternalWarehouseCodeList' || k === 'toExternalWarehouseCodeList') {
          const arr = []
          params[k].map(item => {
            arr.push(item.value)
          })
          params[k] = arr
        }
      }
      // 请求数据
      this.$emit('searchData', params)
    }
  }
}
</script>
