import request from '.';
import type { AdminLogin, AdminLoginRequest, ApiResponse, Category, CategoryAdd, CategoryUpdate } from '../types/admin';

export const adminApi = {
  loginAdmin: (body: AdminLoginRequest): Promise<AdminLogin> => {
    return request.post<ApiResponse<AdminLogin>>('/admin/admin/login', body).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  category: (id: number): Promise<Category> => {
    return request.get<ApiResponse<Category>>('/api/admin/category/' + id).then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

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

  categoryAdd: (body: CategoryAdd): Promise<Category> => {
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

  categoryUpdate: (body: CategoryUpdate): Promise<Category> => {
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

  categoryDel: (id: number): Promise<void> => {
    return request.get<ApiResponse<void>>('/api/admin/category/' + id).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  }
};
