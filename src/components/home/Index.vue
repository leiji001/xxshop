<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { showToast } from 'vant';
import { useRouter } from 'vue-router';

import { homeApi } from '../../api/home';
import { useCartStore } from '../../store/cart';
import type { Category, Goods } from '../../types/home';

const router = useRouter();
const cartStore = useCartStore();
const goodsDataRecomented = ref<Goods[]>([]);
const goodsDataHot = ref<Goods[]>([]);
const goodsData = ref<Goods[]>([]);
const categoryData = ref<Category[]>([]);
const keyword = ref<string>('');

onBeforeMount(() => {
  homeApi.goodsList().then((res) => (goodsData.value = res));
  homeApi.goodsRecommend().then((res) => (goodsDataRecomented.value = res));
  homeApi.goodsHot().then((res) => (goodsDataHot.value = res));
  homeApi.categoryList().then((res) => (categoryData.value = res));
});

const onSearch = () => {
  if (keyword.value.trim()) {
    router.push({ path: '/home/goods', query: { keyword: keyword.value.trim() } });
  }
};

/** 加入购物车 */
const addCart = (item: Goods) => {
  cartStore.addCart({
    id: item.id,
    name: item.name,
    picture: item.picture,
    price: item.price,
    nums: 1,
    stock: item.stock,
    checked: true
  });
  showToast('已加入购物车');
};
</script>

<template>
  <van-nav-bar title="首页" />
  <van-search v-model="keyword" show-action placeholder="请输入搜索商品关键词" @search="onSearch">
    <template #action>
      <div @click="onSearch">搜索</div>
    </template>
  </van-search>
  <van-swipe :autoplay="3000" indicator-color="white" height="240" lazy-render>
    <van-swipe-item v-for="(value, index) in goodsData" :key="index">
      <van-image width="100%" height="240" :src="'/api/' + value.picture" />
    </van-swipe-item>
  </van-swipe>
  <van-notice-bar left-icon="volume-o" text="无论我们能活多久，我们能够享受的只有无法分割的此刻，此外别无其他。" />
  <van-grid>
    <van-grid-item v-for="(value, index) in categoryData" :key="index" :text="value.name" :icon="'api' + value.picture" :to="{ path: '/home/goods' }"></van-grid-item>
  </van-grid>
  <van-divider><van-icon name="star" />推荐</van-divider>
  <van-row justify="space-around">
    <van-col span="10" v-for="(value, index) in goodsDataRecomented" :key="index">
      <router-link :to="'/home/show/' + value.id">
        <van-image width="100%" height="200" :src="'/api/' + value.picture" lazy-load />
        <p>{{ value.name }}</p>
        <p>￥{{ value.price }}</p>
        <p>可购{{ value.stock }}</p>
      </router-link>
      <van-button color="#ee0a24" size="mini" @click="addCart(value)">加入购物车</van-button>
    </van-col>
  </van-row>
  <van-divider><van-icon name="fire" />热销</van-divider>
  <van-row justify="space-around">
    <van-col span="10" v-for="(value, index) in goodsDataHot" :key="index">
      <router-link :to="'/home/show/' + value.id">
        <van-image width="100%" height="200" :src="'/api/' + value.picture" lazy-load />
        <p>{{ value.name }}</p>
        <p>￥{{ value.price }}</p>
        <p>可购{{ value.stock }}</p>
      </router-link>
      <van-button color="#ee0a24" size="mini" @click="addCart(value)">加入购物车</van-button>
    </van-col>
  </van-row>
</template>
