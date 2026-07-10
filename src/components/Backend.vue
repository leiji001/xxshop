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
  <div class="admin-theme">
    <el-container class="admin-layout">
      <el-header class="admin-header" height="56px">
        <div class="header-left">微商城后台</div>
        <div class="header-right">
          <el-dropdown>
            <span class="admin-info">
              {{ username }}
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
        <el-aside class="admin-aside" width="200px">
          <el-scrollbar>
            <el-menu :default-active="$route.path" router>
              <el-menu-item index="/admin/index">
                <span>首页</span>
              </el-menu-item>
              <el-menu-item index="/admin/category/list">
                <span>商品分类</span>
              </el-menu-item>
              <el-menu-item index="/admin/goods/list">
                <span>商品列表</span>
              </el-menu-item>
              <el-menu-item index="/admin/user/list">
                <span>用户管理</span>
              </el-menu-item>
              <el-menu-item index="/admin/user/info">
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
  </div>
</template>

<style scoped>
.admin-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.header-left {
  font-size: 16px;
  font-weight: 600;
  color: #111111;
  letter-spacing: -0.01em;
}

.header-right .admin-info {
  font-size: 14px;
  color: #555555;
  cursor: pointer;
}

.admin-aside {
  background: #fafaf9;
  border-right: 1px solid #e5e5e5;
}

.admin-aside .el-menu {
  border-right: none;
  background: transparent;
  padding: 12px 0;
}

.admin-aside .el-menu-item {
  margin: 1px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: #555555;
  height: 40px;
  line-height: 40px;
}

.admin-aside .el-menu-item.is-active {
  background: #f0f0ef;
  color: #111111;
  font-weight: 500;
}

.admin-aside .el-menu-item:hover {
  background: #f0f0ef;
  color: #111111;
}

.admin-main {
  background: #fafaf9;
  padding: 32px;
}
</style>
