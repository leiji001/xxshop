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
  <div class="reg-page">
    <van-nav-bar title="账号注册" class="neu-nav" />
    <div class="reg-content">
      <h2 class="reg-title">注册账号</h2>
      <p class="reg-desc">请认真填写信息</p>
      <div class="form-card">
        <van-cell-group inset>
          <van-field v-model="regForm.username" label="用户名" placeholder="请设置用户名" clearable class="neu-field" />
          <div class="upload-wrap">
            <span class="upload-label">头像</span>
            <van-uploader v-model="fileList" :after-read="afterRead" :max-count="1" accept="image/*" class="neu-uploader" />
          </div>
          <van-field v-model="regForm.password" label="密码" type="password" placeholder="请设置登录密码" clearable class="neu-field" />
          <van-field v-model="regForm.re_password" label="确认密码" type="password" placeholder="再次输入密码" clearable class="neu-field" />
        </van-cell-group>
        <div class="btn-wrap">
          <van-button round block type="primary" class="reg-btn" @click="register">完成注册</van-button>
        </div>
      </div>
      <p class="login-hint">已有账号，马上去<router-link to="/home/login" class="login-link">登录</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.reg-page {
  min-height: 100vh;
  background-color: var(--neu-bg);
}

.reg-page :deep(.van-nav-bar) {
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out-sm);
}

.reg-page :deep(.van-nav-bar__title) {
  color: var(--neu-heading);
  font-weight: 600;
}

.reg-content {
  padding: 32px 24px;
}

.reg-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: var(--neu-heading);
  margin-bottom: 4px;
}

.reg-desc {
  text-align: center;
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
}

.form-card {
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-card);
  box-shadow: var(--neu-shadow-out);
  padding: 16px;
  margin-bottom: 20px;
}

.form-card :deep(.van-cell-group) {
  background: transparent;
}

.form-card :deep(.van-cell-group__body) {
  background: transparent;
}

.form-card :deep(.van-cell) {
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-btn);
  box-shadow: var(--neu-shadow-in);
  margin-bottom: 12px;
  padding: 10px 12px;
}

.form-card :deep(.van-cell::after) {
  display: none;
}

.form-card :deep(.van-field__label) {
  color: var(--neu-text);
  font-weight: 500;
  width: 65px;
}

.form-card :deep(.van-field__body input) {
  color: var(--neu-heading);
}

.form-card :deep(.van-field__body input::placeholder) {
  color: #999;
}

.upload-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  margin-bottom: 12px;
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-btn);
  box-shadow: var(--neu-shadow-in);
}

.upload-label {
  color: var(--neu-text);
  font-weight: 500;
  font-size: 14px;
  width: 65px;
  flex-shrink: 0;
}

.neu-uploader :deep(.van-uploader__upload) {
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out-sm);
  border: none;
  border-radius: var(--neu-radius-btn);
  margin: 0;
}

.neu-uploader :deep(.van-uploader__upload:active) {
  box-shadow: var(--neu-shadow-in-sm);
}

.neu-uploader :deep(.van-uploader__preview-image) {
  border-radius: var(--neu-radius-btn);
}

.btn-wrap {
  padding: 8px 0 0;
}

.reg-btn {
  background-color: var(--neu-accent) !important;
  border: none !important;
  border-radius: var(--neu-radius-btn) !important;
  box-shadow: var(--neu-shadow-out-sm) !important;
  font-weight: 500;
  letter-spacing: 1px;
  height: 44px !important;
}

.reg-btn:active {
  box-shadow: var(--neu-shadow-in-sm) !important;
  transform: scale(0.98);
}

.login-hint {
  text-align: center;
  font-size: 14px;
  color: var(--neu-text);
  margin-top: 16px;
  display: block;
}

.login-link {
  color: var(--neu-accent);
  font-weight: 600;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
