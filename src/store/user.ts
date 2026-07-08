import { defineStore } from 'pinia';

import type { UserInfo } from '../types/home';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      islogin: 0,
      loginUser: {
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
    getLoginUser(state) {
      return state.loginUser;
    }
  },
  actions: {
    updateIslogin(val: number) {
      this.islogin = val;
    },
    updateLoginUser(val: UserInfo) {
      this.loginUser = val;
    }
  },
  persist: {
    storage: localStorage,
    pick: ['islogin', 'loginUser']
  }
});
