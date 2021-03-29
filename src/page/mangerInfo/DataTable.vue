<template>
  <div class="datatable">
    <el-table
      :v-loading="listLoading"
      :key="tableKey"
      :data="list"
      :header-cell-style="{background: '#204060', color: 'white'}"
      class="dataTable"
      border
      fit
      highlight-current-row
      height="calc(100vh - 140px)"
      size="small"
      @sort-change="sortChange">
      <el-table-column label="序号" prop="id" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }} </span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="userName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }} </span>
        </template>
      </el-table-column>
      <el-table-column label="账号属性" prop="roleName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.accountProperty | accountPropertyFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="roleName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleNames | roleNamesFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.available | statusFilter">{{ scope.row.available| statusZhFilter }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'InternalDataTable',
  filters: {
    // 角色过滤器
    roleNamesFilter(roleNames) {
      if (roleNames) {
        return roleNames.filter((v) => {
          if (v != null) {
            return v
          }
        }).join(',')
      }
    },
    // 状态过滤器
    statusZhFilter(status) {
      const statusZhMap = {
        false: '禁用',
        true: '启用'
      }
      return statusZhMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        false: 'danger',
        true: 'success'
      }
      return statusMap[status]
    },
    // 账户过滤器
    accountPropertyFilter(status) {
      const accountPropertyMap = {
        'ADMIN_ACCOUNT': '管理员账户',
        'BUSINESS_ACCOUNT': '业务人员账户',
        'NO_ATTRIBUTE_ACCOUNT': '无属性账户'
      }
      return accountPropertyMap[status]
    },
    // 日期过滤器
    dateFilter(time) {
      return time.replace('T', ' ').replace('.000+0800', '').replace('.000+0000', '')
    }
  },
  props: {
    listLoading: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      tableKey: 0
    }
  },
  methods: {
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    }
  }
}
</script>
