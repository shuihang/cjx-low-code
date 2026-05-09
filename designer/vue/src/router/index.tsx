import { createRouter, createWebHistory } from 'vue-router'
import TopBar from '../components/topBar/index.vue'
import Home from '@/views/home/index.vue'
import FormDesign from '@/views/formDesign/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      meta: {
        title: '首页',
        isAuth: false
      },
      components: {
        default: Home,
        TopBar
      },
      props: {
        TopBar: { type: 'home', buttonAuth: 'default' }
      }
    },
    {
      path: '/form-design',
      name: 'FormDesign',
      meta: {
        title: '表单设计',
        isAuth: true
      },
      components: {
        default: FormDesign,
        TopBar
      },
      props: {
        TopBar: { type: 'form-design', buttonAuth: 'editor' }
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/me',
      name: 'Me',
      component: () => import('@/views/me/index.vue')
    }
  ]
})

export default router
