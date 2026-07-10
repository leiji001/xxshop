<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { showToast } from 'vant';
import { useRoute, useRouter } from 'vue-router';

import { homeApi } from '../../api/home';
import { useCartStore } from '../../store/cart';
import { useUserStore } from '../../store/user';
import type { Goods } from '../../types/home';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
const goodsData = ref<Goods[]>([]);
const keyword = ref<string>('');

onBeforeMount(() => {
  const params = {} as { keyword?: string; category_id?: number };
  if (route.query.keyword) {
    keyword.value = route.query.keyword as string;
    params.keyword = keyword.value;
  }
  if (route.query.category) params.category_id = Number(route.query.category);
  homeApi.goodsList(params).then((res) => (goodsData.value = res));
});

const onSearch = () => {
  router.replace({ query: { keyword: keyword.value } });
  homeApi.goodsList({ keyword: keyword.value }).then((res) => (goodsData.value = res));
};

const addCart = (item: Goods) => {
  if (userStore.islogin > 0) {
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
  } else {
    router.push('/home/login');
  }
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
            <van-button color="#1B4D3E" size="mini" @click="addCart(value)">加入购物车</van-button>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<style scoped>
.page-goods {
  background-color: #f7f8f6;
  min-height: 100vh;
}

.section-goods-list {
  padding: 0 10px;
}

.goods-card {
  background: #ffffff;
  border: 0.5px solid #e5e7e2;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 12px;
  padding-bottom: 10px;
}

.goods-card a {
  text-decoration: none;
  color: inherit;
}

.goods-card :deep(.van-image) {
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.goods-name {
  margin: 8px 10px 4px;
  font-size: 14px;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-price {
  margin: 0 10px;
  font-size: 16px;
  font-weight: 600;
  color: #1b4d3e;
}

.goods-stock {
  margin: 2px 10px 0;
  font-size: 12px;
  color: #8a8d87;
}

.goods-card .van-button {
  margin: 6px 10px 0;
  border-radius: 8px;
}
</style>
