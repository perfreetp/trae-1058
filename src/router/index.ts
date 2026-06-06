import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/overview'
  },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/views/Overview.vue'),
    meta: { title: '态势总览', icon: '📊' }
  },
  {
    path: '/fire-grid',
    name: 'fire-grid',
    component: () => import('@/views/FireGrid.vue'),
    meta: { title: '火险网格', icon: '🔥' }
  },
  {
    path: '/patrol',
    name: 'patrol',
    component: () => import('@/views/Patrol.vue'),
    meta: { title: '巡护调度', icon: '🚶' }
  },
  {
    path: '/fire-disposal',
    name: 'fire-disposal',
    component: () => import('@/views/FireDisposal.vue'),
    meta: { title: '火情处置', icon: '🚒' }
  },
  {
    path: '/resources',
    name: 'resources',
    component: () => import('@/views/Resources.vue'),
    meta: { title: '物资队伍', icon: '📦' }
  },
  {
    path: '/drill',
    name: 'drill',
    component: () => import('@/views/Drill.vue'),
    meta: { title: '演练复盘', icon: '📋' }
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('@/views/Reports.vue'),
    meta: { title: '统计报表', icon: '📈' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
