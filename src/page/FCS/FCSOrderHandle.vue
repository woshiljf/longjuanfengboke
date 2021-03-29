<template>
  <div class="baowei2">
    <el-card class="box-card">
      <el-container>
          <el-header height="" class="elHeader">
            <div class="searchBox" style="margin-top:10px">
              <el-row>
                <el-col><h1 style="color: red">oms已完成单据同步恒康重试</h1></el-col>
                <el-col>
                  <el-card>
                    <el-form :model="listQuery" :inline="true" ref="form" size="small">
                      <el-tooltip class="item" effect="dark" content="售后单号，补偿售后单时传入，可单独输入售后单号" placement="top-start">
                        <el-form-item label="宝唯订单号:"> 
                          <el-input v-model="listQuery.orderNos" placeholder="可批量输入 以英文逗号隔开" type="textarea"></el-input>
                        </el-form-item>
                      </el-tooltip>
                      <el-tooltip class="item" effect="dark" content="宝唯订单号，补偿订单时传入，可单独输入宝唯订单号" placement="top-start">
                        <el-form-item label="售后单号:" prop="returnNos"> 
                          <el-input v-model="listQuery.returnNos" placeholder="可批量输入 以英文逗号隔开" type="textarea"></el-input>
                        </el-form-item>
                      </el-tooltip>
                    </el-form>
                  </el-card>
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
import {fcsOrderCompensateHandle} from '../../api/fcsOrder'
export default {
  name: 'FcsCompensateHk',
  data(){
    return {
      listQuery: {
        orderNos: '', //单据类型
        returnNos: ''
      },
      loginLoading: null,
    }
  },
  methods: {
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
      // 获取userCode
          const userCode = JSON.parse(sessionStorage.getItem("userCode")).userCode
          // 订单更新接口
          const data = {...this.listQuery}
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              data[key] = this.deleteTrim(data[key])
            }
          }
          const params = {data,userCode}
          // 刷新动画
          this.loginLoading = this.$loading({
            lock: true,
            text: '订单刷新中,请稍后。。。',
            spinner: "el-icon-loading"
          })
          this.orderUpdate(params)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 去除回车，空格,换行
    deleteTrim(param){
      var data = param.replace(/，/g,',').split(',')
      var newarr = []
      for (var item of data) {
        item = item.replace(/[\r\n\s]/g, '').trim()
        if(item){
          newarr.push(item)
        }
      }
      return newarr
    },
    // 订单刷新
    orderUpdate(params){
      fcsOrderCompensateHandle(params)
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
      for (const key in this.listQuery) {
        if (this.listQuery.hasOwnProperty(key)) {
          this.listQuery[key] = ''
        }
      }
    }
  }
}
</script>
<style scoped>
  .page-bar {
    margin-top: 20px;
    text-align: right;
  }
  .btn{
    margin: 0;
  }
  .box-card {
    text-align: center;
  }

</style>