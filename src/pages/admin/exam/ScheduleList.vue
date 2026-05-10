<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Jadwal Ujian</h1>
      <button @click="openForm" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Jadwal Baru
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="bg-white p-4 rounded shadow mb-4">
      <h2 class="text-lg font-semibold mb-2">{{ editing ? 'Edit' : 'Tambah' }} Jadwal</h2>
      <div class="space-y-3">
        <div>
          <label class="block text-gray-700 mb-1">Judul</label>
          <input v-model="form.title" type="text" class="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Tanggal</label>
          <input v-model="form.exam_date" type="date" class="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Deskripsi</label>
          <textarea v-model="form.description" class="w-full border px-3 py-2 rounded"></textarea>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button @click="saveSchedule" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
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
            <th class="p-3 text-left">Judul</th>
            <th class="p-3 text-left">Tanggal</th>
            <th class="p-3 text-center">Sesi</th>
            <th class="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in schedules" :key="s.id" class="border-t">
            <td class="p-3 font-medium">{{ s.title }}</td>
            <td class="p-3">{{ s.exam_date }}</td>
            <td class="p-3 text-center">
              <router-link :to="`/admin/sessions?schedule_id=${s.id}`" class="text-blue-600 hover:underline">
                Lihat Sesi
              </router-link>
            </td>
            <td class="p-3 text-center">
              <button @click="editSchedule(s)" class="text-blue-600 hover:underline mr-2">Edit</button>
              <button @click="deleteSchedule(s.id)" class="text-red-600 hover:underline">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'

const schedules = ref([])
const showForm = ref(false)
const editing = ref(false)
const form = reactive({ id: null, title: '', exam_date: '', description: '' })

onMounted(() => fetchSchedules())

async function fetchSchedules() {
  try {
    const res = await api.get('/schedules')
    schedules.value = res.data
  } catch (err) { console.error(err) }
}

function openForm() {
  editing.value = false
  form.id = null
  form.title = ''
  form.exam_date = ''
  form.description = ''
  showForm.value = true
}

function editSchedule(s) {
  editing.value = true
  form.id = s.id
  form.title = s.title
  form.exam_date = s.exam_date
  form.description = s.description || ''
  showForm.value = true
}

async function saveSchedule() {
  try {
    if (editing.value) {
      await api.put(`/schedules/${form.id}`, { ...form })
    } else {
      await api.post('/schedules', { ...form })
    }
    showForm.value = false
    fetchSchedules()
  } catch (err) { console.error(err) }
}

async function deleteSchedule(id) {
  if (!confirm('Hapus jadwal ini?')) return
  try {
    await api.delete(`/schedules/${id}`)
    fetchSchedules()
  } catch (err) { console.error(err) }
}
</script>