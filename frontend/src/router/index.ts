// /frontend/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store'; // <-- Impor store

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';

// Impor halaman dashboard baru
import AdminDashboard from '../views/AdminDashboard.vue';
import OpsDashboard from '../views/OpDashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    // Rute Admin (Dilindungi)
    {
      path: '/admin-dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.isAdmin) {
          next(); // Izinkan
        } else {
          next('/login'); // Tolak, lempar ke login
        }
      },
    },
    // Rute Operasional (Dilindungi)
    {
      path: '/ops-dashboard',
      name: 'ops-dashboard',
      component: OpsDashboard,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (authStore.isOperasional) {
          next(); // Izinkan
        } else {
          next('/login'); // Tolak, lempar ke login
        }
      },
    },
  ],
});

export default router;