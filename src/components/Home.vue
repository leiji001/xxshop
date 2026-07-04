<script setup lang="ts"></script>

<template>
  <RouterView />
  <van-tabbar>
    <van-tabbar-item to="/home/index" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item to="/home/goods" icon="search">商品</van-tabbar-item>
  </van-tabbar>
</template>
