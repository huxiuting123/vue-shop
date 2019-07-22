<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户链表区域 -->
      <el-table :data="usersList" border stripe>
        <el-table-column type="index"></el-table-column>
       <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column  label="邮箱" prop="email"></el-table-column>
       <el-table-column  label="用户权限" prop="role_name"></el-table-column>
       <el-table-column  label="电话" prop="mobile"></el-table-column>
       <el-table-column  label="状态" >
         <!-- 修改状态 -->
         <template slot-scope="scope">
           <!-- 为什么要用作用域插槽 因为子组件只负责布局上面的渲染 父组件负责操控数据 因为要传值mg_state-->
           <!-- {{scope.row}} 作用域插槽 这个方法可以看到这一行的所有数据这个方法第三方提供的 -->
           <el-switch
             v-model="scope.row.mg_state" @change="UsersStateChange(scope.row)"
             >
          </el-switch>
         </template>
       </el-table-column>
        <el-table-column  label="操作" width="175px">
          <!--  -->
          <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="shouEdit(scope.row.id)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deltUsersByid(scope.row.id)"></el-button>
            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable='false'>
              <el-button type="warning" icon="el-icon-share" size="mini" @click="clickgetRow(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[2, 3, 5, 7]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog
     title="添加用户"
    :visible.sync="addDialogVisible"
    width="50%"
     @close="clearformData"
    >
    <!-- 内容主体区域:model="addForm"数据双向绑定  ref="addFormRules" 判断表单中的验证-->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" >
       <el-form-item label="用户名" prop="username">
         <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
         <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
         <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile" >
         <el-input v-model="addForm.mobile" maxlength="11"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
     <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改用户 -->
<el-dialog
    title="添加用户"
    :visible.sync="EdietDialogVisible"
    width="50%"
     @close="EditformData"
    >
    <!-- 内容主体区域:model="addForm"数据双向绑定  ref="addFormRules" 判断表单中的验证-->
    <el-form :model="mydata" :rules="mydataRules" ref="mydataRef" label-width="70px" >
       <el-form-item label="用户名" prop="username">
         <el-input v-model="mydata.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
         <el-input v-model="mydata.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile" >
         <el-input v-model="mydata.mobile" maxlength="11"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
     <span slot="footer" class="dialog-footer">
    <el-button @click="EdietDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="idteUersInfo">确 定</el-button>
  </span>
</el-dialog>
    </el-card>

      <!-- 分配权限对话框 -->
  <el-dialog
  title="分配权限对话框"
  :visible.sync="setRightsDialog"
  width="50%"
   @close="dletesformData"
 >
  <!-- <el-tree :data="rightList" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all
   :default-checked-keys="defkeys"
  ></el-tree> -->
  <div>
    <p>当前的用户:{{usersInfor.username}}</p>
    <p>当前的角色:{{usersInfor.role_name}}</p>
    <p>分配新角色:
        <el-select v-model="selectedRoleId" placeholder="请选择">
    <el-option
      v-for="item in roleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightsDialog = false">取 消</el-button>
    <el-button type="primary" @click="setRightInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1, // 当前页
        pagesize: 2 // 每页显示几条数据
      },
      // 自定义参数接收来自己请求过来的数据
      usersList: [],
      total: 0,
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '密码的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      EdietDialogVisible: false,
      mydata: {},
      mydataRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      setRightsDialog: false,
      // 分配角色的数据
      usersInfor: {},
      // 所有角色链表数据
      roleList: [],
      // 已选择的角色
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // params是get请求携带参数的一种方法
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户失败')
      // 因为得到的数据要保存在本地好渲染所以赋值给data里面的自定义好的数据
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 页条
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 页码
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      // 从新渲染一下页面 让下一页的时候有数据
      this.getUserList()
    },
    async UsersStateChange(UsersStatefo) {
      console.log(UsersStatefo)
      const { data: res } = await this.$http.put(`users/${UsersStatefo.id}/state/${UsersStatefo.mg_state}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        UsersStatefo.mg_state = !UsersStatefo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    // 重置清空表单
    clearformData() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      // this.addDialogVisible = true
      // 在添加用户之前进行预验证方法是第三方提供的
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // console.log(valid)
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        // 创建成功提示用户创建成功
        this.$message.success(res.meta.msg)
        // 创建成功之后关闭窗口
        this.addDialogVisible = false
        // 创建成功之后重新调用ajax渲染页面
        this.getUserList()
      })
    },
    async shouEdit(id) {
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.mydata = res.data
      this.EdietDialogVisible = true
    },
    // 监听用户关闭对话框事件
    EditformData() {
      this.$refs.mydataRef.resetFields()
    },
    // 表单提交之前的校验
    idteUersInfo() {
      // this.addDialogVisible = true
      // 在添加用户之前进行预验证方法是第三方提供的
      this.$refs.mydataRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // console.log(valid)
        // 效验成功修改数据
        const { data: res } = await this.$http.put('users/' + this.mydata.id, this.mydata)
        // console.log(res)
        // console.log(this.mydata.id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 创建成功提示用户创建成功
        this.$message.success(res.meta.msg)
        // 创建成功之后关闭窗口
        this.EdietDialogVisible = false
        // 创建成功之后重新调用ajax渲染页面
        this.getUserList()
      })
    },
    async deltUsersByid(id) {
      // console.log(id)
      // 搭配es6和es7一起使用try成功 catch失败
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 成功之后的获取数据
        const { data: res } = await this.$http.delete('users/' + id)
        console.log(res)
        console.log(this.mydata.id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 创建成功提示用户删除成功
        this.$message.success(res.meta.msg)
        // 创建成功之后重新调用ajax渲染页面
        this.getUserList()
      } catch (err) {
        this.$message.info('已撤销改删除')
      }
    },
    // 分配角色的数据
    async  clickgetRow(usersInfor) {
      this.usersInfor = usersInfor
      console.log(usersInfor)
      // 获取角色数据
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.roleList = res.data
      this.setRightsDialog = true
    },
    // 提价修改数据
    async setRightInfo() {
      if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色')
      const { data: res } = await this.$http.put(`users/${this.usersInfor.id}/role`, { rid: this.selectedRoleId })
      // console.log(this.usersInfor.id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.setRightsDialog = false
      this.getUserList()
    },
    // 重置数据
    dletesformData() {
      this.selectedRoleId = ''
      this.usersInfor = {}
    }
  }
}
</script>
<style >
</style>
