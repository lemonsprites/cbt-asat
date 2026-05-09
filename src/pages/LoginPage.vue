<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="handleLogin" class="bg-white p-8 rounded shadow-md w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-6 text-center">CBT Login</h1>
      <div class="mb-4">
        <label class="block text-gray-700">Email</label>
        <input v-model="email" type="email" class="w-full border px-3 py-2 rounded mt-1" required />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Password</label>
        <input v-model="password" type="password" class="w-full border px-3 py-2 rounded mt-1" required />
      </div>
      <button :disabled="auth.loading" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {{ auth.loading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" class="text-red-500 mt-3 text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

async function handleLogin() {
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    if (auth.user?.role === 'student') {
      router.push('/')
    } else {
      router.push('/teacher')
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Login failed'
  }
}
</script>