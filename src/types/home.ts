export interface Goods {
  id: number;
  category_id: number;
  name: string;
  price: string;
  picture: string;
  stock: number;
  spec: string;
  description: string;
  is_hot: number;
  is_recomented: number;
  category_name: string;
}

export interface Category {
  id: number;
  name: string;
  picture: string;
}

export interface UserInfo {
  id: number;
  username: string;
  avatar: string;
}
