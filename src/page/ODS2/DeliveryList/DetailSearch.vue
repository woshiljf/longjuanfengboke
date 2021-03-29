<template>
  <div class="detailSearch">
    <el-row class="rowStyle">
      <el-form ref="form" :model="form">
        <el-col :span="4" class="text-right">
          <el-form-item >
            <el-select v-model="form.type" placeholder="请选择" @change="resetText">
              <el-option
                label="SKU条码"
                value="barCode"/>
              <el-option
                label="货号"
                value="materialCode"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-input
              ref="int"
              v-model="form.textarea"
              :rows="3"
              type="text"
              class="widthLength"
              placeholder="请输入内容"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-checkbox v-model="form.onlyDiffBill">只看发货差异</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button v-preventReClick type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'DetailSearch',
  data() {
    return {
      form: { // 搜索条件参数
        type: 'barCode',
        onlyDiffBill: '',
        textarea: ''
      }
    }
  },
  methods: {
    // 重置输入框
    resetText() {
      this.form.textarea = ''
    },
    // 查询方法
    search() {
      const params = {}
      // 转换传递参数属性,
      params[this.form.type] = this.form.textarea.trim() || this.form.textarea
      params['onlyDiffBill'] = this.form.onlyDiffBill
      // 请求数据
      this.$emit('searchData', params)
    },
    // 重置
    reset() {
      for (var k in this.form) {
        this.form[k] = ''
      }
      this.form.type = 'barCode'
    }
  }

}
</script>
