import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  // ========== LOGIN ==========
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guest: true }
  },

  // ========== STUDENT (pakai DefaultLayout) ==========
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { role: 'student' },
    children: [
      {
        path: '',
        name: 'StudentDashboard',
        component: () => import('@/pages/Siswa/StudentDashboard.vue'),
      },
      {
        path: 'exam/:distributionId',
        name: 'StudentExam',
        component: () => import('@/pages/Siswa/Exam.vue'),
      },
      {
        path: 'exam/select',
        name: 'ExamSelect',
        component: () => import('@/pages/Siswa/ExamSelect.vue'),
        meta: { role: 'student' }
      },
      {
        path: 'result',
        name: 'ExamResult',
        component: () => import('@/pages/Siswa/Result.vue'),
      },
    ]
  },

  // ========== ADMIN (pakai AdminLayout, TANPA DefaultLayout) ==========
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { role: ['teacher', 'admin'] },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/pages/admin/Dashboard.vue'),
      },
      {
        path: 'subjects',
        name: 'SubjectList',
        component: () => import('@/pages/admin/subjects/SubjectList.vue'),
      },
      {
        path: 'classes',
        name: 'ClassList',
        component: () => import('@/pages/admin/classes/ClassList.vue'),
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('@/pages/admin/users/UserList.vue'),
      },
      {
        path: 'packages',
        name: 'PackageList',
        component: () => import('@/pages/admin/bank/PackageList.vue'),
      },
      {
        path: 'questions',
        name: 'QuestionList',
        component: () => import('@/pages/admin/bank/QuestionList.vue'),
      },
      {
        path: 'schedules',
        name: 'ScheduleList',
        component: () => import('@/pages/admin/exam/ScheduleList.vue'),
      },
      {
        path: 'sessions',
        name: 'SessionList',
        component: () => import('@/pages/admin/exam/SessionList.vue'),
      },
      {
        path: 'tokens',
        name: 'TokenList',
        component: () => import('@/pages/admin/exam/TokenList.vue'),
      },
      {
        path: 'distributions',
        name: 'DistributionList',
        component: () => import('@/pages/admin/exam/DistributionList.vue'),
      },
      {
        path: 'results',
        name: 'ResultList',
        component: () => import('@/pages/admin/result/ResultList.vue'),
      },
    ]
  },

  // ========== 404 ==========
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard autentikasi
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // Kalau sudah login, jangan ke halaman login
  if (to.meta.guest && auth.isLoggedIn) {
    if (auth.user?.role === 'student') return next('/')
    return next('/admin')
  }

  // Kalau belum login, harus ke login
  if (!to.meta.guest && !auth.isLoggedIn) {
    return next('/login')
  }

  // Role check
  if (to.meta.role && auth.user) {
    const roles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
    if (!roles.includes(auth.user.role)) {
      if (auth.user.role === 'student') return next('/')
      return next('/admin')
    }
  }

  next()
})

export default router