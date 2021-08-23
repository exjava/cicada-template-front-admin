import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'route.dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'system',
    meta: {
      title: 'route.system.system',
      icon: 'el-icon-setting',
      roles: ['ROLE_ADMIN']
    },
    children: [
      {
        path: '/system/user',
        name: 'system-user',
        component: () => import('@/views/system/user'),
        meta: {
          title: 'route.system.user',
          icon: 'el-icon-user',
          roles: ['ROLE_ADMIN']
        }
      },
      {
        path: '/system/role',
        name: 'system-role',
        component: () => import('@/views/system/role'),
        meta: {
          title: 'route.system.role',
          icon: 'role',
          roles: ['ROLE_ADMIN']
        }
      },
      {
        path: '/system/api',
        name: 'system-api',
        component: () => import('@/views/system/api'),
        meta: {
          title: 'route.system.api',
          icon: 'api',
          roles: ['ROLE_ADMIN']
        }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
