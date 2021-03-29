<template>
  <div class="receiverSearch">
    <search-bar
      ref="sh"
      :options="receiveListOptions"
      :width-px="120"
      :options-copy="optionsCopy"
      @search="searchList"/>
  </div>
</template>
<script>
import SearchBar from '../components/SearchBar'
import searchBarOptions from '@/textResources/searchBarOptions'
import { getNewTime } from '@/textResources/searchBarOptions'
import moment from 'moment'
export default {
  name: 'ReceiverSearch',
  components: { SearchBar },
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
      receiveListOptions: searchBarOptions.receiveListOptions, // 搜索框选项变量
      optionsCopy: [], // 多选数据来源
      moment: moment, // 时间插件, 处理时间格式
      MessageArr: ''

    }
  },
  async created() {
    // 刷新最新默认时间
    getNewTime()
    // pvuv信息传递
    if (sessionStorage.getItem('urlName') !== 'ODS管理-收货单列表页面') {
      window._paq.push(['setDocumentTitle', 'ODS管理-收货单列表页面'])
      window._paq.push(['trackPageView'])
      sessionStorage.setItem('urlName', 'ODS管理-收货单列表页面')
    }
    // 初始化参数请求
    this.deliveryTime.toCreateTime = this.moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    this.deliveryTime.fromCreateTime = this.moment(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)).format('YYYY-MM-DD HH:mm:ss')
    const params = ['dispatch_bill_status', 'dispatch_bill_biz_type', 'warehouse_type', 'receive_bill_status', 'receive_bil_biz_type']
    // 获取字典数据接口
    const res = await this.$api.getMessage(params)
    this.MessageArr = res.data.data
    // 字典数据格式处理
    this.MessageArr.map(item => {
      item.dictCodes.map(e => {
        e['value'] = e.dictCode
        e['label'] = e.dictValue
      })
    })
    // 对搜索框属性进行赋值
    this.receiveListOptions[1].options = this.MessageArr.filter(item => item.typeCode === 'receive_bill_status')[0].dictCodes
    this.receiveListOptions[5].options = this.MessageArr.filter(item => item.typeCode === 'receive_bil_biz_type')[0].dictCodes
    const customerData = await this.$api.getCustorm()
    console.log(customerData, '数组')
    // 客商信息处理
    customerData.data.data.map(item => {
      item['label'] = item.vendCustName
      item['value'] = item.vendCustCode
    })
    this.receiveListOptions[3].options = customerData.data.data
    this.optionsCopy = customerData.data.data
  },
  methods: {
    searchList(params) {
      // 处理空参及空格问题
      for (var e in params) {
        if (params[e] === '') {
          delete params[e]
        } else if (typeof (params[e]) === 'string') {
          params[e] = params[e].trim()
        }
      }
      // 提取过滤非必要数组集合属性
      for (var k in params) {
        if (k === 'fromExternalWarehouseCodeList' || k === 'toExternalWarehouseCodeList') {
          const arr = []
          params[k].map(item => {
            arr.push(item.value)
          })
          params[k] = arr
        }
      }
      // 如果创建时间有值, 那么拆份成开始时间和结束时间
      if (params.createTime) {
        params.toCreateTime = moment(params.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
        params.fromCreateTime = moment(params.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        delete params.createTime
      }
      // 如果收货时间有值, 那么拆分成开始时间和结束时间
      if (params.ReceiveTime) {
        params.toReceiveTime = moment(params.ReceiveTime[1]).format('YYYY-MM-DD HH:mm:ss')
        params.fromReceiveTime = moment(params.ReceiveTime[0]).format('YYYY-MM-DD HH:mm:ss')
        delete params.ReceiveTime
      }
      this.$emit('searchData', params)
      // this.$refs.page.getList(params)
    }
  }
}
</script>
