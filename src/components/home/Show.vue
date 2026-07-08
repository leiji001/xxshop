<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { showToast } from 'vant';
import { useRoute, useRouter } from 'vue-router';

import { homeApi } from '../../api/home';
import { useCartStore } from '../../store/cart';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const goodsID = Number(route.params.id);
const goods = ref({ id: 0, category_id: 0, name: '', price: '', picture: '', stock: 0, spec: '', description: '', is_hot: 0, is_recomented: 0, category_name: '' });

const onClickLeft = () => router.back();

const addCart = () => {
  const { id, name, picture, price, stock } = goods.value;
  cartStore.addCart({ id, name, picture, price, stock, nums: 1, checked: true });
  showToast('已加入购物车');
};

onBeforeMount(() => {
  homeApi.goods(goodsID).then((res) => (goods.value = res));
});
</script>

<template>
  <div class="show-page">
    <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <div class="show-content">
      <div class="goods-image-wrap">
        <van-image width="100%" height="360px" :src="'/api/' + goods.picture" />
      </div>
      <div class="goods-info-card">
        <div class="goods-meta">
          <span class="category-tag">{{ goods.category_name }}</span>
          <h3 class="goods-title">{{ goods.name }}</h3>
          <div class="price-row">
            <van-tag type="danger" size="large" class="price-tag">¥{{ goods.price }}</van-tag>
            <van-tag v-if="goods.is_hot > 0" color="#7c3aed" size="large" class="badge-tag">热销</van-tag>
            <van-tag v-if="goods.is_recomented > 0" color="#10b981" size="large" class="badge-tag">推荐</van-tag>
          </div>
        </div>
      </div>
      <div class="goods-detail-card">
        <div class="detail-row">
          <span class="detail-label">产品规格</span>
          <span class="detail-value">{{ goods.spec }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">库存数量</span>
          <span class="detail-value">{{ goods.stock }}</span>
        </div>
      </div>
      <div class="goods-desc-card">
        <h3 class="desc-title">商品介绍</h3>
        <p class="desc-text">{{ goods.description }}</p>
      </div>
      <div class="action-bar">
        <div class="action-icons">
          <van-icon name="chat-o" size="24" class="icon-item" />
          <van-icon name="star-o" size="24" class="icon-item" />
        </div>
        <div class="action-buttons">
          <van-button type="warning" round size="large" class="cart-btn" @click="addCart()">加入购物车</van-button>
          <van-button type="danger" round size="large" class="buy-btn">立即购买</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.show-page {
  min-height: 100vh;
  background-color: var(--neu-bg);
  padding-bottom: 24px;
}

.show-page :deep(.van-nav-bar) {
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out-sm);
}

.show-page :deep(.van-nav-bar__title) {
  color: var(--neu-heading);
  font-weight: 600;
}

.show-page :deep(.van-nav-bar__text) {
  color: var(--neu-text);
}

.show-page :deep(.van-nav-bar__arrow) {
  color: var(--neu-text);
}

.show-content {
  padding: 12px;
}

/* 商品图片 */
.goods-image-wrap {
  border-radius: var(--neu-radius-card);
  overflow: hidden;
  box-shadow: var(--neu-shadow-out);
  margin-bottom: 12px;
}

/* 商品信息卡片 */
.goods-info-card {
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-card);
  box-shadow: var(--neu-shadow-out);
  padding: 16px;
  margin-bottom: 12px;
}

.goods-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-tag {
  font-size: 12px;
  color: #999;
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-in-sm);
  padding: 2px 10px;
  border-radius: 10px;
  display: inline-block;
  width: fit-content;
}

.goods-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--neu-heading);
  margin: 0;
  line-height: 1.4;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.price-tag {
  border: none !important;
  border-radius: var(--neu-radius-btn) !important;
  font-weight: 700 !important;
  padding: 4px 16px !important;
  background-color: var(--neu-accent) !important;
}

.badge-tag {
  border: none !important;
  border-radius: var(--neu-radius-btn) !important;
  font-weight: 500 !important;
  padding: 4px 12px !important;
}

/* 详情卡片 */
.goods-detail-card {
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-card);
  box-shadow: var(--neu-shadow-out);
  padding: 16px;
  margin-bottom: 12px;
}

.detail-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.detail-row + .detail-row {
  border-top: 1px solid #e0e0e0;
}

.detail-label {
  font-size: 14px;
  color: #999;
  width: 80px;
  flex-shrink: 0;
}

.detail-value {
  font-size: 14px;
  color: var(--neu-heading);
  font-weight: 500;
}

/* 商品介绍卡片 */
.goods-desc-card {
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-card);
  box-shadow: var(--neu-shadow-out);
  padding: 16px;
  margin-bottom: 12px;
}

.desc-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--neu-heading);
  margin: 0 0 10px;
  padding-bottom: 10px;
  box-shadow: 0 1px 0 #e0e0e0;
}

.desc-text {
  font-size: 14px;
  color: var(--neu-text);
  line-height: 1.8;
}

/* 操作栏 */
.action-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-icons {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 8px 0;
}

.icon-item {
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out-sm);
  border-radius: 50%;
  padding: 10px;
  color: var(--neu-text);
  transition: all 0.2s ease;
}

.icon-item:active {
  box-shadow: var(--neu-shadow-in-sm);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.cart-btn {
  flex: 1;
  border: none !important;
  box-shadow: var(--neu-shadow-out-sm) !important;
  font-weight: 500;
}

.cart-btn:active {
  box-shadow: var(--neu-shadow-in-sm) !important;
  transform: scale(0.98);
}

.buy-btn {
  flex: 1;
  border: none !important;
  box-shadow: var(--neu-shadow-out-sm) !important;
  font-weight: 500;
}

.buy-btn:active {
  box-shadow: var(--neu-shadow-in-sm) !important;
  transform: scale(0.98);
}
</style>
