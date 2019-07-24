<template>
  <div>
     <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
       <el-row>
         <el-col>
           <el-button type="success" @click="showAddlog">添加分类</el-button>
         </el-col>
       </el-row>
       <!-- 表格 -->
       <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border>
            <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 是否排序 -->
        <template slot="order" slot-scope="scope">
           <el-tag size="medium" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="medium" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="medium" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
           <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
           <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
        </template>
       </tree-table>
       <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
  </el-card>
  <!-- 添加分类的对话框 -->
  <el-dialog
  title="添加角色"
  :visible.sync="addCateDialog"
  width="50%"
  @close="addCatedataRemov"
  >
  <el-form :model="addFromData" :rules="addFromDataRules" ref="addFromDataRef" label-width="100px">
  <el-form-item label="分类名称:" prop="cat_name">
    <el-input v-model="addFromData.cat_name"></el-input>
  </el-form-item>
  <!-- 父级分类 -->
  <el-form-item label="分类名称:">
  <el-cascader
    clearable
    v-model="seletedKeys"
    :options="parentCateList"
    expandTrigger= 'hover'
    :props="clasCateProp"
    @change="pareChange"></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialog = false">取 消</el-button>
    <el-button type="primary" @click="addCatedata">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        // 3级分类
        type: 3,
        // 当前页
        pagenum: 1,
        // 当前页的总条数
        pagesize: 5
      },
      // 接过来的数据
      cateList: [],
      // 总条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      addCateDialog: false,
      // 添加分类的表单数据对象
      addFromData: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是1级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addFromDataRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 获取到的点击添加分类的数据
      parentCateList: [],
      // 联级数据双向绑定数据
      seletedKeys: [],
      // 联级数据对象
      clasCateProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
    },
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
    },
    showAddlog() {
      // 在点击事件之前就调用ajax获取到数据
      this.getParentCatrList()
      this.addCateDialog = true
    },
    // 点击添加获取二级分类 所以只要穿二级过去
    async getParentCatrList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res)
      this.parentCateList = res.data
    },
    // 监听到联级数据变化
    pareChange() {
      if (this.seletedKeys.length > 0) {
        // 父级分类的id
        this.addFromData.cat_pid = this.seletedKeys[this.seletedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addFromData.cat_level = this.seletedKeys.length
      } else {
        this.addFromData.cat_pid = 0
        // 为当前分类的等级赋值
        this.addFromData.cat_level = 0
      }
    },
    // 提交分类数据
    addCatedata() {
      this.$refs.addFromDataRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addFromData)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 重新渲染页面
        this.getCateList()
        this.addCateDialog = false
      })
    },
    // 重置表单
    addCatedataRemov() {
      this.$refs.addFromDataRef.resetFields()
      this.addFromData.cat_level = 0
      this.addFromData.cat_pid = 0
      this.seletedKeys = []
    }
  }
}
</script>
<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>
