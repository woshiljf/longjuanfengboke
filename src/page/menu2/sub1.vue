<template lang="html">

  <div class="table">
    <el-form :model="form" ref="form" label-width="80px">

      <el-form-item label="学校:">
        <el-input v-model="form.school"></el-input>
      </el-form-item>
      <el-form-item label="邮箱:">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="地址:">
        <el-input v-model="form.addr"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即保存</el-button>
        <el-button @click="cancelSave">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <div> 信息没有保存</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
    


  </div>
</template>

<script>
import pagination from "common/pagination";
export default {
  data() {
    return {
      form: {
        school: '',
        email: '',
        addr: ''
      },
      dialogFormVisible: false ,
      flag: false
      
    }
  },
  methods: {
    onSubmit() {
      const mesg = Object.assign({},this.from)
      console.log('保存成功')
      this.$notify({
        message: '保存成功',
        type: 'success',
        duration: 2000
      })
      this.dialogFormVisible = false
      this.flag = true
    },
    cancelSave() {
      console.log('取消保存')
      this.$notify({
        message: '取消成功',
        type: 'success',
        duration: 2000
      })
    }
  },
  beforeRouteLeave(to,from,next) {
    if(this.dialogFormVisible ==false && this.flag ==false) {
      this.dialogFormVisible = true
      next(false)
      return
    }else{
      this.flag = false
      next()
    }
  }

}
</script>

<style scoped lang="scss">

</style>