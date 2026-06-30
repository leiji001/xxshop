<script setup>
import { inject, onBeforeMount, reactive, ref } from 'vue';

import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const axios = inject('$axios');
let dialogFormVisible = ref(false); // 默认弹窗隐藏
let id = ref(0);
//打开弹窗
const openDialog = (ids) => {
  id.value = ids;
  dialogFormVisible.value = true;

  if (id.value > 0) {
    axios.get('/api/admin/admin/' + id.value).then((res) => {
      if (res.status == 200) {
        user.value = res.data.data;
      }
    });
  }
};

const ruleFormRef = ref();
//存储单个用户的变量
const user = ref({
  id: 0,
  username: '', //用户名称
  password: '', //密码
  salt: '' //密码盐
});
//表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请填写用户名称', trigger: 'blur' },
    { min: 2, max: 80, message: '用户名称长度必须2-80位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请填写密码', trigger: 'blur' },
    { min: 6, max: 32, message: '密码长度必须6-32位', trigger: 'blur' }
  ],
  salt: [{ required: true, message: '请填写密码盐', trigger: 'blur' }]
});
//表单提交
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (id.value > 0) {
        axios.post('/api/admin/admin/update', user.value).then((res) => {
          if (res.status == 200) {
            ElMessage.success(res.data.msg);
            dialogFormVisible.value = false;
            getAdminList();
            user.value = {
              id: 0,
              username: '',
              password: '',
              salt: ''
            };
          }
        });
      } else {
        axios.post('/api/admin/admin/add', user.value).then((res) => {
          if (res.status == 200) {
            ElMessage.success(res.data.msg);
            dialogFormVisible.value = false;
            getAdminList();
            user.value = {
              id: 0,
              username: '',
              password: '',
              salt: ''
            };
          }
        });
      }
    } else {
      console.log('验证失败!', fields);
    }
  });
};

const resetForm = (formEl) => {
  dialogFormVisible.value = false;
  user.value = {
    id: 0,
    username: '',
    password: '',
    salt: ''
  };
};

//表格数据
const tableData = ref([]);
//挂载前读取
onBeforeMount(() => {
  getAdminList();
});

//请求读取数据
const getAdminList = () => {
  axios
    .get('/api/admin/admin/list')
    .then((res) => {
      tableData.value = res.data.data;
    })
    .catch((e) => {
      console.log(e);
    });
};

//删除用户
const deleteAdmin = (ids) => {
  axios.post('/api/admin/admin/delete', { id: ids }).then((res) => {
    if (res.status == 200) {
      ElMessage.success(res.data.msg);
      getAdminList();
    }
  });
};
</script>
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin/index' }">商城管理后台</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="width: 100%; margin-top: 20px">
      <el-button type="primary" @click="openDialog()">添加用户</el-button>
      <el-divider border-style="dotted" />
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="用户编号" width="180" />
        <el-table-column prop="username" label="用户名称" width="180" />
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <el-button type="danger" size="small" @click="deleteAdmin(scope.row.id)">删除</el-button>
            <el-button type="primary" size="small" @click="openDialog(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <!-- 添加、编辑用户弹窗 -->
  <el-dialog v-model="dialogFormVisible" :title="id ? '编辑用户' : '添加用户'" width="70%">
    <el-form ref="ruleFormRef" style="max-width: 1000px" :model="user" :rules="rules" label-width="auto">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="user.username" />
      </el-form-item>

      <el-form-item label="登录密码" prop="password">
        <el-input v-model="user.password" type="password" />
      </el-form-item>

      <el-form-item label="密码盐" prop="salt">
        <el-input v-model="user.salt" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 确认 </el-button>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.el-button + .el-button {
  margin-left: 8px;
}
</style>
