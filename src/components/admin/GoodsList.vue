<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';

import { ElMessage, type FormInstance, type UploadData, type UploadFile, type UploadProps } from 'element-plus';

import { adminApi } from '../../api/admin';
import type { Category, Goods } from '../../types/admin';

const ruleFormRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const tableData = ref<Goods[]>([]);
const categoryOptions = ref<Category[]>([]);
const id = ref(0);

const goods = ref<Goods>({
  id: 0,
  category_id: 0,
  name: '',
  price: 0,
  picture: '',
  stock: 0,
  spec: '',
  description: '',
  is_hot: 0,
  is_recomented: 0
});

const rules = reactive({
  name: [
    { required: true, message: '请填写商品名称', trigger: 'blur' },
    { min: 3, max: 80, message: '商品标题长度必须3-80位', trigger: 'blur' }
  ],
  category_id: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  stock: [{ required: true, message: '填写库存必须是数字', trigger: 'blur' }],
  price: [{ required: true, message: '请填写价格必须是数字', trigger: 'blur' }],
  description: [{ required: true, message: '请填写商品简介', trigger: 'blur' }],
  spec: [{ required: true, message: '填写规则', trigger: 'blur' }]
});

onBeforeMount(async () => {
  adminApi.goodsList().then((res) => (tableData.value = res));
  categoryOptions.value = await adminApi.categoryList();
});

const openDialog = async (ids?: number) => {
  dialogFormVisible.value = true;
  if (ids && ids > 0) {
    id.value = ids;
    const res = await adminApi.goods(ids);
    goods.value = res;
    imageUrl.value = '/api/' + res.picture;
  }
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    if (id.value > 0) {
      await adminApi.goodsUpdate({
        id: goods.value.id,
        name: goods.value.name,
        category_id: goods.value.category_id,
        price: goods.value.price,
        picture: goods.value.picture,
        stock: goods.value.stock,
        spec: goods.value.spec,
        description: goods.value.description,
        is_hot: goods.value.is_hot,
        is_recomented: goods.value.is_recomented
      });
    } else {
      await adminApi.goodsAdd({
        name: goods.value.name,
        category_id: goods.value.category_id,
        price: goods.value.price,
        picture: goods.value.picture,
        stock: goods.value.stock,
        spec: goods.value.spec,
        description: goods.value.description,
        is_hot: goods.value.is_hot,
        is_recomented: goods.value.is_recomented
      });
    }
    resetForm();
    tableData.value = await adminApi.goodsList();
  } catch (error) {
    console.error('表单校验失败或请求出错:', error);
  }
};

const deleteGoods = async (ids: number) => {
  await adminApi.goodsDelete(ids);
  tableData.value = await adminApi.goodsList();
};

const resetForm = () => {
  dialogFormVisible.value = false;
  imageUrl.value = '';
  goods.value = {
    id: 0,
    category_id: 0,
    name: '',
    price: 0,
    picture: '',
    stock: 0,
    spec: '',
    description: '',
    is_hot: 0,
    is_recomented: 0
  };
};

// 图片上传
const imageUrl = ref('');
const handleAvatarSuccess: UploadData['onSuccess'] = (response: { data: { url: string } }, uploadFile: UploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  goods.value.picture = response.data.url;
};
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!');
    return false;
  }
  return true;
};
</script>

<template>
  <div class="page-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/admin/index' }">商城管理后台</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="openDialog()">添加商品</el-button>
      <el-divider border-style="dotted" />
      <el-table :data="tableData" border>
        <el-table-column width="60" prop="id" label="编号" />
        <el-table-column width="80" label="图片">
          <template #default="scope"><el-image :src="'/api/' + scope.row.picture" /></template>
        </el-table-column>
        <el-table-column min-width="120" label="分类">
          <template #default="scope">{{ categoryOptions.find((item) => item.id === scope.row.category_id)?.name }}</template>
        </el-table-column>
        <el-table-column min-width="120" prop="name" label="名称" />
        <el-table-column min-width="120" prop="spec" label="规格" />
        <el-table-column min-width="120" prop="description" label="简介" />
        <el-table-column width="80" prop="price" label="价格" />
        <el-table-column width="80" prop="stock" label="库存" />
        <el-table-column width="100" label="热卖 / 推荐">
          <template #default="scope">
            <el-icon v-if="scope.row.is_hot > 0"><i-ep-CircleCheck /></el-icon>
            <el-icon v-else><i-ep-CircleClose /></el-icon>
            /
            <el-icon v-if="scope.row.is_recomented > 0"><i-ep-CircleCheck /></el-icon>
            <el-icon v-else><i-ep-CircleClose /></el-icon>
          </template>
        </el-table-column>
        <el-table-column width="160" fixed="right" label="操作">
          <template #default="scope">
            <el-button type="danger" size="small" @click="deleteGoods(scope.row.id)">删除</el-button>
            <el-button type="primary" size="small" @click="openDialog(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <!-- 添加、编辑商品弹窗 -->
  <el-dialog v-model="dialogFormVisible" :title="id ? '编辑商品' : '添加商品'" width="60%" class="form-dialog">
    <el-form ref="ruleFormRef" :model="goods" :rules="rules" label-width="auto">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="goods.name" />
      </el-form-item>
      <el-form-item label="商品分类" prop="category_id">
        <el-select v-model="goods.category_id" placeholder="选择商品分类" style="width: 100%">
          <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input-number v-model="goods.price" :min="0" :precision="2" />
      </el-form-item>
      <el-form-item label="库存" prop="stock">
        <el-input-number v-model="goods.stock" :min="0" />
      </el-form-item>
      <el-form-item label="规格" prop="spec">
        <el-input v-model="goods.spec" :min="0" />
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input v-model="goods.description" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="热卖" prop="is_hot">
        <el-switch v-model="goods.is_hot" :active-value="1" :inactive-value="0" active-text="热卖" inactive-text="普通" />
      </el-form-item>
      <el-form-item label="推荐" prop="is_recomented">
        <el-switch v-model="goods.is_recomented" :active-value="1" :inactive-value="0" active-text="推荐" inactive-text="不推荐" />
      </el-form-item>
      <el-form-item label="商品主图" prop="picture">
        <el-upload action="/api/admin/goods/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" />
          <el-icon v-else class="avatar-uploader-icon"><i-ep-plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)"> 确认 </el-button>
        <el-button @click="resetForm()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.page-container :deep(.el-card) {
  background-color: var(--neu-bg);
  border: none !important;
  border-radius: var(--neu-radius-card) !important;
  box-shadow: var(--neu-shadow-out);
}

.form-dialog :deep(.el-upload) {
  background-color: var(--neu-bg) !important;
  box-shadow: var(--neu-shadow-in) !important;
  border: none !important;
  border-radius: var(--neu-radius-sm) !important;
}

.form-dialog :deep(.el-upload:hover) {
  box-shadow:
    var(--neu-shadow-in),
    0 0 0 1px rgba(124, 58, 237, 0.15) !important;
}

.form-dialog :deep(.avatar-uploader-icon) {
  font-size: 28px;
  color: var(--neu-text);
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-dialog :deep(img) {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--neu-radius-sm);
}
</style>
