<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Paket Soal</h1>
      <button @click="openForm" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Paket Baru
      </button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="bg-white p-4 rounded shadow mb-4">
      <h2 class="text-lg font-semibold mb-2">{{ editing ? 'Edit' : 'Tambah' }} Paket</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-700 mb-1">Judul Paket</label>
          <input v-model="form.title" type="text" class="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Mata Pelajaran</label>
          <select v-model="form.subject_id" class="w-full border px-3 py-2 rounded">
            <option value="">-- Pilih Mapel --</option>
            <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Durasi (menit)</label>
          <input v-model.number="form.duration" type="number" class="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Deskripsi</label>
          <textarea v-model="form.description" class="w-full border px-3 py-2 rounded"></textarea>
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <button @click="savePackage" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
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
            <th class="p-3 text-left">Paket</th>
            <th class="p-3 text-left">Mapel</th>
            <th class="p-3 text-left">Durasi</th>
            <th class="p-3 text-left">Soal</th>
            <th class="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in packages" :key="p.id" class="border-t">
            <td class="p-3 font-medium">{{ p.title }}</td>
            <td class="p-3">{{ p.subject_name }}</td>
            <td class="p-3">{{ p.duration }} menit</td>
            <td class="p-3">
              <router-link :to="`/admin/questions?package_id=${p.id}`" class="text-blue-600 hover:underline">
                {{ p.total_question || 0 }} soal
              </router-link>
            </td>
            <td class="p-3 text-center">
              <button @click="editPackage(p)" class="text-blue-600 hover:underline mr-2">Edit</button>
              <button @click="deletePackage(p.id)" class="text-red-600 hover:underline">Hapus</button>
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

const packages = ref([])
const subjects = ref([])
const showForm = ref(false)
const editing = ref(false)
const form = reactive({ id: null, subject_id: '', title: '', description: '', duration: 0 })

onMounted(async () => {
  fetchPackages()
  const res = await api.get('/subjects')
  subjects.value = res.data
})

async function fetchPackages() {
  try {
    const res = await api.get('/packages')
    packages.value = res.data
  } catch (err) { console.error(err) }
}

function openForm() {
  editing.value = false
  form.id = null
  form.subject_id = ''
  form.title = ''
  form.description = ''
  form.duration = 0
  showForm.value = true
}

function editPackage(p) {
  editing.value = true
  form.id = p.id
  form.subject_id = p.subject_id
  form.title = p.title
  form.description = p.description || ''
  form.duration = p.duration || 0
  showForm.value = true
}

async function savePackage() {
  try {
    if (editing.value) {
      await api.put(`/packages/${form.id}`, { ...form })
    } else {
      await api.post('/packages', { ...form })
    }
    showForm.value = false
    fetchPackages()
  } catch (err) { console.error(err) }
}

async function deletePackage(id) {
  if (!confirm('Hapus paket ini beserta semua soalnya?')) return
  try {
    await api.delete(`/packages/${id}`)
    fetchPackages()
  } catch (err) { console.error(err) }
}
</script>