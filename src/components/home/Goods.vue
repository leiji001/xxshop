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
  <div class="goods-page">
    <van-nav-bar title="商品列表" class="neu-nav" />
    <div class="search-wrap">
      <van-search v-model="keyword" show-action placeholder="请输入搜索商品关键词" @search="onSearch">
        <template #action>
          <div @click="onSearch" class="search-action">搜索</div>
        </template>
      </van-search>
    </div>
    <div class="goods-section">
      <van-row justify="space-around">
        <van-col span="10" v-for="(value, index) in goodsData" :key="index">
          <div class="goods-card">
            <router-link :to="'/home/show/' + value.id" class="goods-link">
              <div class="goods-img-wrap">
                <van-image width="100%" height="200" :src="'/api/' + value.picture" lazy-load />
              </div>
              <p class="goods-name">{{ value.name }}</p>
              <p class="goods-price">￥{{ value.price }}</p>
              <p class="goods-stock">可购{{ value.stock }}</p>
            </router-link>
            <van-button color="#7c3aed" size="mini" class="cart-add-btn" @click="addCart(value)">加入购物车</van-button>
          </div>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<style scoped>
.goods-page {
  min-height: 100vh;
  background-color: var(--neu-bg);
  padding-bottom: 12px;
}

/* 导航栏 */
.goods-page :deep(.van-nav-bar) {
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out-sm);
}

.goods-page :deep(.van-nav-bar__title) {
  color: var(--neu-heading);
  font-weight: 600;
}

/* 搜索栏 */
.search-wrap {
  padding: 12px 12px 0;
}

.search-wrap :deep(.van-search) {
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-btn);
  box-shadow: var(--neu-shadow-in);
  padding: 4px 12px;
}

.search-wrap :deep(.van-field__body) {
  background: transparent;
}

.search-wrap :deep(.van-search__action) {
  color: var(--neu-accent);
  font-weight: 600;
}

.search-action {
  color: var(--neu-accent);
  font-weight: 600;
}

/* 商品卡片 */
.goods-section {
  padding: 12px 12px 0;
}

.goods-card {
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-card);
  box-shadow: var(--neu-shadow-out);
  padding: 12px;
  margin-bottom: 12px;
  transition: all 0.25s ease;
  text-align: center;
}

.goods-card:hover {
  box-shadow: var(--neu-shadow-out-sm);
}

.goods-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.goods-img-wrap {
  border-radius: var(--neu-radius-sm);
  overflow: hidden;
  box-shadow: var(--neu-shadow-in-sm);
  margin-bottom: 8px;
}

.goods-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--neu-heading);
  margin: 6px 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--neu-accent);
  margin: 2px 0;
}

.goods-stock {
  font-size: 12px;
  color: #999;
  margin: 2px 0 8px;
}

.cart-add-btn {
  border: none !important;
  border-radius: var(--neu-radius-btn) !important;
  font-weight: 500;
  box-shadow: var(--neu-shadow-out-sm);
  transition: all 0.2s ease !important;
}

.cart-add-btn:active {
  box-shadow: var(--neu-shadow-in-sm) !important;
  transform: scale(0.96);
}
</style>
