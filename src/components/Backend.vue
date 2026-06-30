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
  router.push({ path: '/login' });
};
</script>

<template>
  <el-container class="layout-container-demo">
    <el-header style="border-bottom: #ccc solid 1px">
      <el-row justify="space-between" style="margin-top: 10px">
        <el-col :span="10">
          <h3>
            <el-icon size="26"><i-ep-shop /></el-icon>微商城后台管理系统
          </h3>
        </el-col>
        <el-col :span="6" style="display: flex; justify-content: flex-end">
          <div class="toolbar">
            <el-dropdown>
              <el-icon style="margin-right: 8px; margin-top: 1px">
                <i-ep-setting />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>修改密码</el-dropdown-item>
                  <el-dropdown-item @click="logout()">退出系统</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span>{{ username }}</span>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" style="border-right: 1px #ccc solid">
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
      <el-main style="padding: 20px">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>
