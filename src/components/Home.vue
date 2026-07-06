<script setup lang="ts"></script>

<template>
  <RouterView />
  <van-tabbar route>
    <van-tabbar-item to="/home/index" name="index" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/home/goods" name="goods" icon="shop-o">商品</van-tabbar-item>
    <van-tabbar-item to="/home/shopcar" name="cart" icon="cart-o">购物车</van-tabbar-item>
    <van-tabbar-item to="/home/uc" name="uc" icon="contact-o">我的</van-tabbar-item>
  </van-tabbar>
</template>
