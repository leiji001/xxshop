<script setup lang="ts"></script>

<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin/index' }">商城管理后台</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="width: 100%; margin-top: 20px">
      <el-button type="primary" @click="openDialog()">添加商品</el-button>
      <el-divider border-style="dotted" />
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="商品编号" width="180" />
        <el-table-column prop="name" label="商品名称" width="180" />
        <el-table-column prop="price" label="商品价格" />
        <el-table-column prop="stock" label="商品库存" />
        <el-table-column prop="description" label="商品简介" />
        <el-table-column fixed="right" label="商品图片" min-width="120">
          <template #default="scope">
            <img :src="'/img/' + scope.row.picture" height="100px" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <el-button type="danger" size="small" @click="deleteGoods(scope.row.id)"> 删除 </el-button>
            <el-button type="primary" size="small" @click="openDialog(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <!-- 添加、编辑商品弹窗 -->
  <el-dialog v-model="dialogFormVisible" :title="id ? '编辑商品' : '添加商品'" width="70%">
    <el-form ref="ruleFormRef" style="max-width: 1000px" :model="goods" :rules="rules" label-width="auto">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="goods.name" />
      </el-form-item>

      <el-form-item label="商品分类" prop="category_id">
        <el-select v-model="goods.category_id" placeholder="选择商品分类">
          <el-option label="手机" value="1" />
          <el-option label="数码配件" value="2" />
        </el-select>
      </el-form-item>

      <el-form-item label="商品主图" prop="picture">
        <el-upload class="avatar-uploader" action="/api/admin/goods/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="库存" prop="stock">
        <el-input v-model="goods.stock" />
      </el-form-item>

      <el-form-item label="规格" prop="spec">
        <el-input v-model="goods.spec" />
      </el-form-item>

      <el-form-item label="商品介绍" prop="description">
        <el-input v-model="goods.description" type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 确认 </el-button>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
