<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md p-4 hidden md:block">
      <h2 class="text-xl font-bold mb-6">CBT Admin</h2>
      <nav>
        <ul class="space-y-2">
          <li><router-link to="/admin" class="block p-2 rounded hover:bg-gray-200">Dashboard</router-link></li>

          <li class="pt-2">
            <span class="font-semibold text-gray-500 text-sm">Master Data</span>
            <ul class="ml-4 space-y-1 mt-1">
              <li><router-link to="/admin/subjects" class="block p-1 rounded hover:bg-gray-200">Mapel</router-link></li>
              <li><router-link to="/admin/classes" class="block p-1 rounded hover:bg-gray-200">Kelas</router-link></li>
              <li><router-link to="/admin/users" class="block p-1 rounded hover:bg-gray-200">Users</router-link></li>
            </ul>
          </li>

          <li class="pt-2">
            <span class="font-semibold text-gray-500 text-sm">Bank Soal</span>
            <ul class="ml-4 space-y-1 mt-1">
              <li><router-link to="/admin/packages" class="block p-1 rounded hover:bg-gray-200">Paket Soal</router-link>
              </li>
              <li><router-link to="/admin/questions" class="block p-1 rounded hover:bg-gray-200">Soal</router-link></li>
            </ul>
          </li>

          <li class="pt-2">
            <span class="font-semibold text-gray-500 text-sm">Ujian</span>
            <ul class="ml-4 space-y-1 mt-1">
              <li><router-link to="/admin/schedules" class="block p-1 rounded hover:bg-gray-200">Jadwal</router-link>
              </li>
              <li><router-link to="/admin/sessions" class="block p-1 rounded hover:bg-gray-200">Sesi</router-link></li>
              <li><router-link to="/admin/distributions"
                  class="block p-1 rounded hover:bg-gray-200">Distribusi</router-link></li>
              <li><router-link to="/admin/tokens" class="block p-1 rounded hover:bg-gray-200">🔑 Token</router-link>
              </li>
            </ul>
          </li>

          <li class="pt-2">
            <span class="font-semibold text-gray-500 text-sm">Hasil</span>
            <ul class="ml-4 space-y-1 mt-1">
              <li><router-link to="/admin/results" class="block p-1 rounded hover:bg-gray-200">Nilai</router-link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white shadow p-4 flex justify-between items-center">
        <h1 class="font-bold text-xl">Admin Panel</h1>
        <div class="flex items-center gap-4">
          <span v-if="auth.user">{{ auth.user.name }} ({{ auth.user.role }})</span>
          <button @click="logout" class="text-red-600">Logout</button>
        </div>
      </header>
      <main class="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push('/login');
}
</script>