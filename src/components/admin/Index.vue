<script setup lang="ts">
import { useAdminStore } from '../../store/admin';

const admin = useAdminStore().getLoginAdmin;
</script>

<template>
  <div class="dashboard">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin/index' }">商城管理后台</el-breadcrumb-item>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-card class="user-card">
            <template #header>
              <el-avatar :src="'/api/' + admin.avatar" />
              <span>{{ admin.username }}</span>
            </template>
            <p>登录时间：2026-10-10 15:36:12</p>
            <p>登录地点：广西南宁</p>
          </el-card>
        </el-col>
        <el-col :span="19">
          <el-card class="stats-card">
            <template #header>
              <p class="text-bold">6月统计数据</p>
            </template>
            <el-row>
              <el-col :span="8">
                <div class="stats-item">
                  <div class="stats-number">1595</div>
                  <div class="stats-label">商品数量(个)</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stats-item">
                  <div class="stats-number">159</div>
                  <div class="stats-label">用户数量(个)</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stats-item">
                  <div class="stats-number">15</div>
                  <div class="stats-label">商品分类数量(个)</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt-md">
        <el-col :span="12">
          <el-card class="chart-card"> </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card"> </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
