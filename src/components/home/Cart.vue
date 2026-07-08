<script setup lang="ts">
import { showConfirmDialog, showToast } from 'vant';

import { useCartStore } from '../../store/cart';

const cartStore = useCartStore();

const onDelete = (id: number) => {
  showConfirmDialog({ title: '提示', message: '确定删除该商品吗？' }).then(() => {
    cartStore.delCart(id);
    showToast('已删除');
  });
};

const onDeleteSelected = () => {
  if (cartStore.selectedList.length === 0) {
    showToast('请选择要删除的商品');
    return;
  }
  showConfirmDialog({ title: '提示', message: '确定删除选中的商品吗？' }).then(() => {
    cartStore.delSelected();
    showToast('已删除');
  });
};
</script>

<template>
  <div class="shop-page">
    <van-nav-bar title="购物车" />
    <!-- 空购物车 -->
    <div v-if="cartStore.carlist.length === 0" class="empty-cart">
      <van-icon name="cart-o" size="80" color="#c8c9cc" />
      <p class="empty-text">购物车是空的</p>
      <van-button type="primary" round to="/home/goods">去逛逛</van-button>
    </div>
    <!-- 购物车列表 -->
    <div v-else class="cart-list">
      <van-swipe-cell v-for="item in cartStore.carlist" :key="item.id">
        <div class="cart-item">
          <van-checkbox :model-value="item.checked" @click="cartStore.toggleCheck(item.id)" />
          <van-image class="item-img" width="80" height="80" :src="'/api/' + item.picture" />
          <div class="item-info">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-price">￥{{ item.price }}</p>
          </div>
          <van-stepper :model-value="item.nums" :min="1" :max="item.stock" @change="(val) => cartStore.updateNums(item.id, val)" />
        </div>
        <template #right>
          <van-button square text="删除" type="danger" class="delete-button" @click="onDelete(item.id)" />
        </template>
      </van-swipe-cell>
    </div>
    <!-- 底部操作栏 -->
    <div v-if="cartStore.carlist.length > 0" class="cart-footer">
      <van-checkbox :model-value="cartStore.isAllChecked" @click="cartStore.toggleAllChecked()"> 全选 </van-checkbox>
      <div class="footer-total">
        <span class="total-label">合计：</span>
        <span class="total-price">￥{{ cartStore.totalPrice }}</span>
      </div>
      <van-button type="danger" size="small" class="btn-delete" @click="onDeleteSelected"> 删除 </van-button>
      <van-button type="primary" round size="small" class="btn-checkout"> 结算({{ cartStore.selectedCount }}) </van-button>
    </div>
  </div>
</template>

<style scoped></style>
