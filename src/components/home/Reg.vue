<script setup lang="ts">
import { ref } from 'vue';

import { showToast } from 'vant';
import { useRouter } from 'vue-router';

import { homeApi } from '../../api/home';

const router = useRouter();

const regForm = ref({ username: '', password: '', re_password: '', avatar: '' });
const fileList = ref([]);

const afterRead: import('vant').UploaderAfterRead = async (items) => {
  const item = Array.isArray(items) ? items[0] : items;
  if (!item?.file) return;
  try {
    const res = await homeApi.userImgUP(item.file);
    regForm.value.avatar = res.url;
    showToast('头像上传成功');
  } catch {
    showToast('头像上传失败');
  }
};

const register = async () => {
  try {
    await homeApi.userReg(regForm.value);
    router.push('/home/login');
  } catch {}
};
</script>

<template>
  <div class="page-reg">
    <van-nav-bar title="账号注册" />
    <div class="reg-form-wrap">
      <h3 class="reg-title">注册账号</h3>
      <p class="reg-subtitle">请认真填写信息</p>
      <van-cell-group inset>
        <van-field v-model="regForm.username" label="用户名" placeholder="请设置用户名" clearable />
        <span class="upload-label">头像</span>
        <van-uploader v-model="fileList" :after-read="afterRead" :max-count="1" accept="image/*" />
        <van-field v-model="regForm.password" label="密码" type="password" placeholder="请设置登录密码" clearable />
        <van-field v-model="regForm.re_password" label="确认密码" type="password" placeholder="再次输入密码" clearable />
      </van-cell-group>
      <van-button round block type="primary" size="large" @click="register">完成注册</van-button>
      <span class="tip-text">已有账号，马上去<router-link to="/home/login">登录</router-link></span>
    </div>
  </div>
</template>
