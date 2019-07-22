<template>
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
       <el-row>
         <el-col>
           <el-button type="success">添加角色</el-button>
         </el-col>
       </el-row>
       <!-- 角色列表区 -->
       <el-table :data="rolesList" border stripe>
         <!-- 展开列 -->
         <el-table-column type="expand" closable>
           <template slot-scope="scope">
           <el-row v-for="(item1,index) in scope.row.children" :key="item1.id" :class="['bdbottom',index===0? 'bdtop':'','vcenter']">
             <!-- 1级 -->
            <el-col :span="5">
             <el-tag>{{item1.authName}}</el-tag>
             <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 2级 -->
            <el-col :span="19">
              <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="['bdbottom',index2===0? '':'bdtop','vcenter']">
                <!-- 二级列表 -->
                <el-col :span="6">
                 <el-tag type="warning">{{item2.authName}}</el-tag>
                 <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 三级列表 -->
              <el-col :span="18">
                <el-tag v-for="(item3,index3) in item2.children" :key="item3.id" type="danger" closable @close="removeByid(scope.row,item3.id)">
                     {{item3.authName}}
                    <i class="el-icon-caret-right"></i>
                  </el-tag>
              </el-col>
              </el-row>
            </el-col>
            </el-row>
            </template>
         </el-table-column>
         <!-- 索引 -->
    <el-table-column type="index"></el-table-column>
     <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
           <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                <el-button  type="warning" icon="el-icon-share" size="mini" @click="showSetRith(scope.row)">
                  分配权限</el-button>
          </template>
      </el-table-column>
      </el-table>
  </el-card>
  <!-- 分配权限对话框 -->
  <el-dialog
  title="分配权限对话框"
  :visible.sync="setRithVisible"
  width="50%"
  @close="setRightDialog"
 >
  <el-tree :data="rightList" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all
   :default-checked-keys="defkeys"
  ></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRithVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      setRithVisible: false,
      rightList: [],
      treeProps: {
        // 一级权限列表
        label: 'authName',
        // 一级权限列表中有二级childern 父子结点实现嵌套
        children: 'children'
      },
      // 默认要加载出来出的三级权限数据
      defkeys: [],
      // 当前即将分配权限的id
      rloeId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取页面数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
    },
    // 删除用户三级权限
    async removeByid(role, rightid) {
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 成功之后的获取数据
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightid}`)
        console.log(res)

        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 创建成功提示用户删除成功
        this.$message.success(res.meta.msg)
        // 创建成功之后重新调用ajax渲染页面
        this.getRolesList()
      } catch (err) {
        this.$message.info('已撤销改删除')
      }
    },
    // 获取权限列表
    async showSetRith(role) {
      this.rloeId = role.id
      // console.log(role)
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success(res.meta.msg)
      this.rightList = res.data
      // 递归在点击分配权限之前就把所有的数据获取出来
      this.getListdefkeys(role, this.defkeys)
      this.setRithVisible = true
    },
    // 利用一个递归函数 来获取加载进来的默认所有的权限
    getListdefkeys(node, arr) {
      // 如果没有childern属性就三级权限 然后把对应id追加到数组里面
      if (!node.children) {
        return arr.push(node.id)
      }
      // 如果不满足上面的条件就进行调用自己递归循环直到满足条件为止
      node.children.forEach(item =>
        this.getListdefkeys(item, arr))
    },
    setRightDialog() {
      this.defkeys = []
    },
    // 给角色添加权限
    async allotRights() {
      // 定义一个型数组 得到点击的给角色分配角色的id 最后调用第三方的方法给返回回来
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.rloeId}/rights`, { rids: idStr })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRithVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
   .el-tag {
     margin: 8px
   }
   .bdtop{
     border-top: 1px solid #eee
   }
   .bdbottom{
     border-bottom: 1px solid #eee
   }
   .vcenter{
     display: flex;
     align-items: center
   }
</style>
