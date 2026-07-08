import { defineStore } from 'pinia';

export interface CartItem {
  id: number;
  name: string;
  picture: string;
  price: string;
  nums: number;
  stock: number;
  checked: boolean;
}

export const useCartStore = defineStore('cart', {
  state: () => {
    return {
      carlist: [] as CartItem[]
    };
  },
  getters: {
    getCarList: (state) => state.carlist,
    totalCount: (state) => state.carlist.reduce((sum, item) => sum + item.nums, 0),
    selectedList: (state) => state.carlist.filter((item) => item.checked),
    totalPrice: (state) => {
      return state.carlist
        .filter((item) => item.checked)
        .reduce((sum, item) => sum + parseFloat(item.price) * item.nums, 0)
        .toFixed(2);
    },
    isAllChecked: (state) => state.carlist.length > 0 && state.carlist.every((item) => item.checked),
    selectedCount: (state) => state.carlist.filter((item) => item.checked).reduce((sum, item) => sum + item.nums, 0)
  },
  actions: {
    addCart(val: CartItem) {
      const existingItem = this.carlist.find((item) => item.id === val.id);
      if (existingItem) {
        existingItem.nums += val.nums;
      } else {
        this.carlist.push({ ...val, checked: true });
      }
    },
    delCart(id: number) {
      this.carlist = this.carlist.filter((item) => item.id !== id);
    },
    delSelected() {
      this.carlist = this.carlist.filter((item) => !item.checked);
    },
    toggleCheck(id: number) {
      const item = this.carlist.find((item) => item.id === id);
      if (item) item.checked = !item.checked;
    },
    toggleAllChecked(val?: boolean) {
      const checked = val ?? !this.isAllChecked;
      this.carlist.forEach((item) => (item.checked = checked));
    },
    updateNums(id: number, nums: number) {
      const item = this.carlist.find((item) => item.id === id);
      if (item) {
        if (nums <= 0) {
          this.delCart(id);
        } else {
          item.nums = Math.min(nums, item.stock);
        }
      }
    },
    clearCart() {
      this.carlist = [];
    },
    updateCarList(val: CartItem[]) {
      this.carlist = val;
    }
  },
  persist: {
    storage: localStorage,
    pick: ['carlist']
  }
});
