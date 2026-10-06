import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import { authService } from '../services/auth.service';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/peliculas'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterPage.vue')
  },
  {
    path: '/peliculas',
    name: 'Peliculas',
    component: () => import('../views/PeliculasPage.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const isAuth = await authService.isAuthenticated();
  if (to.meta.requiresAuth && !isAuth) {
    next('/login');
  } else if ((to.path === '/login' || to.path === '/register') && isAuth) {
    next('/peliculas');
  } else {
    next();
  }
});

export default router;