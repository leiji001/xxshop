import request from '.';
import type { Category, Goods, UserInfo } from '../types/home';

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

export const homeApi = {
  // 商品列表
  goodsList: (params?: { keyword: string }): Promise<Goods[]> => {
    return request.get<ApiResponse<PaginatedData<Goods>>>('/home/goods/list', { params }).then((res) => {
      if (res.code === 200) {
        return res.data.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 商品详情
  goods: (id: number): Promise<Goods> => {
    return request.get<ApiResponse<Goods>>('/home/goods/show/' + id).then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 推荐商品
  goodsRecommend: (): Promise<Goods[]> => {
    return request.get<ApiResponse<Goods[]>>('/home/goods/recommend').then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 热卖商品
  goodsHot: (): Promise<Goods[]> => {
    return request.get<ApiResponse<Goods[]>>('/home/goods/hot').then((res) => {
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
    return request.get<ApiResponse<Category[]>>('/home/category/top').then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 用户注册
  userReg: (body: { username: string; password: string; re_password: string; avatar: string }): Promise<UserInfo> => {
    return request.post<ApiResponse<UserInfo>>('/home/user/reg', body).then((res) => {
      if (res.code === 201) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 用户登陆
  userLogin: (body: { username: string; password: string }): Promise<UserInfo> => {
    return request.post<ApiResponse<UserInfo>>('/home/user/login', body).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 用户信息
  userInfo: (id: number): Promise<UserInfo> => {
    return request.get<ApiResponse<UserInfo>>('/home/user/info/' + id).then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 用户信息修改
  userUpdate: (id: number, body: { password?: string; avatar?: string }): Promise<UserInfo> => {
    return request.put<ApiResponse<UserInfo>>('/home/user/update/' + id, body).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg);
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  },

  // 用户头像上传
  userImgUP: (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post<ApiResponse<{ url: string }>>('/home/user/upload', formData).then((res) => {
      if (res.code === 200) {
        return res.data;
      } else {
        ElMessage.error(res.msg);
        return Promise.reject(new Error(res.msg));
      }
    });
  }
};
