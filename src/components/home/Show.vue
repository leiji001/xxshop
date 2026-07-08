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
  <div class="page-show">
    <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-image width="100%" height="360px" :src="'/api/' + goods.picture"></van-image>
    <div class="goods-basic-info">
      <span class="goods-category">{{ goods.category_name }}</span>
      <div class="goods-name">{{ goods.name }}</div>
      <div class="goods-tags">
        <van-tag type="danger" size="large">¥{{ goods.price }}</van-tag>
        <van-tag v-if="goods.is_hot > 0" color="#f245f3" size="large">热销</van-tag>
        <van-tag v-if="goods.is_recomented > 0" color="#269745" size="large">推荐</van-tag>
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
        <van-button type="warning" round size="large" class="cart-btn" @click="addCart()">加入购物车</van-button>
        <van-button type="danger" round size="large" class="buy-btn">立即购买</van-button>
      </div>
    </div>
  </div>
</template>
