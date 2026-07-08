import { createApp } from 'vue';

import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { Lazyload } from 'vant';
import 'vant/lib/index.css';
import { createRouter, createWebHashHistory } from 'vue-router';

import App from './App.vue';
import { useAdminStore } from './store/admin.ts';
import { useUserStore } from './store/user.ts';
import './styles/index.scss';

createApp(App)
  // 创建路由
  .use(
    createRouter({
      history: createWebHashHistory(),
      routes: [
        {
          path: '/',
          redirect: '/home'
        },
        {
          path: '/loginadmin',
          name: 'loginadmin',
          component: () => import('./components/LoginAdmin.vue'),
          beforeEnter: () => {
            const islogin = useAdminStore().getIslogin;
            if (islogin > 0) return '/admin';
          }
        },
        {
          path: '/admin',
          name: 'backend',
          redirect: '/admin/index',
          component: () => import('./components/Backend.vue'),
          beforeEnter: () => {
            const islogin = useAdminStore().getIslogin;
            if (islogin < 1) return '/loginadmin';
          },
          children: [
            {
              path: 'index',
              component: () => import('./components/admin/Index.vue')
            },
            {
              path: 'goods/list',
              component: () => import('./components/admin/GoodsList.vue')
            },
            {
              path: 'category/list',
              component: () => import('./components/admin/CategoryList.vue')
            },
            {
              path: 'user/list',
              component: () => import('./components/admin/UserList.vue')
            },
            {
              path: 'user/info',
              component: () => import('./components/admin/Info.vue')
            }
          ]
        },
        {
          path: '/home',
          name: 'home',
          redirect: '/home/index',
          component: () => import('./components/Home.vue'),
          children: [
            {
              path: 'index',
              component: () => import('./components/home/Index.vue')
            },
            {
              path: 'goods',
              component: () => import('./components/home/Goods.vue')
            },
            {
              path: 'show/:id',
              component: () => import('./components/home/Show.vue')
            },
            {
              path: 'cart',
              component: () => import('./components/home/Cart.vue')
            },
            {
              path: 'login',
              component: () => import('./components/home/Login.vue'),
              beforeEnter: () => {
                const islogin = useUserStore().getIslogin;
                if (islogin > 0) return '/home/uc';
              }
            },
            {
              path: 'reg',
              component: () => import('./components/home/Reg.vue'),
              beforeEnter: () => {
                const islogin = useUserStore().getIslogin;
                if (islogin > 0) return '/home/uc';
              }
            },
            {
              path: 'uc',
              component: () => import('./components/home/Uc.vue'),
              beforeEnter: () => {
                const islogin = useUserStore().getIslogin;
                if (islogin < 1) return '/home/login';
              }
            }
          ]
        }
      ]
    })
  )
  // 导入Pinia与Pinia持久化
  .use(createPinia().use(piniaPluginPersistedstate))
  // vant图像懒加载
  .use(Lazyload)
  .mount('#app');
