import { createRouter, createWebHistory } from 'vue-router'
import BoardList from '../pages/board/BoardList.vue'
import DetailView from '../pages/board/DetailView.vue'
import WriteView from '../pages/board/WriteView.vue'
import UpdateView from '../pages/board/UpdateView.vue'

import StatsDashboard from '../views/ControlCenterDashboard.vue';

const routes = [
  {
    path: '/',
    redirect: '/board'
  },
  {
    path: '/board',
    name: 'board-list',
    component: BoardList
  },
  {
    path: '/board/detail/:id',
    name: 'detail',
    component: DetailView
  },
  {
    path: '/board/write',
    name: 'write',
    component: WriteView
  },
  {
    path: '/board/update/:id',
    name: 'update',
    component: UpdateView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: StatsDashboard
  },
  {
    path: '/dashboard2',
    name: 'dashboard2',
    component: () => import('../views/TestView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
