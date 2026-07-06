import { createApp } from 'vue';

import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'vant/lib/index.css';
import { createRouter, createWebHashHistory } from 'vue-router';

import App from './App.vue';
import { useAdminStore } from './store/admin.ts';
import './styles/index.scss';

createApp(App)
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
          beforeEnter: (_to, _form, next) => {
            const islogin = useAdminStore().getIslogin;
            if (islogin > 0) {
              next('/admin');
            }
            next();
          }
        },
        {
          path: '/admin',
          name: 'backend',
          redirect: '/admin/index',
          component: () => import('./components/Backend.vue'),
          beforeEnter: (_to, _form, next) => {
            const islogin = useAdminStore().getIslogin;
            if (islogin < 1) {
              next('/');
            }
            next();
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
              path: 'shopcar',
              component: () => import('./components/home/Shopcar.vue')
            },
            {
              path: 'uc',
              component: () => import('./components/home/Uc.vue')
            }
          ]
        }
      ]
    })
  )
  .use(createPinia().use(piniaPluginPersistedstate))
  .mount('#app');
