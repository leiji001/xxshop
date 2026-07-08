<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const router = useRouter();

const onLogOut = () => {
  userStore.updateIslogin(0);
  userStore.updateLoginUser({
    id: 0,
    username: '',
    avatar: ''
  });
  router.push('/home/login');
};
</script>

<template>
  <div class="page-uc">
    <van-nav-bar title="个人中心" />
    <div class="uc-content">
      <van-button class="logout-btn" @click="onLogOut()">退出登陆</van-button>
    </div>
  </div>
</template>
