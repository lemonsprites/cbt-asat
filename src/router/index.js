import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'StudentDashboard',
        component: () => import('@/pages/StudentDashboard.vue'),
        meta: { role: 'student' }
      },
      {
        path: 'exam/:examId',
        name: 'Exam',
        component: () => import('@/pages/ExamPage.vue'),
        meta: { role: 'student', layout: 'exam' }
      },
      {
        path: 'result/:resultId',
        name: 'Result',
        component: () => import('@/pages/ResultPage.vue'),
        meta: { role: 'student' }
      },
      {
        path: 'teacher',
        name: 'TeacherDashboard',
        component: () => import('@/pages/TeacherDashboard.vue'),
        meta: { role: ['teacher', 'admin'] }
      },
      {
        path: 'teacher/exams/:examId',
        name: 'ManageExam',
        component: () => import('@/pages/ManageExamPage.vue'),
        meta: { role: ['teacher', 'admin'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.guest && auth.isLoggedIn) return next('/')
  if (!to.meta.guest && !auth.isLoggedIn) return next('/login')
  if (to.meta.role) {
    const roles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
    if (!roles.includes(auth.user?.role)) return next('/')
  }
  next()
})

export default router