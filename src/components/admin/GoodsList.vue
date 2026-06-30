<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';

import { ElMessage, type FormInstance, type UploadData, type UploadFile, type UploadProps } from 'element-plus';

import { adminApi } from '../../api/admin';
import type { Goods } from '../../types/admin';

const ruleFormRef = ref<FormInstance>();
const dialogFormVisible = ref(false);
const tableData = ref<Goods[]>([]);
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
  const res = await adminApi.goodsList();
  tableData.value = res;
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
      adminApi.goodsUpdate({
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
      adminApi.goodsAdd({
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
  } catch (error) {
    console.error('表单校验失败或请求出错:', error);
  }
};

const deleteGoods = async (ids: number) => {
  adminApi.goodsDelete(ids);
};

const resetForm = () => {
  dialogFormVisible.value = false;
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
  imageUrl.value = '';
};

// 图片上传
const imageUrl = ref('');
const handleAvatarSuccess: UploadData['onSuccess'] = (_response: { data: { url: string } }, uploadFile: UploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!);
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
            <img :src="'/api/' + scope.row.picture" height="100px" />
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
          <el-icon v-else class="avatar-uploader-icon"><i-ep-plus /></el-icon>
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
        <el-button @click="resetForm()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
