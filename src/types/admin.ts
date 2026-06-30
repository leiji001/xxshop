// 管理员登录
export interface Admin {
  id: number;
  username: string;
  avatar: string;
}

// 商品
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

// 分类
export interface Category {
  id: number;
  name: string;
  picture: string;
}

// 用户
export interface User {
  id: number;
  username: string;
  avatar: string;
}
