<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { showToast } from 'vant';
import { useRoute, useRouter } from 'vue-router';

import { homeApi } from '../../api/home';
import { useCartStore } from '../../store/cart';
import type { Goods } from '../../types/home';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const goodsData = ref<Goods[]>([]);
const keyword = ref<string>('');

onBeforeMount(() => {
  if (route.query.keyword) keyword.value = route.query.keyword as string;
  homeApi.goodsList({ keyword: keyword.value }).then((res) => (goodsData.value = res));
});

const onSearch = () => {
  router.replace({ query: { keyword: keyword.value } });
  homeApi.goodsList({ keyword: keyword.value }).then((res) => (goodsData.value = res));
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
  <div class="page-goods">
    <van-nav-bar title="商品列表" />
    <van-search v-model="keyword" show-action placeholder="请输入搜索商品关键词" @search="onSearch">
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <div class="section-goods-list">
      <van-row justify="space-around">
        <van-col span="10" v-for="(value, index) in goodsData" :key="index">
          <div class="goods-card">
            <router-link :to="'/home/show/' + value.id">
              <van-image width="100%" height="200" :src="'/api/' + value.picture" lazy-load />
              <p class="goods-name">{{ value.name }}</p>
              <p class="goods-price">￥{{ value.price }}</p>
              <p class="goods-stock">可购{{ value.stock }}</p>
            </router-link>
            <van-button color="#ee0a24" size="mini" @click="addCart(value)">加入购物车</van-button>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>
