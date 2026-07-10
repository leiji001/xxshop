<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { useRouter } from 'vue-router';

import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const router = useRouter();

const userInfo = ref();

onBeforeMount(() => {
  userInfo.value = userStore.getLoginUser;
});

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
    <div class="user-profile">
      <van-image round width="10rem" height="10rem" :src="'/api/' + userInfo.avatar" class="avatar" />
      <p class="user-name">{{ userInfo.username }}</p>
      <van-button size="small" color="#1B4D3E" round>编辑资料</van-button>
    </div>
    <van-cell-group class="menu-group">
      <van-cell title="我的订单" is-link icon="orders-o" />
      <van-cell title="收货地址" is-link icon="location-o" />
      <van-cell title="我的收藏" is-link icon="star-o" />
      <van-cell title="优惠券" is-link icon="coupon-o" />
      <van-cell title="设置" is-link icon="setting-o" />
      <van-cell title="关于我们" is-link icon="info-o" />
    </van-cell-group>
    <div class="uc-content">
      <van-button color="#1B4D3E" plain round block class="logout-btn" @click="onLogOut()">退出登陆</van-button>
    </div>
  </div>
</template>

<style scoped>
.page-uc {
  background-color: #f7f8f6;
  min-height: 100vh;
  padding-bottom: 60px;
}

/* 用户信息区 */
.user-profile {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px 24px;
  margin-bottom: 10px;
}

.user-profile :deep(.avatar) {
  border: 3px solid #e1f5ee;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 12px 0 14px;
}

/* 菜单区 */
.menu-group {
  margin: 0 12px;
  border-radius: 12px;
  overflow: hidden;
}

.menu-group :deep(.van-cell__left-icon) {
  color: #1b4d3e;
}

/* 退出按钮 */
.uc-content {
  padding: 30px 20px;
}

.logout-btn {
  border-radius: 22px;
}
</style>
