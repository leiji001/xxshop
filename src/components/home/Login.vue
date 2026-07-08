<script setup lang="ts">
import { ref } from 'vue';

import { useRouter } from 'vue-router';

import { homeApi } from '../../api/home';
import { useUserStore } from '../../store/user';

const router = useRouter();
const userStore = useUserStore();

const ruleForm = ref({
  username: '',
  password: ''
});

const onLogin = async () => {
  try {
    const res = await homeApi.userLogin(ruleForm.value);
    userStore.updateIslogin(1);
    userStore.updateLoginUser(res);
    router.push('/home/uc');
  } catch {}
};
</script>

<template>
  <div class="login-page">
    <div class="login-content">
      <h2 class="login-title">登陆</h2>
      <div class="form-card">
        <van-form>
          <van-cell-group inset>
            <van-field v-model="ruleForm.username" label="用户名" placeholder="请输入用户名" class="neu-field" />
            <van-field v-model="ruleForm.password" label="密码" placeholder="请输入登录密码" class="neu-field" />
            <div class="btn-wrap">
              <van-button color="#7c3aed" class="login-btn" @click="onLogin()">登陆</van-button>
            </div>
          </van-cell-group>
        </van-form>
      </div>
      <p class="reg-hint">还没有账号？<router-link to="/home/reg" class="reg-link">立即注册</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background-color: var(--neu-bg);
}

.login-page :deep(.van-nav-bar) {
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out-sm);
}

.login-page :deep(.van-nav-bar__title) {
  color: var(--neu-heading);
  font-weight: 600;
}

.login-content {
  padding: 32px 24px;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: var(--neu-heading);
  margin-bottom: 28px;
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
  border-radius: var(--neu-radius-btn);
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
  width: 60px;
}

.form-card :deep(.van-field__body input) {
  color: var(--neu-heading);
}

.form-card :deep(.van-field__body input::placeholder) {
  color: #999;
}

.btn-wrap {
  padding: 8px 0 0;
}

.login-btn {
  width: 100%;
  border: none !important;
  border-radius: var(--neu-radius-btn) !important;
  box-shadow: var(--neu-shadow-out-sm) !important;
  font-weight: 500;
  letter-spacing: 1px;
  height: 44px !important;
}

.login-btn:active {
  box-shadow: var(--neu-shadow-in-sm) !important;
  transform: scale(0.98);
}

.reg-hint {
  text-align: center;
  font-size: 14px;
  color: var(--neu-text);
  margin-top: 16px;
}

.reg-link {
  color: var(--neu-accent);
  font-weight: 600;
  text-decoration: none;
}

.reg-link:hover {
  text-decoration: underline;
}
</style>
