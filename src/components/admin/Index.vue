<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';

import { adminApi } from '../../api/admin';
import { useAdminStore } from '../../store/admin';
import type { Category, Goods } from '../../types/admin';

use([PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent, CanvasRenderer]);

const admin = useAdminStore().getLoginAdmin;
const goodsNumber = ref<number>(0);
const userNumber = ref<number>(0);
const categoryNumber = ref<number>(0);

const pieOption = ref({});
const barOption = ref({});

// 统一主题色
const themeColors = ['#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f5f3ff', '#6d28d9', '#5b21b6'];

function buildCharts(goods: Goods[], categories: Category[]) {
  // 构建分类 ID → 名称映射
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  // 按分类统计商品数量
  const categoryCountMap = new Map<number, number>();
  goods.forEach((g) => {
    categoryCountMap.set(g.category_id, (categoryCountMap.get(g.category_id) || 0) + 1);
  });

  // 按分类统计热销和推荐数量
  const categoryHotMap = new Map<number, number>();
  const categoryRecomMap = new Map<number, number>();
  goods.forEach((g) => {
    if (g.is_hot) categoryHotMap.set(g.category_id, (categoryHotMap.get(g.category_id) || 0) + 1);
    if (g.is_recomented) categoryRecomMap.set(g.category_id, (categoryRecomMap.get(g.category_id) || 0) + 1);
  });

  const catIds = Array.from(categoryCountMap.keys());
  const catNames = catIds.map((id) => categoryMap.get(id) || `分类${id}`);

  // ========== 饼图：商品分类占比 ==========
  pieOption.value = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} 件 ({d}%)' },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#555', fontSize: 13 }
    },
    series: [
      {
        name: '商品分类',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 8, borderColor: '#e8e8e8', borderWidth: 3 },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: 'bold' },
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.15)' }
        },
        data: catIds.map((id, i) => ({
          name: catNames[i],
          value: categoryCountMap.get(id),
          itemStyle: { color: themeColors[i % themeColors.length] }
        }))
      }
    ]
  };

  // ========== 柱形图：热销 & 推荐商品统计 ==========
  barOption.value = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      top: 0,
      textStyle: { color: '#555', fontSize: 13 }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '40px', containLabel: true },
    xAxis: {
      type: 'category',
      data: catNames,
      axisLabel: { color: '#666', fontSize: 12, rotate: catNames.length > 5 ? 30 : 0 },
      axisLine: { lineStyle: { color: '#ccc' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#eee' } }
    },
    series: [
      {
        name: '热销商品',
        type: 'bar',
        barWidth: '35%',
        itemStyle: { color: '#7c3aed', borderRadius: [6, 6, 0, 0] },
        data: catIds.map((id) => categoryHotMap.get(id) || 0)
      },
      {
        name: '推荐商品',
        type: 'bar',
        barWidth: '35%',
        itemStyle: { color: '#a78bfa', borderRadius: [6, 6, 0, 0] },
        data: catIds.map((id) => categoryRecomMap.get(id) || 0)
      }
    ]
  };
}

onBeforeMount(async () => {
  const [goods, categories] = await Promise.all([adminApi.goodsList(), adminApi.categoryList()]);
  goodsNumber.value = goods.length;
  categoryNumber.value = categories.length;

  // 用户数量单独请求（保持与原逻辑一致）
  adminApi.userList().then((res) => (userNumber.value = res.length));

  buildCharts(goods, categories);
});
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
                  <div class="stats-number">{{ goodsNumber }} 件</div>
                  <div class="stats-label">商品数量</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stats-item">
                  <div class="stats-number">{{ userNumber }} 位</div>
                  <div class="stats-label">用户数量</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="stats-item">
                  <div class="stats-number">{{ categoryNumber }} 项</div>
                  <div class="stats-label">分类数量</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt-md">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <p class="chart-title">商品分类占比</p>
            </template>
            <v-chart class="chart" :option="pieOption" autoresize />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <p class="chart-title">热销 & 推荐商品统计</p>
            </template>
            <v-chart class="chart" :option="barOption" autoresize />
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<style scoped>
.dashboard :deep(.el-card) {
  background-color: var(--neu-bg);
  border: none !important;
  border-radius: var(--neu-radius-card) !important;
  box-shadow: var(--neu-shadow-out);
}

.dashboard .user-card :deep(.el-card__header) {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: var(--neu-heading);
  border-bottom: none;
  padding: var(--spacing-md) var(--spacing-lg);
}

.dashboard .user-card :deep(.el-avatar) {
  box-shadow: var(--neu-shadow-out-sm);
  background-color: var(--neu-bg);
}

.dashboard .user-card p {
  color: var(--neu-text);
  margin-bottom: 4px;
  font-size: 13px;
}

.dashboard .user-card p:last-child {
  margin-bottom: 0;
}

.dashboard .stats-card :deep(.el-card__header) {
  border-bottom: none;
  padding: var(--spacing-md) var(--spacing-lg);
}

.dashboard .stats-card .text-bold {
  color: var(--neu-heading);
  font-weight: 600;
  font-size: 15px;
}

.stats-item {
  text-align: center;
  padding: var(--spacing-md) 0;
}

.stats-number {
  font-size: 28px;
  font-weight: 600;
  color: var(--neu-accent);
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: var(--neu-text);
  font-weight: 400;
}

.chart-card {
  min-height: 320px;
}

.chart-card :deep(.el-card__header) {
  border-bottom: none;
  padding: var(--spacing-md) var(--spacing-lg);
}

.chart-title {
  color: var(--neu-heading);
  font-weight: 600;
  font-size: 15px;
  margin: 0;
}

.chart {
  width: 100%;
  height: 260px;
}
</style>
