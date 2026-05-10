<template>
  <div class="p-6 max-w-4xl mx-auto">
    <!-- Kartu Sambutan -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg shadow-lg p-6 mb-6">
      <div class="flex items-center gap-4">
        <div class="bg-white text-blue-700 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
          {{ auth.user?.name?.charAt(0)?.toUpperCase() || '👤' }}
        </div>
        <div>
          <h1 class="text-2xl font-bold">Halo, {{ auth.user?.name }}!</h1>
          <p class="text-blue-100 mt-1">Selamat datang di CBT Online</p>
        </div>
      </div>
      <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div class="bg-white/20 rounded p-2">
          <p class="text-xs text-blue-100">Role</p>
          <p class="font-semibold uppercase">{{ auth.user?.role }}</p>
        </div>
        <div class="bg-white/20 rounded p-2">
          <p class="text-xs text-blue-100">Username</p>
          <p class="font-semibold">{{ auth.user?.username || '-' }}</p>
        </div>
        <div class="bg-white/20 rounded p-2">
          <p class="text-xs text-blue-100">Email</p>
          <p class="font-semibold text-sm">{{ auth.user?.email }}</p>
        </div>
        <div class="bg-white/20 rounded p-2">
          <p class="text-xs text-blue-100">Status</p>
          <p class="font-semibold">🟢 Online</p>
        </div>
      </div>
    </div>

    <!-- Input Token Ujian -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-xl font-semibold mb-2">🔑 Masuk Ujian</h2>
      <p class="text-gray-500 text-sm mb-4">
        Masukkan token ujian yang diberikan oleh pengawas untuk memulai ujian.
      </p>
      <div class="flex gap-2">
        <input 
          v-model="token" 
          type="text" 
          placeholder="Masukkan token (contoh: AB12CD34)" 
          class="border-2 border-gray-300 px-4 py-3 rounded-lg flex-1 uppercase tracking-widest text-center text-lg font-mono focus:border-blue-500 focus:outline-none"
          @keyup.enter="verifyToken"
          maxlength="8"
        />
        <button 
          @click="verifyToken" 
          :disabled="verifying || !token || token.length < 6" 
          class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {{ verifying ? '⏳ Verifikasi...' : '🚀 Mulai Ujian' }}
        </button>
      </div>
      <p v-if="error" class="text-red-500 mt-3 text-sm flex items-center gap-1">
        ⚠️ {{ error }}
      </p>
    </div>

    <!-- Ketentuan Ujian -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">📋 Ketentuan Ujian</h2>
      <div class="space-y-3 text-gray-700">
        <div class="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <span class="text-yellow-600 text-xl">⏰</span>
          <div>
            <p class="font-semibold">Waktu Ujian</p>
            <p class="text-sm text-gray-600">Perhatikan waktu yang tersedia. Ujian akan otomatis terkumpul saat waktu habis.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span class="text-blue-600 text-xl">🖥️</span>
          <div>
            <p class="font-semibold">Mode Fullscreen</p>
            <p class="text-sm text-gray-600">Ujian harus dikerjakan dalam mode layar penuh. Jangan keluar dari halaman ujian.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <span class="text-green-600 text-xl">💾</span>
          <div>
            <p class="font-semibold">Auto-save</p>
            <p class="text-sm text-gray-600">Jawaban kamu akan disimpan otomatis setiap 30 detik. Kamu bisa melanjutkan jika koneksi terputus.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <span class="text-red-600 text-xl">🚫</span>
          <div>
            <p class="font-semibold">Dilarang</p>
            <p class="text-sm text-gray-600">Dilarang membuka tab lain, menyontek, atau bekerja sama. Pelanggaran akan dicatat sistem.</p>
          </div>
        </div>
        <div class="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <span class="text-purple-600 text-xl">✅</span>
          <div>
            <p class="font-semibold">Setelah Selesai</p>
            <p class="text-sm text-gray-600">Klik tombol "Kumpulkan" setelah semua soal dijawab. Nilai akan muncul setelah submit.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const auth = useAuthStore()
const router = useRouter()
const token = ref('')
const verifying = ref(false)
const error = ref('')

async function verifyToken() {
  if (!token.value || token.value.length < 6) return
  
  verifying.value = true
  error.value = ''
  
  try {
    const res = await api.post('/exam/verify-token', { token: token.value })
    
    // Simpan data ujian ke sessionStorage
    sessionStorage.setItem('examData', JSON.stringify(res.data))
    
    // Jika hanya 1 distribusi, langsung masuk ujian
    if (res.data.distributions.length === 1) {
      const dist = res.data.distributions[0]
      
      // Mulai ujian & dapat participant_id
      const startRes = await api.post(`/exam/start/${dist.id}`)
      sessionStorage.setItem('participantData', JSON.stringify(startRes.data))
      
      router.push(`/exam/${dist.id}`)
    } else {
      // Jika banyak mapel, tampilkan halaman pilih
      router.push('/exam/select')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Token tidak valid'
  } finally {
    verifying.value = false
  }
}
</script>