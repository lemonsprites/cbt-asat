<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Sesi Ujian</h1>
      <button @click="openForm" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Sesi Baru
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="bg-white p-4 rounded shadow mb-4">
      <h2 class="text-lg font-semibold mb-2">{{ editing ? 'Edit' : 'Tambah' }} Sesi</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label class="block text-gray-700 mb-1">Jadwal</label>
          <select v-model="form.schedule_id" class="w-full border px-3 py-2 rounded">
            <option value="">-- Pilih Jadwal --</option>
            <option v-for="s in schedules" :key="s.id" :value="s.id">{{ s.title }} ({{ s.exam_date }})</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Nama Sesi</label>
          <input v-model="form.name" type="text" class="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Jam Mulai</label>
          <input v-model="form.start_time" type="time" class="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Jam Selesai</label>
          <input v-model="form.end_time" type="time" class="w-full border px-3 py-2 rounded" />
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button @click="saveSession" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {{ editing ? 'Update' : 'Simpan' }}
        </button>
        <button @click="showForm = false" class="border px-4 py-2 rounded hover:bg-gray-100">Batal</button>
      </div>
    </div>

    <!-- Tabel -->
    <div class="bg-white rounded shadow overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="p-3 text-left">Nama Sesi</th>
            <th class="p-3 text-left">Jadwal</th>
            <th class="p-3 text-left">Tanggal</th>
            <th class="p-3 text-left">Jam</th>
            <th class="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in sessions" :key="s.id" class="border-t">
            <td class="p-3 font-medium">{{ s.name }}</td>
            <td class="p-3">{{ s.schedule_title }}</td>
            <td class="p-3">{{ s.exam_date }}</td>
            <td class="p-3">{{ s.start_time?.slice(0,5) }} - {{ s.end_time?.slice(0,5) }}</td>
            <td class="p-3 text-center">
              <button @click="editSession(s)" class="text-blue-600 hover:underline mr-2">Edit</button>
              <button @click="deleteSession(s.id)" class="text-red-600 hover:underline">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'

const route = useRoute()
const scheduleId = route.query.schedule_id
const sessions = ref([])
const schedules = ref([])
const showForm = ref(false)
const editing = ref(false)
const form = reactive({ id: null, schedule_id: scheduleId || '', name: '', start_time: '', end_time: '' })

onMounted(async () => {
  const [sessionsRes, schedulesRes] = await Promise.all([
    api.get(`/sessions${scheduleId ? '?schedule_id=' + scheduleId : ''}`),
    api.get('/schedules')
  ])
  sessions.value = sessionsRes.data
  schedules.value = schedulesRes.data
})

function openForm() {
  editing.value = false
  form.id = null
  form.schedule_id = scheduleId || ''
  form.name = ''
  form.start_time = ''
  form.end_time = ''
  showForm.value = true
}

function editSession(s) {
  editing.value = true
  form.id = s.id
  form.schedule_id = s.schedule_id
  form.name = s.name
  form.start_time = s.start_time?.slice(0, 5)
  form.end_time = s.end_time?.slice(0, 5)
  showForm.value = true
}

async function saveSession() {
  try {
    if (editing.value) {
      await api.put(`/sessions/${form.id}`, { ...form })
    } else {
      await api.post('/sessions', { ...form })
    }
    showForm.value = false
    const resp = await api.get(`/sessions${scheduleId ? '?schedule_id=' + scheduleId : ''}`)
    sessions.value = resp.data
  } catch (err) { console.error(err) }
}

async function deleteSession(id) {
  if (!confirm('Hapus sesi ini?')) return
  try {
    await api.delete(`/sessions/${id}`)
    const resp = await api.get(`/sessions${scheduleId ? '?schedule_id=' + scheduleId : ''}`)
    sessions.value = resp.data
  } catch (err) { console.error(err) }
}
</script>