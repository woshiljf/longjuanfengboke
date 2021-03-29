<template>
  <div>
    <search-box
    :list-query="listquery"
    :search-options="searchOptions"
    :orderUpdate="orderStatusUpdate"
    />
  </div>
    
</template>
<script>
import SearchBox from '../../components/searchBox'
import {orderStatusUpdate} from '../../api/order'
export default {
  name: 'OmsTaskStatusUpdate',
  components: {
    SearchBox
  },
  data(){
    return {
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
          label: '任务状态:',
          rules: [],
          prop: 'processStatus',type: 'processStatus',name: 'processStatus',
          placeholder: '请输入任务状态',
          proptype: 'select'
        },
        {
          label: '任务失败次数:',
          rules: [],
          prop: 'failCount',type: 'failCount',name: 'failCount',
          placeholder: '请输入任务失败次数',
          proptype: 'input'
        },
        {
          label: '任务下次触发时间:',
          rules: [],
          prop: '',type: '',name: 'nextExecuteTime',
          proptype: 'date'
        }
      ],
      listquery: {
        id: '', //主键值
        failCount: '', // 任务失败次数
        nextExecuteTime: null, // 任务下次触发时间
        processStatus: [
          {value: 10, label: '待处理'},
          {value: 20, label: '处理中'},
          {value: 30, label: '处理成功'},
          {value: 40, label: '任务失败'}
        ], // 任务状态
      },
      orderStatusUpdate: orderStatusUpdate
    }
  },
}
</script>
