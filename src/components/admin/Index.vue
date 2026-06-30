<script setup lang="ts">
import { useAdminStore } from '../../store/admin';

const admin = useAdminStore().getLoginAdmin;
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/admin/index' }">商城管理后台</el-breadcrumb-item>
    <el-breadcrumb-item>首页</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card style="width: 100%; margin-top: 20px">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card style="width: 100%; height: 200px; min-width: 250px">
          <template #header>
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center">
              <el-image style="width: 60px; height: 60px" :src="'/api/' + admin.avatar" />
              <span>{{ admin.username }}</span>
            </div>
          </template>
          <p>登录时间：2026-10-10 15:36:12</p>
          <p>登录地点：广西南宁</p>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card style="width: 100%; height: 200px">
          <template #header>
            <p>6月统计数据</p>
          </template>
          <el-splitter>
            <el-splitter-panel :resizable="false">
              <p>1595</p>
              <p>商品数量(个)</p>
            </el-splitter-panel>
            <el-splitter-panel :resizable="false">
              <p>159</p>
              <p>用户数量(个)</p>
            </el-splitter-panel>
            <el-splitter-panel :resizable="false">
              <p>15</p>
              <p>商品分类数量(个)</p>
            </el-splitter-panel>
          </el-splitter>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card style="width: 100%; height: 500px"> </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="width: 100%; height: 500px"> </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>
