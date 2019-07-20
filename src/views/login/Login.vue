<template>
 <div class="login_container">
   <img src="./bg3.jpg" alt="">
    <div class="login_box">
       <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="./tx1.jpg" alt="">
      </div>
    <el-form class="login_form" :model="loginFrom" :rules="loginRules" ref="loginRef">
         <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginFrom.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
      <el-form-item class="btns">
           <el-button type="primary" @click="isLogin">登录</el-button>
          <el-button type="info" @click="resetlogin">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单绑定数据区域
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证区域输入的内容是否合法是element-ui里面自带的
      loginRules: {
        usname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],

        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetlogin () {
      // console.log(this)指向from表单
      this.$refs.loginRef.resetFields()// this里面有$refs这个方法指向表单上面定义的loginRef名字后直接调用element-ui里面的函数
      this.loginFrom.usname = this.loginFrom.password = ''// 点击重置之后清空表单里面所有的数据
    },
    // 登录之前的预验证
    isLogin () {
      this.$refs.loginRef.validate(async valid => {
        if (valid) {
          // 用es7的方法搭配ajax发送请求注意await asyns
          const { data: res } = await this.$http.post('login', this.loginFrom)
          // console.log(res)
          // 如果转态的信息不等于200就登录失败
          if (res.meta.status !== 200) {
            this.$message.error('登录失败')// error失败
          } else {
            this.$message.success('登录成功')// success成功
            // 登录成功之后把token值保存到本地存储sessionStorage页面关闭时候消失
            sessionStorage.setItem('token', res.data.token)
            // 通过路由导航跳转到home页面
            this.$router.push('/home')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

.login_container {
  background-color: #2b4b6b;
  height: 100%;
  img{
    width: 100%;
    height: 100%;
  }
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

.avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
 }
 .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  .btns {
    display: flex;
    justify-content: flex-end;
     }
   }
}
</style>
