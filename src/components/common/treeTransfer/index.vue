/*
*使用前提
第一步：安装组件
npm install el-tree-transfer --save
第二部:引入
import treeTransfer from 'el-tree-transfer'
*实现原理
樹形穿梭框,第一層的pid按index從0開始 ,依次1,2,3,4....即可, 核心在與子級中的pid的值為其父級id的值
後台請求數據只需保證id不重複,以及有用於顯示對應項名稱的label即可, 此組件內已使用遞歸為每一個層級的元素添加pid,
不需要後台傳入用於識別樹形的id或字段.

*使用声明
引用組件 傳入 options集合  options集合中,包含 title:字符串數組,長度為2,  用於設置兩個穿梭框的標題文本,

mode為字符串, 用於設置穿梭框的模式, 不傳默認為'tansfer'樹形結構, 'addressList' 為通訊錄模式,

暫不支持通訊錄模式, 因為還沒有對數據進行處理及判定

傳入API, 作为请求数据源信息的地址,返回参数需要有 children label属性

設置@add函數 接收向右添加選擇數據的結果, 返回四個參數,(fromData, toData, obj, arr)  , fromData為移動後數據源列表數據,
toData為移動後數據添加的目標列表的數據, obj為移动的节点keys、nodes、halfKeys、halfNodes对象. arr为移动后右侧数据添加
的目标列表的最终子节点的数组,(也就是说,该数组中的元素是没有children节点的子元素,其没有children属性)

设置@remove函数,接收数据添加的目标列表移除的数据,参数同@add

*其他功能: defaultCheckedKeys 属性对应默认选中,传入Data集合数组,作为已选择数组项,集合数组中必须有id属性,
对应fromData中的最终子元素节点的id,即可..,
*其他功能:defaultTransfer, 默认选中的穿梭一次.配合defaultCheckedKeys使用.
*/
<template>
  <div>
    <tree-transfer
      v-if="showT"
      :title="options.title"
      :from_data="fromData"
      :to_data="toData"
      :default-transfer="TransGet"
      :default-props="{label:'resourceName'}"
      :default-checked-keys="editData"
      :mode="options.mode"
      height="540px"
      filter
      open-all
      @addBtn="add"
      @removeBtn="remove"/>
  </div>
</template>

<script>
import treeTransfer from 'el-tree-transfer'

export default {
  name: 'TransferTree',
  components: { treeTransfer },
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    API: {
      type: String,
      default: ''
    },
    Data: {
      type: Array,
      default: () => []
    },
    deT: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      TransGet: false, // 当页面加载完成后,再将该值变为true,进行默认穿梭.
      showT: false,
      toData: [],
      fromData: [],
      editData: this.Data || []
      // checkedList: [  // 测试defaultCheckedKeys原理
      //   {
      //     id: 39,
      //     label: '12we'
      //   },
      //   {
      //     id: 40,
      //     label: '12we'
      //   },
      //   {
      //     id: 41,
      //     label: '12we'
      //   }
      // ]
    }
  },
  mounted() {
    // 由于在created阶段改变了数据,导致在有editData且ID有重复时,对数据进行处理后,树形穿梭框无法 获取到正确的已选择列表,
    // 所以使用延时,让整个树形框在数据处理完成后进行显示.
    const that = this
    setTimeout(function() {
      that.showT = true
      that.TransGet = true
    }, 1000)// 如依旧无法显示,可将延时时间加长,此处为当前使用测试最短时间.
    // this.$nextTick(() => { // 使用无法达到效果, 数据更新前后.
    //   that.showT = true
    // })
  },
  async created() {
    if (this.options.mode === 'addressList') {
      this.$message('暫時未對通訊錄模式數據進行處理')
    } else {
      // 当为树形模式下
      const res  = {"code":"0","msg":"请求成功","data":[{"id":1,"parentId":0,"resourceCode":"B2B_Transaction","resourceName":"B2B交易管理","remark":"B2B交易管理","type":"MENU","childNodes":[{"id":2,"parentId":1,"resourceCode":"B2B_Sales_List","resourceName":"B2B订单列表","remark":"B2B订单列表","type":"MENU","childNodes":[{"id":1105,"parentId":2,"resourceCode":"orderList","resourceName":"订单列表","remark":"订单列表","type":"LINK"},{"id":1106,"parentId":2,"resourceCode":"orderDetail","resourceName":"订单详情","remark":"订单详情","type":"LINK"},{"id":1107,"parentId":2,"resourceCode":"importOrder","resourceName":"导入订单","remark":"导入订单","type":"LINK"},{"id":1108,"parentId":2,"resourceCode":"importOrderDiscount","resourceName":"导入订单折扣","remark":"导入订单折扣","type":"LINK"},{"id":1109,"parentId":2,"resourceCode":"orderOccupyDetail","resourceName":"查看订单占库列表","remark":"查看订单占库列表","type":"LINK"},{"id":1110,"parentId":2,"resourceCode":"orderOccupyConfirm","resourceName":"订单占库确认修改","remark":"订单占库确认修改","type":"LINK"},{"id":1111,"parentId":2,"resourceCode":"orderOccupyExport","resourceName":"订单占库导出","remark":"订单占库导出","type":"LINK"},{"id":1112,"parentId":2,"resourceCode":"orderDetailBatchDelete","resourceName":"订单占库批量删除","remark":"订单占库批量删除","type":"LINK"},{"id":1113,"parentId":2,"resourceCode":"orderDeleteOrRecover","resourceName":"订单详情删除恢复","remark":"订单详情删除恢复","type":"LINK"},{"id":1114,"parentId":2,"resourceCode":"customerCodeCheck","resourceName":"客户代码校验","remark":"客户代码校验","type":"LINK"},{"id":1115,"parentId":2,"resourceCode":"orderInformation","resourceName":"订单详情信息","remark":"订单详情信息","type":"LINK"},{"id":1116,"parentId":2,"resourceCode":"orderConfirmReceipt","resourceName":"订单确认收款","remark":"订单确认收款","type":"LINK"},{"id":1117,"parentId":2,"resourceCode":"orderDispatchInfo","resourceName":"订单发货单信息","remark":"订单发货单信息","type":"LINK"},{"id":1118,"parentId":2,"resourceCode":"dispatchList","resourceName":"订单发货单列表","remark":"订单发货单列表","type":"LINK"},{"id":1119,"parentId":2,"resourceCode":"orderConfirmation","resourceName":"提交订单","remark":"提交订单","type":"LINK"},{"id":1120,"parentId":2,"resourceCode":"serviceApprove","resourceName":"确认订单","remark":"确认订单","type":"LINK"},{"id":1121,"parentId":2,"resourceCode":"serviceRefuse","resourceName":"拒绝订单","remark":"拒绝订单","type":"LINK"},{"id":1122,"parentId":2,"resourceCode":"createDispatch","resourceName":"提交发货单","remark":"提交发货单","type":"LINK"},{"id":1123,"parentId":2,"resourceCode":"dispatchApprove","resourceName":"同意发货","remark":"同意发货","type":"LINK"},{"id":1124,"parentId":2,"resourceCode":"dispatchRefuse","resourceName":"拒绝发货","remark":"拒绝发货","type":"LINK"},{"id":1125,"parentId":2,"resourceCode":"getDispatchSelectInfo","resourceName":"获取select信息","remark":"获取select信息","type":"LINK"},{"id":1126,"parentId":2,"resourceCode":"dispatchCancel","resourceName":"取消发货单","remark":"取消发货单","type":"LINK"},{"id":1127,"parentId":2,"resourceCode":"submitApproval","resourceName":"检验提交审核","remark":"检验提交审核","type":"LINK"},{"id":1128,"parentId":2,"resourceCode":"confirmSubmissionApproval","resourceName":"提交审核","remark":"提交审核","type":"LINK"},{"id":1129,"parentId":2,"resourceCode":"orderCancel","resourceName":"订单取消","remark":"订单取消","type":"LINK"},{"id":1136,"parentId":2,"resourceCode":"cumulativeState","resourceName":"订单占库结果","remark":"订单占库结果","type":"LINK"}]},{"id":3,"parentId":1,"resourceCode":"B2B_Return_List","resourceName":"B2B退货单列表","remark":"B2B退货单列表","type":"MENU"}]},{"id":50,"parentId":0,"resourceCode":"Online_Order_Manage","resourceName":"线上订单管理","remark":"线上订单管理","type":"MENU","childNodes":[{"id":52,"parentId":50,"resourceCode":"Transaction_List","resourceName":"交易单列表","remark":"交易单列表","type":"MENU","childNodes":[{"id":1138,"parentId":52,"resourceCode":"oosOrderListExport","resourceName":"OMS导出订单接口","remark":"OMS导出订单接口","type":"LINK"},{"id":1147,"parentId":52,"resourceCode":"channelInventoryPage","resourceName":"分页查询渠道库存接口","remark":"分页查询渠道库存接口","type":"LINK"}]},{"id":53,"parentId":50,"resourceCode":"After_Sale_Bill_List","resourceName":"售后单列表","remark":"售后单列表","type":"MENU","childNodes":[{"id":1139,"parentId":53,"resourceCode":"oosQueryRoList","resourceName":"售后单列表","remark":"售后单列表","type":"LINK"}]},{"id":54,"parentId":50,"resourceCode":"Transaction_Bill_Detail","resourceName":"交易单详情","remark":"交易单详情","type":"MENU","childNodes":[{"id":1007,"parentId":54,"resourceCode":"oosOrderList","resourceName":"查询交易单列表","remark":"查询交易单列表","type":"LINK"},{"id":1008,"parentId":54,"resourceCode":"oosQueryOrder","resourceName":"交易单详情查询","remark":"交易单详情查询","type":"LINK"},{"id":1009,"parentId":54,"resourceCode":"oosQueryOrderItem","resourceName":"交易单明细查询","remark":"交易单明细查询","type":"LINK"},{"id":1013,"parentId":54,"resourceCode":"oosQueryDictionary","resourceName":"数据字典","remark":"数据字典","type":"LINK"},{"id":1014,"parentId":54,"resourceCode":"vendCusts","resourceName":"查询客商信息接口","remark":"查询客商信息接口","type":"LINK"},{"id":1137,"parentId":54,"resourceCode":"oosOrderListExport","resourceName":"OMS导出订单接口","remark":"OMS导出订单接口","type":"LINK"}]},{"id":55,"parentId":50,"resourceCode":"After_Sale_Bill_Detail","resourceName":"售后单详情","remark":"售后单详情","type":"MENU","childNodes":[{"id":1010,"parentId":55,"resourceCode":"oosQueryRoList","resourceName":"售后单列表","remark":"售后单列表","type":"LINK"},{"id":1011,"parentId":55,"resourceCode":"oosQueryRoGet","resourceName":"售后单详情","remark":"售后单详情","type":"LINK"},{"id":1012,"parentId":55,"resourceCode":"oosQueryItemList","resourceName":"售后单明细","remark":"售后单明细","type":"LINK"},{"id":1023,"parentId":55,"resourceCode":"oosQueryDictionary","resourceName":"数据字典","remark":"数据字典","type":"LINK"},{"id":1024,"parentId":55,"resourceCode":"vendCusts","resourceName":"查询客商信息接口","remark":"查询客商信息接口","type":"LINK"}]}]},{"id":100,"parentId":0,"resourceCode":"Receive_And_Deliver_Manage","resourceName":"收发货管理","remark":"收发货管理","type":"MENU","childNodes":[{"id":102,"parentId":100,"resourceCode":"Dispatch_Bill_List","resourceName":"发货单列表","remark":"发货单列表","type":"MENU"},{"id":103,"parentId":100,"resourceCode":"Receive_Bill_List","resourceName":"收货单列表","remark":"收货单列表","type":"MENU"},{"id":104,"parentId":100,"resourceCode":"Deliver_Detail","resourceName":"发货详情","remark":"发货详情","type":"MENU","childNodes":[{"id":1028,"parentId":104,"resourceCode":"dictTypeList","resourceName":"数据字典批量查询接口","remark":"数据字典批量查询接口","type":"LINK"},{"id":1029,"parentId":104,"resourceCode":"vendCusts","resourceName":"查询客商信息接口","remark":"查询客商信息接口","type":"LINK"},{"id":1030,"parentId":104,"resourceCode":"warehouses","resourceName":"仓库信息分页查询接口","remark":"仓库信息分页查询接口","type":"LINK"},{"id":1031,"parentId":104,"resourceCode":"dispatchesPage","resourceName":"发货单条件查询接口(分页)","remark":"发货单条件查询接口(分页)","type":"LINK"},{"id":1032,"parentId":104,"resourceCode":"dispatchExport","resourceName":"导出发货单数据接口","remark":"导出发货单数据接口","type":"LINK"},{"id":1033,"parentId":104,"resourceCode":"dispatch","resourceName":"查询发货单基础信息接口","remark":"查询发货单基础信息接口","type":"LINK"},{"id":1034,"parentId":104,"resourceCode":"dispatchDetailPage","resourceName":"查询发货单商品信息接口(分页)","remark":"查询发货单商品信息接口(分页)","type":"LINK"},{"id":1141,"parentId":104,"resourceCode":"dictType","resourceName":"数据字典接口","remark":"数据字典接口","type":"LINK"}]},{"id":105,"parentId":100,"resourceCode":"Receive_Detail","resourceName":"收货详情","remark":"收货详情","type":"MENU","childNodes":[{"id":1035,"parentId":105,"resourceCode":"dictType","resourceName":"数据字典接口","remark":"数据字典接口","type":"LINK"},{"id":1037,"parentId":105,"resourceCode":"vendCusts","resourceName":"查询客商信息接口","remark":"查询客商信息接口","type":"LINK"},{"id":1038,"parentId":105,"resourceCode":"warehouses","resourceName":"仓库信息分页查询接口","remark":"仓库信息分页查询接口","type":"LINK"},{"id":1039,"parentId":105,"resourceCode":"receivePage","resourceName":"查询收货单列表接口(分页)","remark":"查询收货单列表接口(分页)","type":"LINK"},{"id":1040,"parentId":105,"resourceCode":"receiveExport","resourceName":"导出收货单数据接口","remark":"导出收货单数据接口","type":"LINK"},{"id":1041,"parentId":105,"resourceCode":"receive","resourceName":"查询收货单基础信息接口","remark":"查询收货单基础信息接口","type":"LINK"},{"id":1042,"parentId":105,"resourceCode":"receiveDetails","resourceName":"查询收货单商品信息接口(分页）","remark":"查询收货单商品信息接口(分页）","type":"LINK"},{"id":1142,"parentId":105,"resourceCode":"dictTypeList","resourceName":"数据字典批量查询接口","remark":"数据字典批量查询接口","type":"LINK"}]}]},{"id":200,"parentId":0,"resourceCode":"Financial_Manage","resourceName":"财务管理","remark":"财务管理","type":"MENU","childNodes":[{"id":201,"parentId":200,"resourceCode":"JIT_Financial_Sheet","resourceName":"JIT财务报表","remark":"JIT财务报表","type":"MENU"},{"id":1015,"parentId":200,"resourceCode":"dictType","resourceName":"数据字典接口","remark":"数据字典接口","type":"LINK"},{"id":1016,"parentId":200,"resourceCode":"dictTypeList","resourceName":"数据字典批量查询接口","remark":"数据字典批量查询接口","type":"LINK"},{"id":1017,"parentId":200,"resourceCode":"warehouses","resourceName":"仓库信息分页查询接口","remark":"仓库信息分页查询接口","type":"LINK"},{"id":1018,"parentId":200,"resourceCode":"dispatchesPage","resourceName":"发货单条件查询接口(分页)","remark":"发货单条件查询接口(分页)","type":"LINK"},{"id":1019,"parentId":200,"resourceCode":"dispatchExport","resourceName":"导出发货单数据接口","remark":"导出发货单数据接口","type":"LINK"},{"id":1020,"parentId":200,"resourceCode":"dispatch","resourceName":"查询发货单基础信息接口","remark":"查询发货单基础信息接口","type":"LINK"},{"id":1021,"parentId":200,"resourceCode":"dispatchDetailPage","resourceName":"查询发货单商品信息接口(分页)","remark":"查询发货单商品信息接口(分页)","type":"LINK"}]},{"id":300,"parentId":0,"resourceCode":"Archive_Manage","resourceName":"基础档案管理","remark":"基础档案管理","type":"MENU","childNodes":[{"id":301,"parentId":300,"resourceCode":"Commodity_Manage","resourceName":"商品管理","remark":"商品管理","type":"MENU"},{"id":302,"parentId":300,"resourceCode":"Commodity_Detail","resourceName":"货品详情","remark":"货品详情","type":"MENU"},{"id":303,"parentId":300,"resourceCode":"Store_Manage","resourceName":"仓库管理","remark":"仓库管理","type":"MENU"}]},{"id":400,"parentId":0,"resourceCode":"Supply_Chain_Mange","resourceName":"供应链管理","remark":"供应链管理","type":"MENU","childNodes":[{"id":401,"parentId":400,"resourceCode":"Inventory_Allocation","resourceName":"库存分配","remark":"库存分配","type":"MENU","childNodes":[{"id":403,"parentId":401,"resourceCode":"Physical_Inventory_Query","resourceName":"实物库存查询","remark":"实物库存查询","type":"MENU","childNodes":[{"id":1043,"parentId":403,"resourceCode":"brands","resourceName":"查询品牌接口","remark":"查询品牌接口","type":"LINK"},{"id":1044,"parentId":403,"resourceCode":"warehouses","resourceName":"仓库信息分页查询接口","remark":"仓库信息分页查询接口","type":"LINK"},{"id":1045,"parentId":403,"resourceCode":"dictType","resourceName":"数据字典接口","remark":"数据字典接口","type":"LINK"}]},{"id":404,"parentId":401,"resourceCode":"Physical_Inventory_Allocation","resourceName":"实物库存分配","remark":"实物库存分配","type":"MENU","childNodes":[{"id":1046,"parentId":404,"resourceCode":"physicalInventorySearch","resourceName":"实物库存搜索接口","remark":"实物库存搜索接口","type":"LINK"},{"id":1047,"parentId":404,"resourceCode":"brands","resourceName":"查询品牌接口","remark":"查询品牌接口","type":"LINK"},{"id":1048,"parentId":404,"resourceCode":"dictType","resourceName":"数据字典接口","remark":"数据字典接口","type":"LINK"},{"id":1049,"parentId":404,"resourceCode":"warehouses","resourceName":"仓库信息分页查询接口","remark":"仓库信息分页查询接口","type":"LINK"},{"id":1050,"parentId":404,"resourceCode":"physicalInventoryList","resourceName":"实物库存分页查询接口","remark":"实物库存分页查询接口","type":"LINK"},{"id":1051,"parentId":404,"resourceCode":"physicalInventoryExport","resourceName":"实物库存导出","remark":"实物库存导出","type":"LINK"},{"id":1052,"parentId":404,"resourceCode":"physicalInventoryAllocation","resourceName":"实物库存分配","remark":"实物库存分配","type":"LINK"},{"id":1053,"parentId":404,"resourceCode":"inventoryLogPage","resourceName":"渠道库存流水查询","remark":"渠道库存流水查询","type":"LINK"},{"id":1054,"parentId":404,"resourceCode":"channelsWarehouseMapping","resourceName":"仓库渠道代码映射","remark":"仓库渠道代码映射","type":"LINK"},{"id":1055,"parentId":404,"resourceCode":"batchPhysicalInventoryAllocation","resourceName":"批量分货","remark":"批量分货","type":"LINK"},{"id":1056,"parentId":404,"resourceCode":"queryPhysicalInventoryUpInfo","resourceName":"实物库存上架信息查询接口","remark":"实物库存上架信息查询接口","type":"LINK"}]},{"id":405,"parentId":401,"resourceCode":"Channel_Inventory_Allocation","resourceName":"渠道库存分配","remark":"渠道库存分配","type":"MENU","childNodes":[{"id":1057,"parentId":405,"resourceCode":"channels","resourceName":"渠道基础信息查询","remark":"渠道基础信息查询","type":"LINK"},{"id":1058,"parentId":405,"resourceCode":"channelInventoryExport","resourceName":"渠道库存导出","remark":"渠道库存导出","type":"LINK"},{"id":1059,"parentId":405,"resourceCode":"channelInventoryAllocation","resourceName":"渠道库存分配","remark":"渠道库存分配","type":"LINK"},{"id":1060,"parentId":405,"resourceCode":"batchChannelInventoryAllocation","resourceName":"渠道库存下架信息查询接口","remark":"渠道库存下架信息查询接口","type":"LINK"},{"id":1061,"parentId":405,"resourceCode":"queryChannelInventoryDownInfo","resourceName":"渠道库存下架信息查询接口","remark":"渠道库存下架信息查询接口","type":"LINK"}]},{"id":406,"parentId":401,"resourceCode":"Channel_Inventory_Allocation_B2C","resourceName":"渠道库存分配-B2C","remark":"渠道库存分配-B2C","type":"MENU","childNodes":[{"id":1077,"parentId":406,"resourceCode":"channels","resourceName":"渠道基础信息查询","remark":"渠道基础信息查询","type":"LINK"},{"id":1078,"parentId":406,"resourceCode":"channelInventoryExport","resourceName":"渠道库存导出","remark":"渠道库存导出","type":"LINK"},{"id":1079,"parentId":406,"resourceCode":"channelInventoryAllocation","resourceName":"渠道库存分配","remark":"渠道库存分配","type":"LINK"},{"id":1080,"parentId":406,"resourceCode":"batchChannelInventoryAllocation","resourceName":"渠道库存批量分配","remark":"渠道库存批量分配","type":"LINK"},{"id":1081,"parentId":406,"resourceCode":"queryChannelInventoryDownInfo","resourceName":"渠道库存下架信息查询接口","remark":"渠道库存下架信息查询接口","type":"LINK"}]},{"id":407,"parentId":401,"resourceCode":"Channel_Inventory_Allocation_BBC","resourceName":"渠道库存分配-BBC","remark":"渠道库存分配-BBC","type":"MENU","childNodes":[{"id":1082,"parentId":407,"resourceCode":"channels","resourceName":"渠道基础信息查询","remark":"渠道基础信息查询","type":"LINK"},{"id":1083,"parentId":407,"resourceCode":"channelInventoryExport","resourceName":"渠道库存导出","remark":"渠道库存导出","type":"LINK"},{"id":1084,"parentId":407,"resourceCode":"channelInventoryAllocation","resourceName":"渠道库存分配","remark":"渠道库存分配","type":"LINK"},{"id":1085,"parentId":407,"resourceCode":"batchChannelInventoryAllocation","resourceName":"渠道库存批量分配","remark":"渠道库存批量分配","type":"LINK"},{"id":1086,"parentId":407,"resourceCode":"queryChannelInventoryDownInfo","resourceName":"渠道库存下架信息查询接口","remark":"渠道库存下架信息查询接口","type":"LINK"}]},{"id":408,"parentId":401,"resourceCode":"Channel_Inventory_Allocation_JIT","resourceName":"渠道库存分配-JIT","remark":"渠道库存分配-JIT","type":"MENU","childNodes":[{"id":1087,"parentId":408,"resourceCode":"channels","resourceName":"渠道基础信息查询","remark":"渠道基础信息查询","type":"LINK"},{"id":1088,"parentId":408,"resourceCode":"channelInventoryExport","resourceName":"渠道库存导出","remark":"渠道库存导出","type":"LINK"},{"id":1089,"parentId":408,"resourceCode":"channelInventoryAllocation","resourceName":"渠道库存分配","remark":"渠道库存分配","type":"LINK"},{"id":1090,"parentId":408,"resourceCode":"batchChannelInventoryAllocation","resourceName":"渠道库存批量分配","remark":"渠道库存批量分配","type":"LINK"},{"id":1091,"parentId":408,"resourceCode":"queryChannelInventoryDownInfo","resourceName":"渠道库存下架信息查询接口","remark":"渠道库存下架信息查询接口","type":"LINK"}]}]},{"id":402,"parentId":400,"resourceCode":"Allocate_Mange","resourceName":"调拨管理","remark":"调拨管理","type":"MENU","childNodes":[{"id":409,"parentId":402,"resourceCode":"Apply_Allocate_Bill_List","resourceName":"调拨申请单列表","remark":"调拨申请单列表","type":"MENU","childNodes":[{"id":1092,"parentId":409,"resourceCode":"getOperators","resourceName":"BFF查询操作员","remark":"BFF查询操作员","type":"LINK"},{"id":1093,"parentId":409,"resourceCode":"transferModes","resourceName":"查询调拨方式","remark":"查询调拨方式","type":"LINK"},{"id":1094,"parentId":409,"resourceCode":"transferOpenWh","resourceName":"查询调拨开放仓库","remark":"查询调拨开放仓库","type":"LINK"},{"id":1095,"parentId":409,"resourceCode":"generateTransferNo","resourceName":"生成调拨单号","remark":"生成调拨单号","type":"LINK"},{"id":1096,"parentId":409,"resourceCode":"transferCreate","resourceName":"新增调拨单号","remark":"新增调拨单号","type":"LINK"},{"id":1097,"parentId":409,"resourceCode":"transferManage","resourceName":"调拨管理","remark":"调拨管理","type":"LINK"},{"id":1098,"parentId":409,"resourceCode":"transferPageQuery","resourceName":"调拨单分页查询","remark":"调拨单分页查询","type":"LINK"},{"id":1099,"parentId":409,"resourceCode":"transferAggQuery","resourceName":"调拨单聚合信息查询","remark":"调拨单聚合信息查询","type":"LINK"},{"id":1100,"parentId":409,"resourceCode":"transferExport","resourceName":"调拨单导出","remark":"调拨单导出","type":"LINK"},{"id":1101,"parentId":409,"resourceCode":"transferNoQuery","resourceName":"调拨单单号查询","remark":"调拨单单号查询","type":"LINK"},{"id":1102,"parentId":409,"resourceCode":"transferDetailQuery","resourceName":"调拨单明细查询","remark":"调拨单明细查询","type":"LINK"},{"id":1103,"parentId":409,"resourceCode":"transferDetailExport","resourceName":"调拨单明细导出","remark":"调拨单明细导出","type":"LINK"},{"id":1104,"parentId":409,"resourceCode":"draftNoQuery","resourceName":"草稿单号查询","remark":"草稿单号查询","type":"LINK"}]},{"id":410,"parentId":402,"resourceCode":"New_Apply_Allocate_Bill","resourceName":"调拨申请单-新增","remark":"调拨申请单-新增","type":"MENU","childNodes":[{"id":1143,"parentId":410,"resourceCode":"dictType","resourceName":"数据字典接口","remark":"数据字典接口","type":"LINK"}]},{"id":411,"parentId":402,"resourceCode":"Apply_Allocate_Bill_Detail","resourceName":"调拨申请单-明细信息","remark":"调拨申请单-明细信息","type":"MENU","childNodes":[{"id":1144,"parentId":411,"resourceCode":"dictTypeList","resourceName":"数据字典批量查询接口","remark":"数据字典批量查询接口","type":"LINK"},{"id":1146,"parentId":411,"resourceCode":"receivePage","resourceName":"查询收货单列表接口(分页)","remark":"查询收货单列表接口(分页)","type":"LINK"}]}]}]},{"id":1155,"parentId":0,"resourceCode":"AuthorizationManage","resourceName":"权限管理","remark":"权限管理","type":"MENU"}]}
      let a = []
      // 判断数据源res.data是否为数组,不为数组则要求其children属性为数组
      if (!Array.isArray(res.data)) {
        a = res.data.children
      } else {
        a = res.data
      }
      // 重新定义所有层级id,保证树形层级之间id都不重复
      a.map((item, index) => {
        item['pid'] = `${index + 1}`
        item.id = index + 1 + '-' + item.id
        this.setId(item)
         this.setPid(item)
      })
      console.log(a, '处理后数组1')
      // const str = JSON.stringify(a)
      // const arr = JSON.parse(str)
      // console.log(arr, '处理后数组')
       this.fromData = a
    //    setTimeout(function() {
    //    this.fromData = a
    //     console.log(this.fromData, 'chuanrushuzu')
    // }, 300)
      // 当已选部分集合时,editData数组长度不为0
      if (this.editData.length !== 0) {
        console.log('ejqwoejq')
        // 当为修改界面展示时,通过editData中数组的各项id确定toData中的数据结构.
        // 如果Data数组为id元素,则不作处理, 如果为集合元素,则进行提取id处理
        if (this.Data[0].id) {
          const arr = []
          this.Data.forEach(item => arr.push(item.id))
          this.editData = arr
        }
        // 测试defaultCheckedKeys原理
        // if (this.checkedList.length !== 0) {
        //   this.checkedList.forEach(item => {
        //     this.fromData.map(e => {
        //       this.getTree(e, item.id)
        //     })
        //   })
        //   console.log(this.fromData)
        // }
      }
    }
  },
  methods: {
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      const arr = this.getTbs(toData)
      this.$emit('add', fromData, toData, obj, arr)
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      const arr = this.getTbs(toData)
      this.$emit('remove', fromData, toData, obj, arr)
    },
    // 使用递归为请求到的后台数据的每一项添加一个对应树形结构的pid
    setPid(item) {
      const that = this
      if (item.childNodes) {
        item.childNodes.map(e => {
          // 子级中的pid等于其父级中的id
          e['pid'] = item.id
          that.setPid(e)
        })
      } else {
        return false
      }
    },
    // 使用递归,设置所有id,保留最底层id不变
    setId(item) {
      const that = this
      if (item.childNodes) {
        item.childNodes.map((e, index) => {
          // 子级中的pid等于其父级中的id
          e.id = item.id + '-' + e.id
          that.setId(e)
        })
      } else {
        item.id = item.id.split('-')[item.id.split('-').length - 1]
        return false
      }
    },
    //   renderFirst = arr => {
    //   let k = [];
    //   // 遍历数组, 如果数组有children属性,证明还有子元素, 那么继续递归
    //   arr.map(item => {
    //     // 如果有children, 继续遍历
    //     if (item.children) {
    //       // 继续往内递归
    //       this.getTarget(item, k)
    //     } else {
    //       // 如果没有, 那么证明当前项没有子元素, 那么当前项下没有子集合, 不需要父key
    //       return false
    //     }
    //   })
    //   return k;
    // };
    // 使用递归查找最终子元素
    getTarget(item, arr) {
      const that = this
      // 如果内部还有children,那么反复递归当前函数, arr为存储所有符合条件值的数组
      if (item.childNodes) {
        item.childNodes.map(e => {
          that.getTarget(e, arr)
        })
      } else {
        // 如果没有, 那么证明当前这个子元素就是最小子节点的元素, 即,
        arr.push(item)
      }
    },
    // 使用递归,获取到每一次添加或移除后toData中的最终子元素(没有children的元素)的集合
    getTbs(toData) {
      const arr = []
      toData.map(item => {
        if (item.childNodes) {
          this.getTarget(item, arr)
        } else {
          return false
        }
      })
      return arr
    }
    // // 使用递归获取对应fromData中的元素.并为元素添加选中状态[研究defaultCheckedKeys原理实现]
    // getTree (item, id) {
    //   let that = this
    //   if (item.id !== id) {
    //     if (item.children) {
    //       item.children.map(e => {
    //         that.getTree(e, id)
    //       })
    //     } else {
    //       return false
    //     }
    //   } else {
    //     // 把找到的元素的选项变为已选择,
    //     item.indeterminate = true
    //     console.log(item)
    //   }
    // },
  }
}
</script>

<style scoped>

</style>
