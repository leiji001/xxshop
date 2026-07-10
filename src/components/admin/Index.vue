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

// 统一主题色 — 黑白灰单色系
const themeColors = ['#111111', '#333333', '#555555', '#777777', '#999999', '#bbbbbb', '#888888', '#666666'];

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
        itemStyle: { borderRadius: 4, borderColor: '#ffffff', borderWidth: 2 },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: 'bold' },
          itemStyle: { shadowBlur: 6, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.08)' }
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
      axisLine: { lineStyle: { color: '#e5e5e5' } }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#666' },
      splitLine: { lineStyle: { color: '#f0f0ef' } }
    },
    series: [
      {
        name: '热销商品',
        type: 'bar',
        barWidth: '35%',
        itemStyle: { color: '#111111', borderRadius: [4, 4, 0, 0] },
        data: catIds.map((id) => categoryHotMap.get(id) || 0)
      },
      {
        name: '推荐商品',
        type: 'bar',
        barWidth: '35%',
        itemStyle: { color: '#777777', borderRadius: [4, 4, 0, 0] },
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
    <h2 class="dashboard-title">概览</h2>

    <div class="stats-row">
      <div class="profile-header">
        <el-image class="profile-avatar" :src="'/api/' + admin.avatar" />
        <div class="profile-info">
          <p class="profile-name">{{ admin.username }}</p>
          <p class="profile-label">管理员账号</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ goodsNumber }}</div>
        <div class="stat-label">商品数量</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ userNumber }}</div>
        <div class="stat-label">用户数量</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ categoryNumber }}</div>
        <div class="stat-label">分类数量</div>
      </div>
    </div>

    <div class="charts-row">
      <div class="chart-card">
        <h3 class="chart-title">商品分类占比</h3>
        <v-chart class="chart" :option="pieOption" autoresize />
      </div>
      <div class="chart-card">
        <h3 class="chart-title">热销 &amp; 推荐商品</h3>
        <v-chart class="chart" :option="barOption" autoresize />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dashboard-title {
  font-size: 24px;
  font-weight: 600;
  color: #111111;
  margin: 0;
  letter-spacing: -0.02em;
}

.stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 24px;
}

/* 管理员信息卡片 */
.profile-header {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-name {
  font-size: 16px;
  font-weight: 600;
  color: #111111;
  margin: 0;
  line-height: 1.3;
}

.profile-label {
  font-size: 13px;
  color: #999999;
  margin: 0;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 28px 32px;
}

.stat-number {
  font-size: 48px;
  font-weight: 600;
  color: #111111;
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.stat-label {
  font-size: 14px;
  color: #999999;
  margin-top: 8px;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 28px 32px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #111111;
  margin: 0 0 20px 0;
}

.chart {
  height: 320px;
}
</style>
