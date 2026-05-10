<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div v-if="loading" class="text-center">Memuat data ujian...</div>
    <div v-else-if="!exam" class="text-center text-red-500">Ujian tidak ditemukan.</div>
    <div v-else>
      <!-- Detail Ujian -->
      <div class="bg-white p-6 rounded shadow mb-6">
        <h1 class="text-2xl font-bold mb-4">Edit Ujian</h1>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 mb-1">Judul</label>
            <input v-model="form.title" class="w-full border px-3 py-2 rounded" />
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
            <input type="datetime-local" v-model="form.start_time" class="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label class="block text-gray-700 mb-1">Waktu Selesai</label>
            <input type="datetime-local" v-model="form.end_time" class="w-full border px-3 py-2 rounded" />
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button @click="saveExam" :disabled="saving" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
          <span v-if="saveMessage" class="text-green-600 self-center">{{ saveMessage }}</span>
        </div>
      </div>

      <!-- Soal & Import -->
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-2">Soal Ujian</h2>
        <p v-if="!hasQuestions" class="text-gray-500">Belum ada soal untuk ujian ini.</p>
        <p v-else class="text-gray-700">Jumlah soal: {{ questionCount }} (detail hanya bisa dilihat saat import).</p>
        <div class="mt-4">
          <button @click="importQuestions" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Import Soal (CSV/Excel)
          </button>
          <span class="text-sm text-gray-500 ml-2">Fitur import akan menyusul.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { toDatetimeLocal, toISOString } from '@/utils/time'
import api from '@/api/axios'

const route = useRoute()
const examId = route.params.examId

const exam = ref(null)
const loading = ref(true)
const saving = ref(false)
const saveMessage = ref('')
const hasQuestions = ref(false)
const questionCount = ref(0)

const form = reactive({
  title: '',
  status: '',
  start_time: '',
  end_time: '',
})

onMounted(async () => {
  try {
    const res = await api.get(`/exams/${examId}`)
    exam.value = res.data
    form.title = res.data.title
    form.status = res.data.status
    form.start_time = toDatetimeLocal(res.data.start_time)
    form.end_time = toDatetimeLocal(res.data.end_time)

    if (res.data.packages && res.data.packages.length > 0) {
      hasQuestions.value = true
      // Hitung jumlah soal dari struktur blok
      const blocks = res.data.packages[0].questions || []
      questionCount.value = blocks.reduce((sum, b) => sum + (b.questions ? b.questions.length : 0), 0)
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

async function saveExam() {
  saving.value = true
  saveMessage.value = ''
  try {
    await api.put(`/exams/${examId}`, {
      title: form.title,
      status: form.status,
      start_time: toISOString(form.start_time),
      end_time: toISOString(form.end_time),
    })
    saveMessage.value = 'Ujian berhasil diperbarui.'
  } catch (err) {
    console.error(err)
    saveMessage.value = 'Gagal menyimpan.'
  } finally {
    saving.value = false
  }
}

function importQuestions() {
  alert('Fitur import akan datang!')
}
</script>