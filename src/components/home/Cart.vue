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
      <van-icon name="cart-o" size="80" color="#ADB5A8" />
      <p class="empty-text">购物车是空的</p>
      <van-button color="#1B4D3E" round to="/home/goods">去逛逛</van-button>
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
          <van-button square text="删除" color="#1B4D3E" class="delete-button" @click="onDelete(item.id)" />
        </template>
      </van-swipe-cell>
    </div>
    <!-- 底部操作栏 -->
    <div v-if="cartStore.carlist.length > 0" class="cart-footer">
      <div class="footer-left">
        <van-checkbox :model-value="cartStore.isAllChecked" @click="cartStore.toggleAllChecked()"> 全选 </van-checkbox>
      </div>
      <div class="footer-center">
        <div class="footer-total">
          <span class="total-label">合计：</span>
          <span class="total-price">￥{{ cartStore.totalPrice }}</span>
        </div>
      </div>
      <div class="footer-right">
        <van-button color="#1B4D3E" plain size="small" class="btn-delete" @click="onDeleteSelected"> 删除 </van-button>
        <van-button color="#1B4D3E" round size="small" class="btn-checkout"> 结算({{ cartStore.selectedCount }}) </van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-page {
  background-color: #f7f8f6;
  min-height: 100vh;
  padding-bottom: 60px;
}

/* 空购物车 */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 120px;
  gap: 16px;
}

.empty-text {
  font-size: 15px;
  color: #8a8d87;
  margin: 0;
}

/* 购物车列表 */
.cart-list {
  padding: 10px 0;
}

.cart-item {
  display: flex;
  align-items: center;
  background: #ffffff;
  margin: 0 12px 10px;
  padding: 12px;
  border-radius: 12px;
  border: 0.5px solid #e5e7e2;
  gap: 10px;
}

.item-img {
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  color: #333333;
  margin: 0 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  font-size: 16px;
  font-weight: 600;
  color: #1b4d3e;
  margin: 0;
}

.delete-button {
  height: 100%;
  border-radius: 0;
}

/* 底部操作栏 */
.cart-footer {
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
  gap: 8px;
}

.footer-left {
  flex-shrink: 0;
}

.footer-center {
  flex: 1;
  text-align: right;
  padding-right: 8px;
}

.total-label {
  font-size: 14px;
  color: #333333;
}

.total-price {
  font-size: 16px;
  font-weight: 600;
  color: #1b4d3e;
}

.footer-right {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn-delete {
  border-radius: 18px;
}

.btn-checkout {
  border-radius: 18px;
}
</style>
