<template>
  <div>
    <header class="bg-white shadow p-4 flex justify-between items-center">
      <h1 class="font-bold text-xl">CBT App</h1>
      <div class="flex gap-4 items-center">
        <span v-if="auth.user">{{ auth.user.name }} ({{ auth.user.role }})</span>
        <button @click="logout" class="text-red-600">Logout</button>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const router = useRouter()
function logout() {
  auth.logout()
  router.push('/login')
}
</script>