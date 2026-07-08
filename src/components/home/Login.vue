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
  <van-nav-bar title="登陆" />
  <h2>登陆</h2>
  <van-form>
    <van-cell-group inset>
      <van-field v-model="ruleForm.username" label="用户名" placeholder="请输入用户名"></van-field>
      <van-field v-model="ruleForm.password" label="密码" placeholder="请输入登录密码"></van-field>
      <van-button color="#1989fa" @click="onLogin()">登陆</van-button>
    </van-cell-group>
  </van-form>
  <p>还没有账号？<router-link to="/home/reg">立即注册</router-link></p>
</template>
