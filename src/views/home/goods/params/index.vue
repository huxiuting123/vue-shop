<template>
  <div>
   <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert show-icon :closable="false" title="注意！只允许为第三级分类设置相关参数" type="warning"></el-alert>
      <!-- 选择商品分类区域 -->
       <el-row class="cat_opt">
         <el-col>
           <span type="success">选择商品分类:</span>
           <!-- 级联选择器 -->
           <el-cascader
            v-model="selectedCateKeys"
            :options="cates"
            expandTrigger="hover"
            :props="cateprops"
            @change="handleChange"></el-cascader>
         </el-col>
       </el-row>
       <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handTabeClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="success" :disabled="isBtnDisabled" @click="getAddCick">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="getManyData" border stripe>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
               <el-table-column label="操作">
                 <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="small" @click="editUpData(scope.row.attr_id)">修改</el-button>
                     <el-button type="danger" icon="el-icon-delete" size="small" @click="delitDataList(scope.row.attr_id)">删除</el-button>
                 </template>
               </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="success" :disabled="isBtnDisabled" @click="getAddCick">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="getOnlyData" border stripe>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
               <el-table-column label="操作">
                 <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="small" @click="editUpData(scope.row.attr_id)">修改</el-button>
                     <el-button type="danger" icon="el-icon-delete" size="small" >删除</el-button>
                 </template>
               </el-table-column>
          </el-table>
        </el-tab-pane>
     </el-tabs>
  </el-card>
  <!-- 添加参数区域 -->
   <el-dialog
      :title="'添加'+TitleTex"
      :visible.sync="getAddData"
      width="50%"
      @close="addDilog"
      >
     <el-form :model="addFromdata" :rules="addFromdataRules" ref="addFromdataRef" label-width="100px">
  <el-form-item label="分类名称:" prop="attr_name">
    <el-input v-model="addFromdata.attr_name"></el-input>
  </el-form-item>
  </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="getAddData = false">取 消</el-button>
        <el-button type="primary" @click="getParamsData">确 定</el-button>
      </span>
</el-dialog>
<!-- 修改参数区域 -->
<el-dialog
      :title="'添加'+TitleTex"
      :visible.sync="geteditData"
      width="50%"
      @close="editDilog"
      >
     <el-form :model="editFromdata" :rules="editFromdataRules" ref="editFromdataRef" label-width="100px">
  <el-form-item label="分类名称:" prop="attr_name">
    <el-input v-model="editFromdata.attr_name"></el-input>
  </el-form-item>
  </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="geteditData = false">取 消</el-button>
        <el-button type="primary" @click="editParamsData">确 定</el-button>
      </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cates: [],
      // 联动的展示属性
      cateprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 联级数据
      selectedCateKeys: {},
      activeName: 'many',
      // 动态参数数据
      getManyData: [],
      // 静态参数数据
      getOnlyData: [],
      getAddData: false,
      // 验证规则数据
      addFromdataRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      // 添加表单数据对象
      addFromdata: {
        attr_name: ''
      },
      // 修改数据
      editFromdata: {},
      geteditData: false,
      // 验证表单数据规则
      editFromdataRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCates()
  },
  methods: {
    async getCates() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)
      this.cates = res.data
    },
    // 级联选中项变化 会监听到这个函数
    handleChange() {
      this.getparamsData()
    },
    // 监听点击的标签参数
    handTabeClick() {
      this.getparamsData()
      // console.log(this.activeName)
    },
    // 抽离出发送ajax给联级变更的时候调用和点击切换标签参数的时候调用
    async  getparamsData() {
      if (this.selectedCateKeys.length !== 3) return this.selectedCateKeys = []
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      // console.log(res)
      // 因为所有的数据都在res.data上面 不好区分到底是动态参数还是静态参数
      if (this.activeName === 'many') {
        this.getManyData = res.data
        // console.log(this.getManyData)
      } else {
        this.getOnlyData = res.data
      }
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // return this.$message.success(res.meta.msg)
    },
    getAddCick() {
      this.getAddData = true
    },
    // 调用第三方的方法重置添加动态数据获取静态数据的表格
    addDilog() {
      this.$refs.addFromdataRef.resetFields()
    },
    // 点击确定提交参数传参数到后台并且渲染页面
    getParamsData() {
      this.$refs.addFromdataRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_sel: this.activeName,
          attr_name: this.addFromdata.attr_name
        }
        )
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 调用自己渲染页面 因为自己就是获取参数的
        this.getparamsData()
        this.getAddData = false
      })
    },
    // 修改数据获根据id查取到数据
    async editUpData(id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, { params: { attr_sel: this.activeName } })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 根据id查询到数据信息 赋值给修改表单
      this.editFromdata = res.data
      this.geteditData = true
    },
    editDilog() {
      this.$refs.editFromdataRef.resetFields()
    },
    // 点击确定表单预校验成功之后发起编辑ajxa请求
    editParamsData() {
      // 修改框里面有数据之后进行预验证
      this.$refs.editFromdataRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editFromdata.attr_id}`, { attr_sel: this.activeName, attr_name: this.editFromdata.attr_name })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 调用上面那个抽离出来的函数 判断修改的是静态的还是动态的
        this.getparamsData()
        this.geteditData = false
      })
    },
    // 根据id删除参数
    async delitDataList(id) {
      // console.log(id)
      // 搭配es6和es7一起使用try成功 catch失败
      try {
        await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 成功之后的获取数据
        const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
        console.log(res)
        // console.log(id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 创建成功提示用户删除成功
        this.$message.success(res.meta.msg)
        // 创建成功之后重新调用ajax渲染页面
        // 调用上面那个抽离出来的函数 判断修改的是静态的还是动态的
        this.getparamsData()
      } catch (err) {
        this.$message.info('已撤销改删除')
      }
    }
  },
  // 计算属性 监听联级的数据是否是第三级 如果是第三级标签按钮就会禁用
  computed: {
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 这个计算函数里面包括了放回回来的第三级数据id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        // 获取到的联级的第三级数据 第三级的索引为【2】
        return this.selectedCateKeys[2]
      }
      // 如果没有获取到的话就返回一个空
      return null
    },
    TitleTex() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态参数'
      }
    }
  }
}
</script>
<style lang="less" scoped>
 .cat_opt{
   margin: 15px 0;
 }
</style>
