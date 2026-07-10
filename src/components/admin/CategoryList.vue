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
  adminApi.categoryList().then((res) => (tableData.value = res));
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
  <div class="page-container">
    <h2 class="page-title">商品分类</h2>

    <div class="page-card">
      <el-button type="primary" @click="openDialog()">添加分类</el-button>
      <el-divider border-style="solid" />
      <el-table :data="tableData" border>
        <el-table-column width="60" prop="id" label="编号" />
        <el-table-column width="80" label="图片">
          <template #default="scope">
            <el-image :src="'/api/' + scope.row.picture" />
          </template>
        </el-table-column>
        <el-table-column min-width="120" prop="name" label="名称" />
        <el-table-column width="160" fixed="right" label="操作">
          <template #default="scope">
            <el-button size="small" @click="deltecategory(scope.row.id)">删除</el-button>
            <el-button type="primary" size="small" @click="openDialog(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="dialogFormVisible" :title="id ? '编辑分类' : '添加分类'" width="520px" class="form-dialog">
      <el-form ref="ruleFormRef" :model="category" :rules="rules" label-width="auto">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="category.name" />
        </el-form-item>

        <el-form-item label="分类主图" prop="picture">
          <el-upload action="/api/admin/category/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" />
            <el-icon v-else class="avatar-uploader-icon"><i-ep-plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
          <el-button @click="resetForm()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #111111;
  margin: 0 0 24px 0;
  letter-spacing: -0.02em;
}

.page-card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 24px;
}

.page-card .el-divider {
  margin: 20px 0;
}
</style>
