import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/Products.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue'),
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/Cart.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue'),
    meta: { requiresAuth: true } // Must be logged in to checkout
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('@/views/Account.vue'),
    meta: { requiresAuth: true } // Must be logged in to view account
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, redirectIfAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresAuth: false, redirectIfAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth check to complete if still loading
  if (authStore.isLoading) {
    await authStore.checkAuthState()
  }
  
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const redirectIfAuth = to.matched.some(record => record.meta.redirectIfAuth)
  
  // Redirect to login if route requires auth and user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    // Store the intended destination
    sessionStorage.setItem('redirectAfterLogin', to.fullPath)
    next('/login')
  }
  // Redirect to home if user is authenticated and trying to access login/register
  else if (redirectIfAuth && isAuthenticated) {
    next('/')
  }
  // Otherwise, proceed as normal
  else {
    next()
  }
})

export default router