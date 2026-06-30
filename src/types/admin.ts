// API 响应接口
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// 管理员登录请求参数
export interface AdminLoginRequest {
  username: string;
  pass: string;
}

// 管理员登录响应数据
export interface AdminLogin {
  id: number;
  username: string;
  avatar: string;
}

// 分类接口
export interface Category {
  id: number;
  name: string;
  picture: string;
}

export interface CategoryAdd {
  name: string;
  image: string;
}

export interface CategoryUpdate {
  id: number;
  name: string;
  image: string;
}

// 商品接口
export interface Goods {
  id: number;
  category_id: number;
  name: string;
  price: number;
  picture: string;
  stock: number;
  spec: string;
  description: string;
  is_hot: number;
  is_recomented: number;
}
