<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <header class="bg-white shadow-sm border-b sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-3">
          <div class="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
            CBT
          </div>
          <div>
            <h1 class="font-bold text-gray-800">CBT Online</h1>
            <p class="text-xs text-gray-500">Computer Based Test</p>
          </div>
        </div>

        <!-- Navigasi -->
        <nav class="flex items-center gap-1">
          <router-link 
            to="/" 
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
          >
            📋 Dashboard
          </router-link>
          <router-link 
            to="/result" 
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="$route.path === '/result' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
          >
            📊 Hasil
          </router-link>
        </nav>

        <!-- User Menu -->
        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-gray-700">{{ auth.user?.name }}</p>
            <p class="text-xs text-gray-500">{{ auth.user?.username || auth.user?.email }}</p>
          </div>
          <div class="bg-blue-100 text-blue-700 w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm">
            {{ auth.user?.name?.charAt(0)?.toUpperCase() || 'S' }}
          </div>
          <button 
            @click="handleLogout" 
            class="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
            title="Keluar"
          >
            🚪 Keluar
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 py-6">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="text-center text-xs text-gray-400 py-4 border-t mt-8">
      © 2025 CBT Online. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  if (confirm('Yakin ingin keluar?')) {
    auth.logout()
    router.push('/login')
  }
}
</script>