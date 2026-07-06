<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { adminApi } from '../../api/admin';
import type { Category, Goods } from '../../types/admin';

const goodsData = ref<Goods[]>([]);
const categoryData = ref<Category[]>([]);

onBeforeMount(() => {
  adminApi.goodsList().then((res) => (goodsData.value = res));
  adminApi.categoryList().then((res) => (categoryData.value = res));
});
</script>

<template>
  <van-nav-bar title="首页" />
  <van-search placeholder="请输入搜索关键词" />
  <van-swipe :autoplay="3000" indicator-color="white" height="180" lazy-render>
    <van-swipe-item v-for="(value, index) in goodsData" :key="index">
      <img :src="'/api/' + value.picture" />
    </van-swipe-item>
  </van-swipe>
  <van-row>
    <van-col span="6" v-for="(value, index) in categoryData" :key="index">
      <img :src="'/api/' + value.picture" />
      <p>{{ value.name }}</p>
    </van-col>
  </van-row>
  <h1>推荐</h1>
  <van-row>
    <van-col span="12" v-for="(value, index) in goodsData" :key="index">
      <img :src="'/api/' + value.picture" />
      <p>{{ value.name }}</p>
    </van-col>
  </van-row>
  <h1>热销</h1>
  <van-row>
    <van-col span="12" v-for="(value, index) in goodsData" :key="index">
      <img :src="'/api/' + value.picture" />
      <p>{{ value.name }}</p>
    </van-col>
  </van-row>
</template>
