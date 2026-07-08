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
  <div class="uc-page">
    <van-nav-bar title="个人中心" class="neu-nav" />
    <div class="uc-content">
      <div class="user-avatar-card">
        <div class="avatar-circle">
          <van-icon name="contact-o" size="48" color="#7c3aed" />
        </div>
        <p class="user-name">{{ userStore.getLoginUser.username || '未登录' }}</p>
      </div>
      <div class="menu-card">
        <div class="menu-item">
          <van-icon name="orders-o" size="20" class="menu-icon" />
          <span class="menu-text">我的订单</span>
          <van-icon name="arrow" size="16" class="menu-arrow" />
        </div>
        <div class="menu-item">
          <van-icon name="location-o" size="20" class="menu-icon" />
          <span class="menu-text">收货地址</span>
          <van-icon name="arrow" size="16" class="menu-arrow" />
        </div>
        <div class="menu-item">
          <van-icon name="coupon-o" size="20" class="menu-icon" />
          <span class="menu-text">我的优惠券</span>
          <van-icon name="arrow" size="16" class="menu-arrow" />
        </div>
      </div>
      <div class="logout-wrap">
        <van-button class="logout-btn" @click="onLogOut()">退出登陆</van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.uc-page {
  min-height: 100vh;
  background-color: var(--neu-bg);
}

.uc-page :deep(.van-nav-bar) {
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out-sm);
}

.uc-page :deep(.van-nav-bar__title) {
  color: var(--neu-heading);
  font-weight: 600;
}

.uc-content {
  padding: 24px 16px;
}

/* 用户头像卡片 */
.user-avatar-card {
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-card);
  box-shadow: var(--neu-shadow-out);
  padding: 32px 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--neu-heading);
  margin: 0;
}

/* 菜单卡片 */
.menu-card {
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-card);
  box-shadow: var(--neu-shadow-out);
  padding: 8px;
  margin-bottom: 24px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 12px;
  border-radius: var(--neu-radius-btn);
  transition: box-shadow 0.2s ease;
  cursor: pointer;
}

.menu-item:active {
  box-shadow: var(--neu-shadow-in-sm);
}

.menu-item + .menu-item {
  box-shadow: 0 -1px 0 #e0e0e0;
}

.menu-icon {
  color: var(--neu-accent);
  margin-right: 12px;
  flex-shrink: 0;
}

.menu-text {
  flex: 1;
  font-size: 15px;
  color: var(--neu-text);
  font-weight: 500;
}

.menu-arrow {
  color: #bbb;
  flex-shrink: 0;
}

/* 退出按钮 */
.logout-wrap {
  padding: 0 16px;
}

.logout-btn {
  width: 100%;
  background-color: var(--neu-bg) !important;
  border: none !important;
  border-radius: var(--neu-radius-btn) !important;
  box-shadow: var(--neu-shadow-out-sm) !important;
  color: #ef4444 !important;
  font-weight: 500;
  height: 44px !important;
}

.logout-btn:active {
  box-shadow: var(--neu-shadow-in-sm) !important;
  transform: scale(0.98);
}
</style>
