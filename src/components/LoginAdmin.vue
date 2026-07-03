<script setup lang="ts">
import { reactive, ref } from 'vue';

import type { FormInstance, FormItemRule } from 'element-plus';
import { useRouter } from 'vue-router';

import { adminApi } from '../api/admin';
import { useAdminStore } from '../store/admin';

const router = useRouter();
const adminStore = useAdminStore();
const ruleFormRef = ref<FormInstance>();
const ruleForm = ref({
  username: '',
  pass: ''
});

const checkUsername = (_rule: FormItemRule, value: string, callback: (error?: string | Error) => void) => {
  if (!value) return callback(new Error('请输入账号'));
  if (value.length < 3 || value.length > 12) {
    callback(new Error('请输入登陆账号的长度必须是3-12位'));
  } else {
    callback();
  }
};

const validatePass = (_rule: FormItemRule, value: string, callback: (error?: string | Error) => void) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    callback();
  }
};

const rules = reactive({
  pass: [
    {
      validator: validatePass,
      trigger: 'blur'
    }
  ],
  username: [
    {
      validator: checkUsername,
      trigger: 'blur'
    }
  ]
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    const res = await adminApi.loginAdmin(ruleForm.value);
    adminStore.updateIslogin(1);
    adminStore.updateLoginAdmin(res);
    router.push({ path: '/admin/index' });
  } catch (error) {
    console.error('表单校验失败或请求出错:', error);
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<template>
  <el-card>
    <h3>"微商城"后台登录</h3>
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto">
      <el-form-item label="登陆账号" prop="username">
        <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="登陆密码" prop="pass">
        <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">登陆</el-button>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
