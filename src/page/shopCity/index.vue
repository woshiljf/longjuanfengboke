<template>
  
  <div class="studyBoard">
      <el-container style="height: 100vh; border: 1px solid #eee">
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['1', '3']">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i>前端学习</template>
        <el-menu-item-group>
          <template slot="title">css相关</template>

          <el-submenu index="1-1">
            <template slot="title">css常用布局</template>
            <el-menu-item index="1-1-1">三栏布局</el-menu-item>
            <el-menu-item index="1-1-2">三栏布局</el-menu-item>
            <el-menu-item index="1-1-3">三栏布局</el-menu-item>
            <el-menu-item index="1-1-4">三栏布局</el-menu-item>
          </el-submenu>
          

          <el-menu-item index="1-2">动画</el-menu-item>

        </el-menu-item-group>
        <el-menu-item-group title="js相关">
          <el-submenu index="1-3">
          <template slot="title">js基础</template>
          <el-menu-item index="1-3-1">js高级程序设计</el-menu-item>
          <el-menu-item index="1-3-2">你不知道的js</el-menu-item>

        </el-submenu>
         
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">js设计模式</template>
          <el-menu-item index="1-4-1">单例模式</el-menu-item>
          <el-menu-item index="1-4-2">策略模式</el-menu-item>
          <el-menu-item index="1-4-3">代理模式</el-menu-item>
          <el-menu-item index="1-4-4">迭代器模式</el-menu-item>
          <el-menu-item index="1-4-5">发布-订阅模式</el-menu-item>
          <el-menu-item index="1-4-6">命令模式</el-menu-item>
          <el-menu-item index="1-4-7">组合模式</el-menu-item>
          <el-menu-item index="1-4-8">中介者模式</el-menu-item>
          <el-menu-item index="1-4-9">装饰者模式</el-menu-item>
          <el-menu-item index="1-4-10">适配器模式</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"><i class="el-icon-menu"></i>数据结构</template>
            <el-menu-item index="2-1-1">树</el-menu-item>
            <el-menu-item index="2-1-2">数组</el-menu-item>
            <el-menu-item index="2-1-3">队列</el-menu-item>
            <el-menu-item index="2-1-4">栈</el-menu-item>
            <el-menu-item index="2-1-5">链表</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-setting"></i>经典算法</template>
        <el-menu-item-group>

          <el-menu-item index="3-1" @click="trackHandle">回溯算法</el-menu-item>
          <el-menu-item index="3-2" @click="dpghHandle">动态规划算法</el-menu-item>
          <el-menu-item index="3-3" @click="tanxinHandle">贪心算法</el-menu-item>
          <el-menu-item index="3-4">快速幂算法</el-menu-item>
          <el-menu-item index="3-5" @click="searchHandle">搜索算法</el-menu-item>
          <el-menu-item index="3-6" @click="towHandle">二分查找</el-menu-item>
          <el-menu-item index="3-7" @click="fenzhiHandle">分治算法</el-menu-item>
        </el-menu-item-group>

      </el-submenu>
    </el-menu>
  </el-aside>
  
  <el-container>
    <el-header class="textHeader">
      <span>好好学习，天天向上</span>
    </el-header>
    <el-main>
      <keep-alive> 
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </el-main>
  </el-container>
</el-container>
  </div>

</template>

<script>
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(20).fill(item)
      }
    },
    created(){
       this.trackHandle()
    },
    methods:{
      // 算法页面导航
      trackHandle(){
      this.$router.push('/study/dpApolth')
      },
    searchHandle(){
       this.$router.push('/study/search')
    },
    tanxinHandle(){
       this.$router.push('/study/tanxin')
    },
    fenzhiHandle(){
       this.$router.push('/study/fenzhi')
    },
    // dphandle
    dpghHandle(){
        console.log("小狗");
      this.$router.push('/study/track')
    },
    towHandle(){
      alert("等待完成")
    }


    }
  };
</script>

<style>

  .studyBoard{
    margin-top: 80px;
  }

  .textHeader {
    background-color: #333;
    text-align: center;
    color: white;
    font-size: 25px;
  }
  
  .el-aside {
    color: #333;
  }

</style>
