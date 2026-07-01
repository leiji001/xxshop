<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';

import { ElMessage, type FormInstance, type UploadData, type UploadFile, type UploadProps } from 'element-plus';

import { adminApi } from '../../api/admin';
import type { Category } from '../../types/admin';

const ruleFormRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const tableData = ref<Category[]>([]);
const id = ref(0);

const category = ref<Category>({
  id: 0,
  name: '',
  picture: ''
});

const rules = reactive({
  name: [
    { required: true, message: '请填写分类名称', trigger: 'blur' },
    { min: 1, max: 80, message: '分类标题长度必须1-80位', trigger: 'blur' }
  ]
});

onBeforeMount(async () => {
  tableData.value = await adminApi.categoryList();
});

const openDialog = async (ids?: number) => {
  dialogFormVisible.value = true;
  if (ids && ids > 0) {
    id.value = ids;
    const res = await adminApi.category(ids);
    category.value = res;
    imageUrl.value = '/api/' + res.picture;
  }
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    if (id.value > 0) {
      await adminApi.categoryUpdate({
        id: category.value.id,
        name: category.value.name,
        picture: category.value.picture
      });
    } else {
      await adminApi.categoryAdd({
        name: category.value.name,
        picture: category.value.picture
      });
    }
    tableData.value = await adminApi.categoryList();
    dialogFormVisible.value = false;
    category.value = { id: 0, name: '', picture: '' };
    imageUrl.value = '';
  } catch (error) {
    console.error('表单校验失败或请求出错:', error);
  }
};

const deltecategory = async (ids: number) => {
  await adminApi.categoryDel({ id: ids });
  tableData.value = await adminApi.categoryList();
};

const resetForm = () => {
  dialogFormVisible.value = false;
  category.value = {
    id: 0,
    name: '',
    picture: ''
  };
  imageUrl.value = '';
};

// 图片上传
const imageUrl = ref('');
const handleAvatarSuccess: UploadData['onSuccess'] = (response: { data: { url: string } }, uploadFile: UploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
  category.value.picture = response.data.url;
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
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/admin/index' }">商城管理后台</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <el-card>
    <el-button type="primary" @click="openDialog()">添加分类</el-button>
    <el-divider border-style="dotted" />
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="分类编号" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column label="图片">
        <template #default="scope">
          <el-image :src="'/api/' + scope.row.picture" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button type="danger" size="small" @click="deltecategory(scope.row.id)">删除</el-button>
          <el-button type="primary" size="small" @click="openDialog(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogFormVisible" :title="id ? '编辑分类' : '添加分类'" width="70%">
    <el-form ref="ruleFormRef" :model="category" :rules="rules" label-width="auto">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="category.name" />
      </el-form-item>

      <el-form-item label="分类主图" prop="picture">
        <el-upload action="/api/admin/category/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" />
          <el-icon v-else><i-ep-plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
        <el-button @click="resetForm()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
