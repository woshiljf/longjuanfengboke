<template>
  <div class="myMusic-container">
    <el-container style="height: 100vh; border-right: 1px solid #eee">
      <el-aside
        width="300px"
        height="800px"
        style="background-color: #1e131d;height: auto"
        class="menu-side"
      >
        <el-menu :default-openeds="['2']">
          <el-menu-item index="1-3" @click="frontStudy"
            >前端学习</el-menu-item
          >
          <el-menu-item index="1-4" @click="interviewHandle">面试相关</el-menu-item>
          <el-menu-item index="1-5">设计模式</el-menu-item>

          <el-submenu index="2">
            <template slot="title"
              >数据结构</template
            >

            <el-menu-item
              :index="item.name"
              v-for="item in buildPlayList"
              :key="item.id"
              class="songs-menue"
              style="padding-left: 20px"
            >
              <img :src="item.coverImgUrl" alt="" class="coverImgurl" />
              <span> {{ item.name }}({{ item.trackCount }})</span>
            </el-menu-item>
          </el-submenu>
    
          <el-menu-item index="3">
            <span>排序算法</span>
          </el-menu-item>
     
    

         <el-menu-item :default-openeds="['5']" index="5" @click="trackHandle">回溯算法</el-menu-item>
          <el-menu-item index="6" @click="searchHandle">搜索算法</el-menu-item>



         <el-menu-item index="7" @click="towHandle">双指针</el-menu-item>
          <el-menu-item index="8" @click="fenzhiHandle">分治算法</el-menu-item>
   <el-menu-item index="81" @click="dpghHandle">动态规划</el-menu-item>
         <el-menu-item index="9" @click="tanxinHandle">贪心算法</el-menu-item>
          <el-menu-item index="10" @click="digui">递归</el-menu-item>


        </el-menu>
      </el-aside>

      <el-container>
        <el-main>
          <!-- <button @click="testClick">点我一下</button> -->
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
  components: {
   
  },
  data() {
    return {
      buildPlayList:[
        {
          id:1,
          coverimgUrl:'',
          description: 0,
          name:'小狗',
          trackCount:0
        }

      ]
    };
  },
  created() {
   
    this.trackHandle()
  },
  mounted() {
    // 首次加载，打开喜欢的音乐
   
  },
  methods: {
    
  
    // 算法页面开始
    trackHandle(){
      this.$router.push('/musicPerson/dpApolth')
    },
    // 
    searchHandle(){
       this.$router.push('/musicPerson/search')
    },
    tanxinHandle(){
       this.$router.push('/musicPerson/tanxin')
    },
    fenzhiHandle(){
       this.$router.push('/musicPerson/fenzhi')
    },
    // dphandle
    dpghHandle(){
        console.log("小狗");
      this.$router.push('/musicPerson/track')
    },













  }
};
</script>

<style scope>
.myMusic-container {
  padding: 0 10px;
  background-color: #1e131d;
  min-width: 1420px;
  margin-top: 80px;
  overflow: scroll;
}
.coverImgurl {
  width: 50px;
  height: 50px;
}
.menu-side {
  width: 300px;
  font-size: 25px;
}
.songs-menue {
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
