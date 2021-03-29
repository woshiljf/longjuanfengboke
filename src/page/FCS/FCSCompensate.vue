<template>
  <div>
    <el-card class="box-card">
      <el-container>
        <el-header height="" class="elHeader">
          <div class="searchBox" style="margin-top:10px; text-align: center">
            <el-row>
              <el-col>
                <el-form :model="searchQuery" :inline="true" ref="form" size="small"> 
                  <el-form-item label="单据类型" :rules="searchOptions.rules" :prop="searchOptions.prop"> 
                    <el-select v-model="searchQuery.bizType" :placeholder="searchOptions.placeholder" :type="searchOptions.type">
                      <el-option
                        v-for="item in listQuery.bizType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>   
          </div>
        </el-header>
        <el-main height="" class="btn" style="text-align:center">
          <div>
            <el-button type="primary" @click="onSubmit('form')">更新订单</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </el-main>
      </el-container>
    </el-card>




  </div>
    
</template>
<script>
import {fcsCompensateHk} from '../../api/fcsOrder'
import SearchBox from '../../components/searchBox'
export default {
  name: 'FcsCompensateHk',
  components: {
    SearchBox
  },
  data(){
    return {
      listQuery: {
        bizType: [
          {value: 1, label: '销售采购及BBC发货'},
          {value: 2, label: '销售采购及BBC退货'},
          {value: 3, label: '调拨单'},
        ], //单据类型
        limit: 100
      },
      orderUpdate: fcsCompensateHk,
      searchQuery: {
        bizType: '' ,
        limit: 100
      },
      searchOptions: {
          label: '单据类型:',
          rules: [
          {
          required: true,
          message: "请输入单据类型",
          trigger: "blur"
          }],
          prop: 'bizType',type: 'bizType',name: 'bizType',
          placeholder: '请输入单据类型',
          proptype: 'input'
        }
    }
  },
    methods: {
    tick(){
      this.$message({
          message:'请选择任务下次触发时间',
          type:'warning',
          duration:2000
      })
      return
    },
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 获取userCode
          const userCode = JSON.parse(sessionStorage.getItem("userCode")).userCode
          // 请求参数
          const data = Object.assign({},this.searchQuery)
          this.searchQuery.limit = 100 //分页size固定不变
          const params = {data,userCode}
          // 刷新动画
          this.loginLoading = this.$loading({
            lock: true,
            text: '订单刷新中,请稍后。。。',
            spinner: "el-icon-loading"
          })
          this.orderUpdateHandle(params)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 订单刷新
    orderUpdateHandle(params){
      this.orderUpdate(params)
        .then(res=>{
          if(res.data.code==0){
            this.loginLoading.close()
            this.$message({
              message:'订单刷新成功',
              type:'success',
              duration:2000
            })
          }else{
            this.loginLoading.close()
            this.$message({
              message:'操作失败',
              type:'error',
              duration:2000
            })
          }
        }).catch(err=>{
          console.log(err)
          this.loginLoading.close()
        }).finally(()=>{
          this.loginLoading.close()
        })
    },
    handleReset(){
      // 清空请求搜索
      for (const key in this.searchQuery) {
        if (this.searchQuery.hasOwnProperty(key)) {
          this.searchQuery[key] = ''
        }
      }
    }
  }

}
</script>
