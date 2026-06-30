import { defineStore } from 'pinia';

import type { Admin } from '../types/admin';

export const useAdminStore = defineStore('admin', {
  state: () => {
    return {
      islogin: 0,
      loginAdmin: {
        id: 0,
        username: '',
        avatar: ''
      }
    };
  },
  getters: {
    getIslogin(state) {
      return state.islogin;
    },
    getLoginAdmin(state) {
      return state.loginAdmin;
    }
  },
  actions: {
    updateIslogin(val: number) {
      this.islogin = val;
    },
    updateLoginAdmin(val: Admin) {
      this.loginAdmin = val;
    }
  },
  persist: {
    storage: localStorage,
    pick: ['islogin', 'loginAdmin']
  }
});
