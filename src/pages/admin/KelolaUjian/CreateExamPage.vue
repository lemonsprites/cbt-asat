<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Buat Ujian Baru</h1>
    <div class="bg-white p-6 rounded shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-700 mb-1">Judul Ujian</label>
          <input v-model="form.title" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Status</label>
          <select v-model="form.status" class="w-full border px-3 py-2 rounded">
            <option value="scheduled">Terjadwal</option>
            <option value="ongoing">Sedang Berlangsung</option>
            <option value="finished">Selesai</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Waktu Mulai</label>
          <input type="datetime-local" v-model="form.start_time" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Waktu Selesai</label>
          <input type="datetime-local" v-model="form.end_time" class="w-full border px-3 py-2 rounded" required />
        </div>
      </div>

      <div class="mt-6 flex gap-2">
        <button @click="submitExam" :disabled="submitting" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {{ submitting ? 'Menyimpan...' : 'Simpan Ujian' }}
        </button>
        <router-link to="/teacher/exams" class="px-4 py-2 border rounded hover:bg-gray-100">Batal</router-link>
      </div>
      <p v-if="message" class="mt-2 text-green-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toISOString } from '@/utils/time'
import api from '@/api/axios'

const router = useRouter()
const submitting = ref(false)
const message = ref('')

const form = reactive({
  title: '',
  status: 'scheduled',
  start_time: '',
  end_time: '',
})

async function submitExam() {
  if (!form.title || !form.start_time || !form.end_time) {
    alert('Judul, waktu mulai, dan waktu selesai wajib diisi.')
    return
  }
  submitting.value = true
  message.value = ''
  try {
    await api.post('/exams', {
      title: form.title,
      start_time: toISOString(form.start_time),
      end_time: toISOString(form.end_time),
      status: form.status,
    })
    message.value = 'Ujian berhasil dibuat.'
    setTimeout(() => router.push('/teacher/exams'), 1000)
  } catch (err) {
    console.error(err)
    alert('Gagal membuat ujian.')
  } finally {
    submitting.value = false
  }
}
</script>