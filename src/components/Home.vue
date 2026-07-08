<script setup lang="ts">
import { useUserStore } from '../store/user';

const userStore = useUserStore();
</script>

<template>
  <div class="home-layout">
    <RouterView />
    <van-tabbar route class="neu-tabbar">
      <van-tabbar-item to="/home/index" name="index" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/home/goods" name="goods" icon="shop-o">商品</van-tabbar-item>
      <van-tabbar-item to="/home/cart" name="cart" icon="cart-o">购物车</van-tabbar-item>
      <van-tabbar-item v-if="userStore.getIslogin > 0" to="/home/uc" name="uc" icon="contact-o">我的</van-tabbar-item>
      <van-tabbar-item v-else to="/home/login" name="login" icon="contact-o">登陆</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped>
.home-layout {
  min-height: 100vh;
  background-color: var(--neu-bg);
  padding-bottom: 50px;
}

/* ===== 新拟态底部导航 ===== */
.neu-tabbar {
  background-color: var(--neu-bg) !important;
  box-shadow: var(--neu-shadow-out);
  border: none;
  padding-top: 4px;
  height: 50px;
}

.neu-tabbar :deep(.van-tabbar-item) {
  color: var(--neu-text);
  border-radius: var(--neu-radius-btn);
  margin: 0 4px;
  transition: all 0.2s ease;
}

.neu-tabbar :deep(.van-tabbar-item--active) {
  color: var(--neu-accent) !important;
  box-shadow: var(--neu-shadow-in-sm);
  background-color: var(--neu-bg);
  font-weight: 600;
}

.neu-tabbar :deep(.van-tabbar-item__icon) {
  font-size: 20px;
}

.neu-tabbar :deep(.van-tabbar-item--active .van-tabbar-item__icon) {
  color: var(--neu-accent);
}
</style>
