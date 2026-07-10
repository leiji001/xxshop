<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';

import { ElMessage, type FormInstance, type UploadData, type UploadFile, type UploadProps } from 'element-plus';

import { adminApi } from '../../api/admin';
import type { User } from '../../types/admin';

const ruleFormRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const tableData = ref<User[]>([]);
const id = ref(0);
const pass = ref('');
const salt = ref('');

const user = ref<User>({
  id: 0,
  username: '',
  avatar: ''
});

const rules = reactive({
  username: [
    { required: true, message: '请填写用户名称', trigger: 'blur' },
    { min: 2, max: 80, message: '用户名称长度必须2-80位', trigger: 'blur' }
  ],
  password: [
    { required: false, message: '请填写密码', trigger: 'blur' },
    { min: 6, max: 32, message: '密码长度必须6-32位', trigger: 'blur' }
  ],
  salt: [{ required: false, message: '请填写密码盐', trigger: 'blur' }]
});

onBeforeMount(async () => {
  adminApi.userList().then((res) => (tableData.value = res));
});

const openDialog = async (ids?: number) => {
  dialogFormVisible.value = true;
  if (ids && ids > 0) {
    id.value = ids;
    const res = await adminApi.user(ids);
    user.value = res;
    imageUrl.value = '/api/' + res.avatar;
  }
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    if (id.value > 0) {
      await adminApi.userUpdate({
        id: user.value.id,
        username: user.value.username,
        avatar: user.value.avatar
      });
    } else {
      await adminApi.userAdd({
        username: user.value.username,
        avatar: user.value.avatar,
        password: pass.value,
        salt: salt.value
      });
    }
    tableData.value = await adminApi.userList();
    resetForm();
  } catch (error) {
    console.error('表单校验失败或请求出错:', error);
  }
};

const deleteUser = async (ids: number) => {
  await adminApi.userDel(ids);
  tableData.value = await adminApi.userList();
};

const resetForm = () => {
  dialogFormVisible.value = false;
  user.value = {
    id: 0,
    username: '',
    avatar: ''
  };
  imageUrl.value = '';
};

// 图片上传
const imageUrl = ref('');
const handleAvatarSuccess: UploadData['onSuccess'] = (response: { data: { url: string } }, uploadFile: UploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  user.value.avatar = response.data.url;
};
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!');
    return false;
  }
  return true;
};
</script>
<template>
  <div class="page-container">
    <h2 class="page-title">用户管理</h2>

    <div class="page-card">
      <el-button type="primary" @click="openDialog()">添加用户</el-button>
      <el-divider border-style="solid" />
      <el-table :data="tableData" border>
        <el-table-column width="60" prop="id" label="编号" />
        <el-table-column width="80" label="头像">
          <template #default="scope"><el-image :src="'/api/' + scope.row.avatar" /></template>
        </el-table-column>
        <el-table-column prop="username" label="用户名称" />
        <el-table-column width="160" fixed="right" label="操作">
          <template #default="scope">
            <el-button size="small" @click="deleteUser(scope.row.id)">删除</el-button>
            <el-button type="primary" size="small" @click="openDialog(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- 添加、编辑用户弹窗 -->
  <el-dialog v-model="dialogFormVisible" :title="id ? '编辑用户' : '添加用户'" width="520px" class="form-dialog">
    <el-form ref="ruleFormRef" :model="user" :rules="rules" label-width="auto">
      <el-form-item label="用户名称" prop="username">
        <el-input v-model="user.username" />
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="pass" type="password" />
      </el-form-item>
      <el-form-item label="密码盐" prop="salt">
        <el-input v-model="salt" />
      </el-form-item>
      <el-form-item label="用户头像">
        <el-upload action="/api/admin/user/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" />
          <el-icon v-else class="avatar-uploader-icon"><i-ep-plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
        <el-button @click="resetForm()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #111111;
  margin: 0 0 24px 0;
  letter-spacing: -0.02em;
}

.page-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 24px;
}

.page-card .el-divider {
  margin: 20px 0;
}
</style>
