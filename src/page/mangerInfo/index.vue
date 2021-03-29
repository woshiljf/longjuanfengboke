<template>
  <div class="order-box clearfix auth-inner">
    <search-box
      ref="searchbox"
      :list-query="listQuery"
      :role-name-code-options="roleNameCodeOptions"
      :user-addr-options="userAddrOptions"
      :is-disable="isDisable"
    />
    <data-table
      :list="list"
      :list-loading="listLoading"
    />
    <el-col class="pagination">
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList(listQuery)" />
    </el-col>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import SearchBox from './SearchBox'
import DataTable from './DataTable'

export default {
  name: 'User',
  components: { Pagination, SearchBox, DataTable },
  data() {
    return {
      listLoading: false, // list请求加载
      isDisable: false, // 搜索按钮是否禁用
      list: [], // 请求数据变量，传递给table
      total: 0, // 数据总数,分页器
      clearTimeout: { timeoutId1: 0, timeoutId2: 0 },
      listQuery: { // 搜索框查询条件
        page: 1, // 默认第一页
        limit: 50, // 请求数据条数
        userCode: '', // 用户码
        name: '', // 用户名
        available: '', // 状态变量
        roleName: '', // 角色名
        roleCode: '', // 角色名对应的角色码
        userAddr: ['管理员账户', '业务人员账户'],
        accountProperty: [] // 账户属性
      },
      roleNameCodeOptions: [], // 角色选择
      userAddrOptions: {
        '管理员账户': 'ADMIN_ACCOUNT',
        '业务人员账户': 'BUSINESS_ACCOUNT',
        '无属性账户': 'NO_ATTRIBUTE_ACCOUNT'
      }
    }
  },
  created() {
    if (sessionStorage.getItem('urlName') !== '权限管理-账户管理-内部页面') {
      window._paq.push(['setDocumentTitle', '权限管理-账户管理-内部页面'])
      window._paq.push(['trackPageView'])
      sessionStorage.setItem('urlName', '权限管理-账户管理-内部页面')
    }
    // 获取所有角色
    this.getAllRole()
    // 获取列表数据
    this.getList(this.listQuery)
  },
  beforeDestroy() {
    // 清除计时器
    clearTimeout(this.clearTimeout.timeoutId1)
    clearTimeout(this.clearTimeout.timeoutId2)
    this.clearTimeout = { timeoutId1: 0, timeoutId2: 0 }
  },
  methods: {
    // 获取所有角色信息
    async getAllRole() {
      if (!localStorage.getItem('internalUserListAllRoleList')) {
        const res = await this.$api.fetchAllRoleList()
        if (res.data.list) {
          res.data.list.forEach((v) => {
            this.roleNameCodeOptions.push({ roleName: v.roleName, roleCode: v.roleCode })
          })
          localStorage.setItem('internalUserListAllRoleList', JSON.stringify(this.roleNameCodeOptions))
        }
      } else {
        this.roleNameCodeOptions = JSON.parse(localStorage.getItem('internalUserListAllRoleList'))
      }
    },
    // 获取列表的所有数据
    async getList(listQuery) {
      this.isDisable = true
      this.clearTimeout.timeoutId1 = setTimeout(() => {
        this.isDisable = false
      }, 500)
      this.listLoading = true
      this.getProperty(listQuery.userAddr)
      try {
        const res = await this.$api.userFetchList(listQuery)
        this.list = res.data.list
        this.total = res.data.total
        this.clearTimeout.timeoutId2 = setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      } catch (e) {
        console.log(e, 'getListError')
        this.listLoading = false
      } finally {
        this.listLoading = false
      }
    },
    getProperty(attr) {
      this.listQuery.accountProperty = []
      if (attr.length === 0) {
        return
      }
      for (const a of attr) {
        this.listQuery.accountProperty.push(this.userAddrOptions[a])
      }
    }
  }
}
</script>

