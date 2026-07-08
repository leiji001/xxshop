import request from '.';
import type { Admin, Category, Goods, User } from '../types/admin';

// API 响应接口外层
interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

interface PaginatedData<T> {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  data: T[];
}

export const adminApi = {
  // 管理登陆
  loginAdmin: (body: { username: string; pass: string }): Promise<Admin> => {
    return request.post<ApiResponse<Admin>>('/admin/admin/login', body).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  adminUpdate: (body: { id: number; username: string; password?: string; salt?: string; avatar: string }): Promise<Admin> => {
    return request.post<ApiResponse<Admin>>('/admin/admin/update', body).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 商品信息
  goods: (id: number): Promise<Goods> => {
    return request.get<ApiResponse<Goods>>('/admin/goods/' + id).then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 商品列表
  goodsList: (params?: { category_id?: number; is_hot?: number; is_recoment?: number }): Promise<Goods[]> => {
    return request.get<ApiResponse<PaginatedData<Goods>>>('/admin/goods/list', { params }).then((res) => {
      if (res.code === 200) {
        return res.data.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 商品添加
  goodsAdd: (body: { name: string; category_id: number; price: number; picture: string; stock: number; spec: string; description: string; is_hot: number; is_recomented: number }): Promise<Goods> => {
    return request.post<ApiResponse<Goods>>('/admin/goods/add', body).then((res) => {
      if (res.code === 201) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 商品修改
  goodsUpdate: (body: { id: number; name: string; category_id: number; price: number; picture: string; stock: number; spec: string; description: string; is_hot: number; is_recomented: number }): Promise<Goods> => {
    return request.post<ApiResponse<Goods>>('/admin/goods/update', body).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 商品删除
  goodsDelete: (id: number): Promise<void> => {
    return request.post<ApiResponse<void>>('/admin/goods/delete', { id }).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 分类信息
  category: (id: number): Promise<Category> => {
    return request.get<ApiResponse<Category>>('/admin/category/' + id).then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 分类列表
  categoryList: (): Promise<Category[]> => {
    return request.get<ApiResponse<Category[]>>('/admin/category/list').then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 添加分类
  categoryAdd: (body: { name: string; picture: string }): Promise<Category> => {
    return request.post<ApiResponse<Category>>('/admin/category/add', body).then((res) => {
      if (res.code === 201) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 更新分类
  categoryUpdate: (body: { id: number; name: string; picture: string }): Promise<Category> => {
    return request.post<ApiResponse<Category>>('/admin/category/update', body).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 删除分类
  categoryDel: (body: { id: number }): Promise<void> => {
    return request.post<ApiResponse<void>>('/admin/category/delete', body).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 用户信息
  user: (id: number): Promise<User> => {
    return request.get<ApiResponse<User>>('/admin/user/' + id).then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 用户列表
  userList: (params?: { page: number; limit: number }): Promise<User[]> => {
    return request.get<ApiResponse<PaginatedData<User>>>('/admin/user/list', { params }).then((res) => {
      if (res.code === 200) {
        return res.data.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 用户添加
  userAdd: (body: { username: string; password: string; salt: string; avatar: string }): Promise<User> => {
    return request.post<ApiResponse<User>>('/admin/user/add', body).then((res) => {
      if (res.code === 201) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 用户更新
  userUpdate: (body: { id: number; username: string; avatar: string }): Promise<User> => {
    return request.post<ApiResponse<User>>('/admin/user/update', body).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 用户删除
  userDel: (id: number): Promise<void> => {
    return request.get<ApiResponse<void>>('/admin/user/delete/' + id).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  }
};
