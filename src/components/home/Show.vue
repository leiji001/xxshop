<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { showToast } from 'vant';
import { useRoute, useRouter } from 'vue-router';

import { homeApi } from '../../api/home';
import { useCartStore } from '../../store/cart';
import { useUserStore } from '../../store/user';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();

const goodsID = Number(route.params.id);
const goods = ref({ id: 0, category_id: 0, name: '', price: '', picture: '', stock: 0, spec: '', description: '', is_hot: 0, is_recomented: 0, category_name: '' });

const onClickLeft = () => router.back();

const addCart = () => {
  if (userStore.islogin > 0) {
    const { id, name, picture, price, stock } = goods.value;
    cartStore.addCart({ id, name, picture, price, stock, nums: 1, checked: true });
    showToast('已加入购物车');
  } else {
    router.push('/home/login');
  }
};

onBeforeMount(() => {
  homeApi.goods(goodsID).then((res) => (goods.value = res));
});
</script>

<template>
  <div class="page-show">
    <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-image width="100%" height="360px" :src="'/api/' + goods.picture"></van-image>
    <div class="goods-basic-info">
      <span class="goods-category">{{ goods.category_name }}</span>
      <div class="goods-name">{{ goods.name }}</div>
      <div class="goods-tags">
        <van-tag color="#1B4D3E" size="large">¥{{ goods.price }}</van-tag>
        <van-tag v-if="goods.is_hot > 0" color="#1B4D3E" plain size="large">热销</van-tag>
        <van-tag v-if="goods.is_recomented > 0" color="#1B4D3E" plain size="large">推荐</van-tag>
      </div>
    </div>
    <div class="goods-spec-info">
      <div class="info-row">
        <span class="info-label">产品规格</span><span class="info-value">{{ goods.spec }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">库存数量</span><span class="info-value">{{ goods.stock }}</span>
      </div>
    </div>
    <div class="goods-desc">
      <h4 class="desc-title">商品介绍</h4>
      <div class="desc-content">{{ goods.description }}</div>
    </div>
    <div class="goods-actions">
      <div class="action-icons">
        <van-icon name="chat-o" size="24" class="icon-item" />
        <van-icon name="star-o" size="24" class="icon-item" />
      </div>
      <div class="action-buttons">
        <van-button color="#1B4D3E" round size="large" class="cart-btn" @click="addCart()">加入购物车</van-button>
        <van-button color="#1B4D3E" plain round size="large" class="buy-btn">立即购买</van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-show {
  background-color: #f7f8f6;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* 商品图片 */
.page-show :deep(.van-image) {
  display: block;
}

/* 基本信息区 */
.goods-basic-info {
  background: #ffffff;
  padding: 16px;
  margin: 0;
}

.goods-category {
  font-size: 12px;
  color: #8a8d87;
  background: #edefea;
  padding: 2px 8px;
  border-radius: 4px;
}

.goods-name {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin: 10px 0 12px;
  line-height: 1.4;
}

.goods-tags {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 规格信息 */
.goods-spec-info {
  background: #ffffff;
  margin-top: 10px;
  padding: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 0.5px solid #e5e7e2;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #8a8d87;
}

.info-value {
  color: #333333;
}

/* 商品介绍 */
.goods-desc {
  background: #ffffff;
  margin-top: 10px;
  padding: 16px;
}

.desc-title {
  font-size: 16px;
  font-weight: 600;
  color: #1b4d3e;
  margin: 0 0 10px;
  padding-left: 10px;
  border-left: 3px solid #1b4d3e;
}

.desc-content {
  font-size: 14px;
  color: #333333;
  line-height: 1.8;
}

/* 底部操作栏 */
.goods-actions {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  background: #ffffff;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-top: 0.5px solid #e5e7e2;
  z-index: 100;
  gap: 12px;
}

.action-icons {
  display: flex;
  gap: 16px;
}

.icon-item {
  color: #8a8d87;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex: 1;
}

.cart-btn,
.buy-btn {
  flex: 1;
  border-radius: 22px;
  font-size: 15px;
}
</style>
