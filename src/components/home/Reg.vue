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
      <van-button round block color="#1B4D3E" size="large" @click="register">完成注册</van-button>
      <span class="tip-text">已有账号，马上去<router-link to="/home/login">登录</router-link></span>
    </div>
  </div>
</template>

<style scoped>
.page-reg {
  background-color: #f7f8f6;
  min-height: 100vh;
}

.reg-form-wrap {
  padding: 30px 20px;
}

.reg-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #1b4d3e;
  margin: 0;
}

.reg-subtitle {
  text-align: center;
  font-size: 14px;
  color: #8a8d87;
  margin: 6px 0 24px;
}

.reg-form-wrap :deep(.van-cell-group) {
  border-radius: 12px;
  margin-bottom: 16px;
  padding: 8px 0;
}

.upload-label {
  display: block;
  padding: 10px 16px 4px;
  font-size: 14px;
  color: #333333;
}

.reg-form-wrap :deep(.van-uploader) {
  padding: 0 16px 10px;
}

.tip-text {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #8a8d87;
  margin-top: 20px;
}

.tip-text a {
  color: #1b4d3e;
  text-decoration: none;
}
</style>
