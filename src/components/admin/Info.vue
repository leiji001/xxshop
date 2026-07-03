<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';

import type { FormInstance, UploadData, UploadFile, UploadProps } from 'element-plus';

import { adminApi } from '../../api/admin';
import { useAdminStore } from '../../store/admin';
import type { Admin } from '../../types/admin';

const ruleFormRef = ref<FormInstance>();
const adminStore = useAdminStore();
const form = ref<Admin & { pass: string; salt: string }>({
  id: 0,
  username: '',
  avatar: '',
  pass: '',
  salt: ''
});

onBeforeMount(() => {
  const admin = adminStore.getLoginAdmin;
  form.value.id = admin.id;
  form.value.username = admin.username;
  form.value.avatar = admin.avatar;
  imageUrl.value = '/api/' + form.value.avatar;
});

const rules = reactive({
  username: [
    { required: true, message: '请输入登录账号', trigger: 'blur' },
    { min: 2, max: 20, message: '账号长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  pass: [{ min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }],
  salt: [{ min: 6, max: 20, message: '盐值长度在 6 到 20 个字符', trigger: 'blur' }]
});

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    adminApi.adminUpdate({
      id: form.value.id,
      username: form.value.username,
      avatar: form.value.avatar,
      password: form.value.pass,
      salt: form.value.salt
    });
  } catch (error) {
    console.error('表单校验失败或请求出错:', error);
  }
};

// 图片上传
const imageUrl = ref('');
const handleAvatarSuccess: UploadData['onSuccess'] = (_response: { data: { url: string } }, uploadFile: UploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
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
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin/index' }">商城管理后台</el-breadcrumb-item>
      <el-breadcrumb-item>信息设置</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="auto" style="max-width: 500px">
        <el-form-item label="登录账号" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="登录密码" prop="pass">
          <el-input v-model="form.pass" type="password" show-password />
        </el-form-item>
        <el-form-item label="登录盐" prop="salt">
          <el-input v-model="form.salt" />
        </el-form-item>
        <el-form-item label="用户头像">
          <el-upload action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" />
            <el-icon v-else class="avatar-uploader-icon"><i-ep-plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(ruleFormRef)">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
