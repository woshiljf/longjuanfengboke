<template>
  <div>
    <el-card class="box-card">
      <el-container>
        <el-header height="" class="elHeader">
          <div class="searchBox" style="margin-top:10px">
            <el-row>
              <el-col>
                <el-form :model="searchQuery" :inline="true" ref="form" size="small">
                  <div v-for="option in searchOptions" :key="option.label" style="display: inline-block">        
                      <el-form-item :label="option.label" :rules="option.rules" :prop="option.prop" v-if="option.proptype==='input'"> 
                        <el-input v-model="searchQuery[option.name]" :placeholder="option.placeholder" :type="option.type"></el-input>
                      </el-form-item>
                      <el-form-item :label="option.label" :rules="option.rules" :prop="option.prop" v-if="option.proptype==='select'"> 
                        <el-select v-model="searchQuery[option.name]" :placeholder="option.placeholder">
                          <el-option
                            v-for="item in listQuery[option.name]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>  
                    <el-form-item :label="option.label" v-if="option.proptype==='date'">
                        <div class="block">
                          <el-date-picker
                            v-model="searchQuery[option.name]"
                            type="datetime"
                            placeholder="选择日期时间"
                            value-format="timestamp"
                            >
                          </el-date-picker>
                        </div>
                    </el-form-item>
                  </div>
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
export default {
  name: 'SearchBox',
  props:{
    // 搜索参数
    searchOptions: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 查询参数
    listQuery: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 订单更新函数
    orderUpdate: {
      type: Function
    }
  },
  data(){
    return {
      searchQuery: '',
      loginLoading: null
    }
  },
  created() {
    this.searchQuery = Object.assign({},this.listQuery)
    // 清空值
    for (const key in this.searchQuery) {
      if (this.searchQuery.hasOwnProperty(key)) {
        this.searchQuery[key] = ''
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
          // if(this.searchQuery.hasOwnProperty('nextExecuteTime')){
          //   if(this.searchQuery.nextExecuteTime===null ||this.searchQuery.nextExecuteTime===''){
          //     this.tick()
          //     return
          //   }
          // }
          // 获取userCode
          const userCode = JSON.parse(sessionStorage.getItem("userCode")).userCode
          // 请求参数
          const data = Object.assign({},this.searchQuery)
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
    },
    // 去除空格，回车，换行
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
.box-card{
  text-align: center;
}

</style>