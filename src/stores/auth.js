import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, logoutApi, getProfile } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  async function login(email, password) {
    loading.value = true
    try {
      const res = await loginApi(email, password)
      token.value = res.token
      localStorage.setItem('token', res.token)
      user.value = res.user
      return true
    } catch (e) {
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    if (!token.value) return
    try {
      user.value = await getProfile()
    } catch {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    logoutApi().catch(() => {}) // fire-and-forget
  }

  return { token, user, loading, isLoggedIn, login, fetchProfile, logout }
})