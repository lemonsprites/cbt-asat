<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Mata Pelajaran</h1>
      <button @click="openForm" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Mapel Baru
      </button>
    </div>

    <!-- Form tambah/edit -->
    <div v-if="showForm" class="bg-white p-4 rounded shadow mb-4">
      <h2 class="text-lg font-semibold mb-2">{{ editing ? 'Edit' : 'Tambah' }} Mapel</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-700 mb-1">Nama</label>
          <input v-model="form.name" type="text" class="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Kode (opsional)</label>
          <input v-model="form.code" type="text" class="w-full border px-3 py-2 rounded" />
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <button @click="saveSubject" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
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
            <th class="p-3 text-left">Nama Mapel</th>
            <th class="p-3 text-left">Kode</th>
            <th class="p-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in subjects" :key="s.id" class="border-t">
            <td class="p-3">{{ s.name }}</td>
            <td class="p-3">{{ s.code || '-' }}</td>
            <td class="p-3 text-center">
              <button @click="editSubject(s)" class="text-blue-600 hover:underline mr-2">Edit</button>
              <button @click="deleteSubject(s.id)" class="text-red-600 hover:underline">Hapus</button>
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

const subjects = ref([])
const showForm = ref(false)
const editing = ref(false)
const form = reactive({ id: null, name: '', code: '' })

onMounted(() => fetchSubjects())

async function fetchSubjects() {
  try {
    const res = await api.get('/subjects')
    subjects.value = res.data
  } catch (err) {
    console.error(err)
  }
}

function openForm() {
  editing.value = false
  form.id = null
  form.name = ''
  form.code = ''
  showForm.value = true
}

function editSubject(s) {
  editing.value = true
  form.id = s.id
  form.name = s.name
  form.code = s.code || ''
  showForm.value = true
}

async function saveSubject() {
  try {
    if (editing.value) {
      await api.put(`/subjects/${form.id}`, { name: form.name, code: form.code })
    } else {
      await api.post('/subjects', { name: form.name, code: form.code })
    }
    showForm.value = false
    fetchSubjects()
  } catch (err) {
    console.error(err)
  }
}

async function deleteSubject(id) {
  if (!confirm('Hapus mapel ini?')) return
  try {
    await api.delete(`/subjects/${id}`)
    fetchSubjects()
  } catch (err) {
    console.error(err)
  }
}
</script>