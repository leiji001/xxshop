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
  <div class="page-login">
    <van-nav-bar title="登陆" />
    <div class="login-form-wrap">
      <h3 class="login-title">登陆</h3>
      <van-form>
        <van-cell-group inset>
          <van-field v-model="ruleForm.username" label="用户名" placeholder="请输入用户名"></van-field>
          <van-field v-model="ruleForm.password" label="密码" placeholder="请输入登录密码"></van-field>
          <van-button color="#1B4D3E" @click="onLogin()">登陆</van-button>
        </van-cell-group>
      </van-form>
      <p class="login-footer">还没有账号？<router-link to="/home/reg">立即注册</router-link></p>
    </div>
  </div>
</template>

<style scoped>
.page-login {
  background-color: #f7f8f6;
  min-height: 100vh;
}

.login-form-wrap {
  padding: 40px 20px;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: #1b4d3e;
  margin: 0 0 24px;
}

.login-form-wrap :deep(.van-cell-group) {
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
}

.login-form-wrap :deep(.van-cell-group .van-button) {
  margin: 10px 12px;
  border-radius: 8px;
  width: calc(100% - 24px);
}

.login-footer {
  text-align: center;
  font-size: 14px;
  color: #8a8d87;
  margin-top: 20px;
}

.login-footer a {
  color: #1b4d3e;
  text-decoration: none;
}
</style>
