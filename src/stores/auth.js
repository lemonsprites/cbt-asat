import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginApi, logoutApi, getProfile } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value)

  async function login(email, password) {
    loading.value = true
    try {
      const res = await loginApi(email, password)
      token.value = res.token
      localStorage.setItem('token', res.token)
      user.value = res.user
      localStorage.setItem('user', JSON.stringify(res.user))
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
      const data = await getProfile()
      user.value = data
      localStorage.setItem('user', JSON.stringify(data))
    } catch {
      logout()
    }
  }

  async function logout() {
    // Panggil API untuk hapus session di Redis
    try {
      await logoutApi()
    } catch (e) {
      console.error('Logout API error:', e)
    }
    
    // Clear local state
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, loading, isLoggedIn, login, fetchProfile, logout }
})