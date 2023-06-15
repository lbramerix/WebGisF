<template>
  <div>
    <el-button type="primary" @click="showTableDialog = true">打开表格</el-button>
    <el-dialog title="表格弹窗" :visible.sync="showTableDialog" :close-on-click-modal="false">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="年龄" prop="age"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="primary" size="mini" @click="openSubTable(scope.row)">路线规划</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="编辑弹窗" :visible.sync="showEditDialog">
      <el-form :model="editFormData" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editFormData.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model.number="editFormData.age"></el-input>
        </el-form-item>
        <!-- 其他表单项 -->
        <el-form-item>
          <el-button type="primary" @click="submitEditForm">保存</el-button>
          <el-button @click="showEditDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="路线规划弹窗" :visible.sync="showSubTableDialog">
      <el-table :data="subTableData" style="width: 100%">
        <el-table-column label="操作" width="120">
          <!-- 这里可以放置一些操作按钮，如删除、编辑等 -->
        </el-table-column>
        <el-table-column label="指令" prop="instruction"></el-table-column>
        <el-table-column label="方向" prop="orientation"></el-table-column>
        <el-table-column label="距离" prop="distance"></el-table-column>
        <el-table-column label="时长" prop="duration"></el-table-column>
        <!-- 其他列 -->
      </el-table>

    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTableDialog: false, // 控制表格弹窗的显示隐藏
      showEditDialog: false, // 控制编辑弹窗的显示隐藏
      showSubTableDialog: false, // 控制路线规划弹窗的显示隐藏
      tableData: [
        { name: '张三', age: 18 },
        { name: '李四', age: 25 },
        { name: '王五', age: 30 }
      ],
      subTableData: [
        { start: '北京', end: '上海' },
        { start: '广州', end: '深圳' },
        { start: '成都', end: '重庆' }
      ],
      editFormData: {
        name: '',
        age: ''
      },
      editIndex: -1 // 当前编辑的行索引，用来保存修改后的数据
    }
  },
  methods: {
    handleEdit(row) {
      // 将当前行的数据赋值给编辑弹窗表单的初始值
      this.editFormData = Object.assign({}, row)
      this.editIndex = this.tableData.indexOf(row)
      // 打开编辑弹窗
      this.showEditDialog = true
    },
    submitEditForm() {
      // 处理表单数据，例如将其保存到数据库或显示给用户看
      console.log(`姓名：${this.editFormData.name}，年龄：${this.editFormData.age}`)
      // 将修改后的数据保存到表格数据中
      this.tableData.splice(this.editIndex, 1, this.editFormData)
      // 隐藏编辑弹窗
      this.showEditDialog = false
    },
    openSubTable(row) {
      // 根据当前行的数据，查询相关路线数据并更新到subTableData中
      // ...
      // 显示路线规划弹窗
      this.showSubTableDialog = true
    }
  }
}
</script>
