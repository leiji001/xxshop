<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { showToast } from 'vant';
import { useRouter } from 'vue-router';

import { homeApi } from '../../api/home';
import { useCartStore } from '../../store/cart';
import { useUserStore } from '../../store/user';
import type { Category, Goods } from '../../types/home';

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
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
  <div class="page-home">
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
    <van-notice-bar left-icon="volume-o" text="千元内普及2K高刷，爆款显示器限时特惠，满减叠享低至❌折！" />
    <van-grid>
      <van-grid-item v-for="(value, index) in categoryData" :key="index" :text="value.name" :icon="'api' + value.picture" :to="{ path: '/home/goods', query: { category: value.id } }"></van-grid-item>
    </van-grid>
    <van-divider><van-icon name="star" />推荐</van-divider>
    <div class="section-goods-list">
      <van-row justify="space-around">
        <van-col span="10" v-for="(value, index) in goodsDataRecomented" :key="index">
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
    <van-divider><van-icon name="fire" />热销</van-divider>
    <div class="section-goods-list">
      <van-row justify="space-around">
        <van-col span="10" v-for="(value, index) in goodsDataHot" :key="index">
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
.page-home {
  background-color: #f7f8f6;
  min-height: 100vh;
}

/* 轮播图区域 */
.page-home :deep(.van-swipe) {
  margin: 8px 12px;
  border-radius: 12px;
  overflow: hidden;
}

/* 分类图标区域 */
.page-home :deep(.van-grid) {
  background: transparent;
  padding: 4px 0;
}

.page-home :deep(.van-grid-item__content) {
  background: transparent;
  padding: 12px 8px;
}

/* 商品卡片 */
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

/* 通知栏 */
.page-home :deep(.van-notice-bar) {
  background: #e1f5ee;
  color: #1b4d3e;
  border-radius: 8px;
  margin: 8px 12px;
}

/* 分割线 */
.page-home :deep(.van-divider) {
  margin: 16px 0 10px;
  color: #1b4d3e;
  border-color: #e5e7e2;
}
</style>
