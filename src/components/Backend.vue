<script setup lang="ts">
import { ref } from 'vue';

import { useRouter } from 'vue-router';

import { useAdminStore } from '../store/admin';

const router = useRouter();
const adminStore = useAdminStore();

const username = ref(adminStore.getLoginAdmin.username);

const logout = () => {
  adminStore.updateIslogin(0);
  adminStore.updateLoginAdmin({
    id: 0,
    username: '',
    avatar: ''
  });
  router.push({ path: '/loginadmin' });
};
</script>

<template>
  <el-container class="admin-layout">
    <el-header class="admin-header" height="50px">
      <div class="header-left">
        <el-icon><i-ep-shop /></el-icon>微商城后台管理系统
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="admin-info">
            {{ username }}
            <el-icon>
              <i-ep-setting />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item @click="logout()">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside class="admin-aside" width="160px">
        <el-scrollbar>
          <el-menu :default-active="$route.path" router>
            <el-menu-item index="/admin/index">
              <el-icon><i-ep-message /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/admin/category/list">
              <el-icon><i-ep-menu /></el-icon>
              <span>商品分类</span>
            </el-menu-item>
            <el-menu-item index="/admin/goods/list">
              <el-icon><i-ep-goods /></el-icon>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="/admin/user/list">
              <el-icon><i-ep-user /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/user/info">
              <el-icon><i-ep-setting /></el-icon>
              <span>信息设置</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main class="admin-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
/* ===== 新拟态导航栏 ===== */
.admin-header {
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out-sm);
  border-bottom: none;
  position: relative;
  z-index: 10;
}

.header-left {
  color: var(--neu-heading);
}

.header-left .el-icon {
  color: var(--neu-accent);
}

.header-right .admin-info {
  border-radius: var(--neu-radius-btn);
  transition: all 0.25s ease;
}

.header-right .admin-info:hover {
  box-shadow: var(--neu-shadow-in-sm);
}

/* ===== 新拟态侧边栏 ===== */
.admin-aside {
  background-color: var(--neu-bg);
  box-shadow: var(--neu-shadow-out-sm);
  position: relative;
  z-index: 5;
}

.admin-aside .el-menu {
  background-color: var(--neu-bg) !important;
  border-right: none !important;
}

.admin-aside .el-menu-item {
  border-radius: var(--neu-radius-btn);
  margin: 2px 6px;
  color: var(--neu-text) !important;
  transition: all 0.2s ease;
}

.admin-aside .el-menu-item:hover {
  box-shadow: var(--neu-shadow-out-sm) !important;
  background-color: var(--neu-bg) !important;
}

.admin-aside .el-menu-item.is-active {
  box-shadow: var(--neu-shadow-in-sm) !important;
  color: var(--neu-accent) !important;
  background-color: var(--neu-bg) !important;
  font-weight: 600;
}

.admin-aside .el-menu-item.is-active .el-icon {
  color: var(--neu-accent);
}

/* ===== 新拟态主内容区 ===== */
.admin-main {
  background-color: var(--neu-bg);
}
</style>
