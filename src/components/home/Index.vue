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
  <div class="index-page">
    <van-nav-bar title="首页" class="neu-nav" />
    <div class="search-wrap">
      <van-search v-model="keyword" show-action placeholder="请输入搜索商品关键词" @search="onSearch">
        <template #action>
          <div @click="onSearch" class="search-action">搜索</div>
        </template>
      </van-search>
    </div>
    <div class="swipe-wrap">
      <van-swipe :autoplay="3000" indicator-color="white" height="240" lazy-render>
        <van-swipe-item v-for="(value, index) in goodsData" :key="index">
          <van-image width="100%" height="240" :src="'/api/' + value.picture" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="notice-wrap">
      <van-notice-bar left-icon="volume-o" text="无论我们能活多久，我们能够享受的只有无法分割的此刻，此外别无其他。" />
    </div>
    <div class="category-wrap">
      <van-grid>
        <van-grid-item v-for="(value, index) in categoryData" :key="index" :text="value.name" :icon="'api' + value.picture" :to="{ path: '/home/goods' }"></van-grid-item>
      </van-grid>
    </div>
    <div class="divider-wrap">
      <van-divider class="neu-divider"><van-icon name="star" />推荐</van-divider>
    </div>
    <div class="goods-section">
      <van-row justify="space-around">
        <van-col span="10" v-for="(value, index) in goodsDataRecomented" :key="index">
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
    <div class="divider-wrap">
      <van-divider class="neu-divider"><van-icon name="fire" />热销</van-divider>
    </div>
    <div class="goods-section">
      <van-row justify="space-around">
        <van-col span="10" v-for="(value, index) in goodsDataHot" :key="index">
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
.index-page {
  min-height: 100vh;
  background-color: var(--neu-bg);
  padding-bottom: 12px;
}

/* 导航栏 */
.index-page :deep(.van-nav-bar) {
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out-sm);
}

.index-page :deep(.van-nav-bar__title) {
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

/* 轮播 */
.swipe-wrap {
  padding: 12px 12px 0;
}

.swipe-wrap :deep(.van-swipe) {
  border-radius: var(--neu-radius-card);
  overflow: hidden;
  box-shadow: var(--neu-shadow-out);
}

/* 通知栏 */
.notice-wrap {
  padding: 12px 12px 0;
}

.notice-wrap :deep(.van-notice-bar) {
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out-sm);
  border-radius: var(--neu-radius-btn);
  color: var(--neu-text);
}

.notice-wrap :deep(.van-notice-bar__left-icon) {
  color: var(--neu-accent);
}

/* 分类导航 */
.category-wrap {
  padding: 12px 12px 0;
}

.category-wrap :deep(.van-grid) {
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-card);
  box-shadow: var(--neu-shadow-out);
  padding: 8px 0;
}

.category-wrap :deep(.van-grid-item__text) {
  color: var(--neu-text);
  font-weight: 500;
}

.category-wrap :deep(.van-grid-item__content) {
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-btn);
  transition: box-shadow 0.2s ease;
}

.category-wrap :deep(.van-grid-item__content:active) {
  box-shadow: var(--neu-shadow-in-sm);
}

/* 分割线 */
.divider-wrap {
  padding: 0 12px;
}

.neu-divider :deep(.van-divider__text) {
  color: var(--neu-heading);
  font-weight: 600;
  background-color: var(--neu-bg);
  padding: 0 16px;
}

.neu-divider :deep(.van-icon) {
  color: var(--neu-accent);
  margin-right: 4px;
}

/* 商品卡片 */
.goods-section {
  padding: 0 12px 12px;
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
