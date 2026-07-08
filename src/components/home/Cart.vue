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

<style scoped>
.shop-page {
  min-height: 100vh;
  background-color: var(--neu-bg);
  padding-bottom: 60px;
}

/* 空购物车 */
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

.empty-cart .empty-text {
  margin: 16px 0 24px;
  color: var(--neu-text);
  font-size: 16px;
}

.empty-cart .van-button--primary {
  background-color: var(--neu-accent) !important;
  border: none;
  border-radius: var(--neu-radius-btn);
  box-shadow: var(--neu-shadow-out-sm);
}

/* 购物车列表 */
.cart-list {
  padding: 12px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: var(--neu-bg);
  border-radius: var(--neu-radius-card);
  box-shadow: var(--neu-shadow-out);
  transition: all 0.25s ease;
}

.cart-item:hover {
  box-shadow: var(--neu-shadow-out-sm);
}

.cart-item .item-img {
  border-radius: var(--neu-radius-sm);
  box-shadow: var(--neu-shadow-in-sm);
  flex-shrink: 0;
}

.cart-item .item-info {
  flex: 1;
  min-width: 0;
}

.cart-item .item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--neu-heading);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-item .item-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--neu-accent);
}

/* 步进器新拟态 */
.cart-item :deep(.van-stepper) {
  flex-shrink: 0;
}

.cart-item :deep(.van-stepper__minus),
.cart-item :deep(.van-stepper__plus) {
  background-color: var(--neu-bg) !important;
  border: none !important;
  box-shadow: var(--neu-shadow-out-sm);
  border-radius: var(--neu-radius-btn) !important;
  color: var(--neu-text);
}

.cart-item :deep(.van-stepper__minus:active),
.cart-item :deep(.van-stepper__plus:active) {
  box-shadow: var(--neu-shadow-in-sm);
}

.cart-item :deep(.van-stepper__input) {
  background-color: var(--neu-bg) !important;
  box-shadow: var(--neu-shadow-in-sm);
  border: none !important;
  border-radius: var(--neu-radius-btn) !important;
  color: var(--neu-heading);
  margin: 0 4px;
}

/* 滑动删除按钮 */
.cart-list :deep(.van-swipe-cell__right) {
  display: flex;
  align-items: center;
}

.delete-button {
  height: 100%;
  border: none !important;
  border-radius: var(--neu-radius-btn) !important;
  box-shadow: var(--neu-shadow-out-sm);
  margin-left: 8px;
}

/* 底部操作栏 */
.cart-footer {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out);
  z-index: 100;
}

.cart-footer .footer-total {
  flex: 1;
  text-align: right;
}

.cart-footer .total-label {
  font-size: 13px;
  color: var(--neu-text);
}

.cart-footer .total-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--neu-accent);
}

.cart-footer .btn-delete {
  background-color: var(--neu-bg) !important;
  color: #ef4444 !important;
  border: none !important;
  border-radius: var(--neu-radius-btn) !important;
  box-shadow: var(--neu-shadow-out-sm);
}

.cart-footer .btn-delete:active {
  box-shadow: var(--neu-shadow-in-sm);
}

.cart-footer .btn-checkout {
  background-color: var(--neu-accent) !important;
  border: none !important;
  border-radius: var(--neu-radius-btn) !important;
  box-shadow: var(--neu-shadow-out-sm);
}

.cart-footer .btn-checkout:active {
  box-shadow: var(--neu-shadow-in-sm);
}
</style>
