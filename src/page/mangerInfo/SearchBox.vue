<template>
  <div class="filter-container searchBox">
    <el-checkbox-group v-model="listData.userAddr" size='small'>
      <el-checkbox v-for="(item, k) in userAddrOptions" :key="item" :label="k" :value="k"/>
    </el-checkbox-group>
    <div class="inputBox">
      <el-input v-model.trim="listData.name" placeholder="用户名" size="small" clearable class="filter-item userName" @keyup.enter.native="handleFilter"/>
      <el-select v-model.trim="listData.roleCode" placeholder="角色" size="small" clearable class="filter-item roleName" @keyup.enter.native="handleFilter">
        <el-option v-for="(item) in roleNameCodeOptions" :key="item.roleCode" :label="item.roleName" :value="item.roleCode"/>
      </el-select>
      <el-select v-model="listData.available" placeholder="状态" size="small" clearable class="filter-item tableAvailable">
        <el-option v-for="(item, k) in availableOptions" :key="item" :label="k" :value="item"/>
      </el-select>
      <el-button :disabled="isDisable" class="filter-item" type="primary" size="small" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="primary" size="small" @click="handleReset">
        重置
      </el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InternalSearchBox',
  props: {
    listQuery: {
      type: Object,
      default: function() {
        return {}
      }
    },
    userAddrOptions: {
      type: Object,
      default: function() {
        return {}
      }
    },
    roleNameCodeOptions: {
      type: Array,
      default: function() {
        return []
      }
    },
    isDisable: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      listData: this.listQuery,
      availableOptions: { '启用': true, '禁用': false }
    }
  },
  methods: {
    handleFilter() {
      this.listData.page = 1
      this.$parent.getList(this.listData) // 执行父元素的getList方法
    },
    // 重置查询
    handleReset() {
      this.listData.name = '' // 清空已填入用户名
      this.listData.roleName = '' // 清空已选中角色名
      this.listData.roleCode = '' // 清空角色码
      this.listData.userAddr = [] // 清空已勾选的账户
      this.listData.accountProperty = []
    }
  }
}
</script>
