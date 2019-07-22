<template>
  <el-container class="home-container">
  <el-header>
    <div>
      <img src="./heima.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
  <el-container>
    <el-aside :width="width">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      :unique-opened="true"
      :collapse="iscollapse"
      :collapse-transition="false"
      router
      :default-active="isactive"
      >
      <!-- 一级菜单 -->
      <el-submenu :index="menu.id+''" v-for="menu in menus" :key="menu.id">
        <!-- 一级模板区 -->
        <template slot="title">
          <!-- 图标 调用下面的字体数据对象 [menu.id]是生成的时候的数据-->
          <i :class="iconsObj[menu.id]"></i>
          <!-- 文本 -->
          <span>{{menu.authName}}</span>
        </template>
        <!-- 二级菜单 通过for循环生成一级导航菜单 :index="submenu.id+''" 因为是循环生成的所以点击一个菜单所有的菜单都会跟着一起 所以绑定id 因为是唯一的 注意必须是字符串-->
         <el-menu-item :index="'/'+submenu.path" v-for="submenu in menu.children" :key="submenu.id" @click="savePath('/'+submenu.path)">
           <template slot="title">
               <!-- 图标 -->
          <i class="el-icon-location-outline"></i>
          <!-- 文本 -->
          <span>{{submenu.authName}}</span>
        </template>
         </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <router-view>

      </router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>

export default {
  data: () => ({
    menus: [],
    // 这个是在一级导航时候循环的时候生成字体图标前面是id号 后面是字体图片的类名 以键值对的形式
    iconsObj: {
      '125': 'iconfont icon-user',
      '103': 'iconfont icon-tijikongjian',
      '101': 'iconfont icon-shangpin',
      '102': 'iconfont icon-danju',
      '145': 'iconfont icon-baobiao'
    },
    // 是否开启折叠菜单导航默认是false
    iscollapse: false,
    isactive: ''
  }),
  // 在生命周期中是vue实例化数据对象就是刚刚有数据的时候所以在这里请求是罪最快的
  created() {
    // 调用下面发送ajax请求函数
    this.getMenus()
    this.isactive = sessionStorage.getItem('isactive')
  },
  methods: {
    // 点击的时候清空本地存储并且用编程式导航跳转到登录页面
    logout () {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 请求数据
    async getMenus() { // 为什么要搭配async await 因为得到的数据就是promist
      const { data: { data, meta } } = await this.$http.get('menus')
      if (meta.status !== 200) return this.$Message.error(meta.msg)
      // console.log(data)
      this.menus = data
    },
    // 收缩导航菜单栏如果点击|||时候取反
    toggleCollapse() {
      this.iscollapse = !this.iscollapse
    },
    savePath(active) {
      this.isactive = active
      sessionStorage.setItem('isactive', active)
    }
  },
  // 计算属性 如果菜单导航收缩时候 这个菜单导航的宽度也要跟着一起变化这时候就判断toggleCollapse的状态
  computed: {
    width() {
      return this.iscollapse ? '64px' : '200px'
    }
  }
}
</script>
<style lang="less" scoped>
.home-container{
  height: 100%
}
.el-header {
    background-color: #373d41;
    display: flex;
    padding-left: 0;
    justify-content: space-between;
    align-items: center ;
    color: #fff;
    font-size: 20px;
     >div{
       display: flex;
       align-items: center ;
      span{
         margin-left: 15px;
      }
    }
  }

  .el-aside{
    background-color: #333744;

  .iconfont {
  margin-right: 10px;
  }
  .el-menu{
    border-right: 0;
  }
 }

  .el-main{
    background-color: #eaedf1;
  }

 .toggle-button{
   background-color: #4a5064;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;

 }
</style>
