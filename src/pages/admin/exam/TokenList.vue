<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">🔑 Daftar Token Ujian</h1>
      <div class="flex gap-2">
        <button @click="fetchTokens" class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm">
          🔄 Refresh
        </button>
        <button @click="showExportModal = true" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
          📥 Export Token
        </button>
      </div>
    </div>

    <!-- Filter -->
    <div class="bg-white p-4 rounded shadow mb-4">
      <div class="flex gap-2 flex-wrap">
        <input 
          v-model="search" 
          type="text" 
          placeholder="Cari token / kelas / mapel..." 
          class="border px-3 py-2 rounded flex-1 min-w-[200px]"
        />
        <select v-model="filterStatus" class="border px-3 py-2 rounded">
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </div>
    </div>

    <!-- Tabel Token -->
    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="p-3 text-left">Token</th>
            <th class="p-3 text-left">Jadwal</th>
            <th class="p-3 text-left">Sesi</th>
            <th class="p-3 text-left">Kelas</th>
            <th class="p-3 text-left">Mapel</th>
            <th class="p-3 text-left">Paket</th>
            <th class="p-3 text-center">Peserta</th>
            <th class="p-3 text-center">Selesai</th>
            <th class="p-3 text-center">Status</th>
            <th class="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in filteredTokens" :key="t.token" class="border-t hover:bg-gray-50">
            <td class="p-3">
              <span class="font-mono font-bold text-blue-700 text-lg tracking-wider">{{ t.token }}</span>
            </td>
            <td class="p-3">
              <div class="font-medium">{{ t.schedule_title }}</div>
              <div class="text-xs text-gray-500">{{ formatDate(t.exam_date) }}</div>
            </td>
            <td class="p-3">{{ t.session_name }}</td>
            <td class="p-3">
              {{ t.class_name }}
              <span class="text-xs text-gray-500">({{ t.level }} {{ t.major }})</span>
            </td>
            <td class="p-3">{{ t.subject_name }}</td>
            <td class="p-3">{{ t.package_title }}</td>
            <td class="p-3 text-center">{{ t.participant_count || 0 }}</td>
            <td class="p-3 text-center">{{ t.finished_count || 0 }}</td>
            <td class="p-3 text-center">
              <span 
                :class="t.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {{ t.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>
            <td class="p-3 text-center">
              <button @click="copyToken(t.token)" class="text-blue-600 hover:underline text-xs mr-2">
                📋 Copy
              </button>
              <button @click="toggleStatus(t)" class="text-xs hover:underline"
                :class="t.is_active ? 'text-red-600' : 'text-green-600'">
                {{ t.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredTokens.length === 0" class="text-center text-gray-400 py-8">
        Tidak ada token ditemukan
      </div>
    </div>

    <!-- Info -->
    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-3 rounded shadow text-center">
        <p class="text-xs text-gray-500">Total Token</p>
        <p class="text-2xl font-bold">{{ tokens.length }}</p>
      </div>
      <div class="bg-white p-3 rounded shadow text-center">
        <p class="text-xs text-gray-500">Token Aktif</p>
        <p class="text-2xl font-bold text-green-600">{{ tokens.filter(t => t.is_active).length }}</p>
      </div>
      <div class="bg-white p-3 rounded shadow text-center">
        <p class="text-xs text-gray-500">Total Peserta</p>
        <p class="text-2xl font-bold text-blue-600">{{ totalParticipants }}</p>
      </div>
      <div class="bg-white p-3 rounded shadow text-center">
        <p class="text-xs text-gray-500">Selesai</p>
        <p class="text-2xl font-bold text-purple-600">{{ totalFinished }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import dayjs from 'dayjs'

const tokens = ref([])
const search = ref('')
const filterStatus = ref('')

const filteredTokens = computed(() => {
  let result = tokens.value
  
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(t => 
      t.token?.toLowerCase().includes(q) ||
      t.class_name?.toLowerCase().includes(q) ||
      t.subject_name?.toLowerCase().includes(q) ||
      t.schedule_title?.toLowerCase().includes(q)
    )
  }
  
  if (filterStatus.value === 'active') {
    result = result.filter(t => t.is_active)
  } else if (filterStatus.value === 'inactive') {
    result = result.filter(t => !t.is_active)
  }
  
  return result
})

const totalParticipants = computed(() => {
  return tokens.value.reduce((sum, t) => sum + (t.participant_count || 0), 0)
})

const totalFinished = computed(() => {
  return tokens.value.reduce((sum, t) => sum + (t.finished_count || 0), 0)
})

onMounted(() => fetchTokens())

async function fetchTokens() {
  try {
    const res = await api.get('/distributions/tokens')
    tokens.value = res.data
  } catch (err) {
    console.error(err)
  }
}

function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY')
}

function copyToken(token) {
  navigator.clipboard.writeText(token).then(() => {
    alert('✅ Token disalin: ' + token)
  }).catch(() => {
    // Fallback
    const input = document.createElement('input')
    input.value = token
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    alert('✅ Token disalin: ' + token)
  })
}

async function toggleStatus(t) {
  const action = t.is_active ? 'nonaktifkan' : 'aktifkan'
  if (!confirm(`Yakin ${action} token ${t.token}?`)) return
  
  try {
    await api.put(`/distributions/${t.id}`, { is_active: !t.is_active })
    fetchTokens()
  } catch (err) {
    console.error(err)
    alert('Gagal mengubah status')
  }
}
</script>