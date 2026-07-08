<script setup lang="ts">
import { useUserStore } from '../store/user';

const userStore = useUserStore();
</script>

<template>
  <div class="app-wrapper">
    <RouterView />
    <van-tabbar route>
      <van-tabbar-item to="/home/index" name="index" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/home/goods" name="goods" icon="shop-o">商品</van-tabbar-item>
      <van-tabbar-item to="/home/cart" name="cart" icon="cart-o">购物车</van-tabbar-item>
      <van-tabbar-item v-if="userStore.getIslogin > 0" to="/home/uc" name="uc" icon="contact-o">我的</van-tabbar-item>
      <van-tabbar-item v-else to="/home/login" name="login" icon="contact-o">登陆</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
