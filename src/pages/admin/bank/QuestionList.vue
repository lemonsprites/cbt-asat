<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div>
        <h1 class="text-2xl font-bold">Soal</h1>
        <p class="text-gray-600">Paket: {{ packageTitle }}</p>
      </div>
      <div class="flex gap-2">
        <button @click="showImport = true" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
          📥 Import CSV
        </button>
        <a :href="importTemplateUrl" download class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm">
          📄 Template
        </a>
        <button @click="openForm" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Soal Baru
        </button>
      </div>
    </div>

    <!-- Modal Import -->
    <div v-if="showImport" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-4">📥 Import Soal dari CSV</h2>

        <div class="mb-3">
          <label class="block text-gray-700 text-sm mb-1">File CSV</label>
          <input type="file" accept=".csv" @change="onFileSelected" class="w-full border px-3 py-2 rounded" />
          <p class="text-xs text-gray-500 mt-1">
            Format: question_type, question_text, answer_key, score, options
          </p>
        </div>

        <div v-if="importResult" class="mb-3 p-3 rounded" :class="importResult.success ? 'bg-green-50' : 'bg-red-50'">
          <p class="text-sm font-medium">{{ importResult.message }}</p>
          <ul v-if="importResult.errors && importResult.errors.length > 0" class="text-xs text-red-600 mt-1 list-disc list-inside">
            <li v-for="(err, i) in importResult.errors" :key="i">{{ err }}</li>
          </ul>
        </div>

        <div class="flex gap-2 justify-end">
          <button @click="showImport = false; importResult = null" class="border px-4 py-2 rounded hover:bg-gray-100">Tutup</button>
          <button @click="uploadFile" :disabled="!selectedFile || uploading"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {{ uploading ? '⏳ Mengupload...' : 'Upload & Import' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Form tambah/edit -->
    <div v-if="showForm" class="bg-white p-4 rounded shadow mb-4">
      <h2 class="text-lg font-semibold mb-2">{{ editing ? 'Edit' : 'Tambah' }} Soal</h2>
      <div class="space-y-3">
        <div>
          <label class="block text-gray-700 mb-1">Tipe Soal</label>
          <select v-model="form.question_type" class="w-full border px-3 py-2 rounded">
            <option value="single">Pilihan Tunggal</option>
            <option value="multiple">Pilihan Ganda</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Pertanyaan</label>
          <textarea v-model="form.question_text" class="w-full border px-3 py-2 rounded" rows="3"></textarea>
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Skor</label>
          <input v-model.number="form.score" type="number" class="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 mb-1">Kunci Jawaban</label>
          <input v-model="form.answer_key" type="text" class="w-full border px-3 py-2 rounded"
            placeholder="a / a,c (untuk multiple)" />
        </div>

        <!-- Opsi -->
        <div>
          <label class="block text-gray-700 mb-1">Opsi Jawaban</label>
          <div v-for="(opt, idx) in form.options" :key="idx" class="flex gap-2 mb-2">
            <span class="w-8 pt-2 font-bold">{{ opt.option_key }}</span>
            <input v-model="opt.option_text" class="border px-2 py-1 rounded flex-1" placeholder="Teks opsi" />
            <button @click="removeOption(idx)" class="text-red-500">x</button>
          </div>
          <button @click="addOption" class="text-sm text-blue-600">+ Tambah Opsi</button>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button @click="saveQuestion" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {{ editing ? 'Update' : 'Simpan' }}
        </button>
        <button @click="showForm = false" class="border px-4 py-2 rounded hover:bg-gray-100">Batal</button>
      </div>
    </div>

    <!-- Daftar Soal -->
    <div v-if="questions.length === 0" class="text-gray-400 text-center py-8">
      📝 Belum ada soal. Import CSV atau tambah manual.
    </div>
    <div v-for="(q, idx) in questions" :key="q.id" class="bg-white p-4 rounded shadow mb-3">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <span class="font-bold">{{ idx + 1 }}. {{ q.question_text }}</span>
          <span class="ml-2 text-xs px-2 py-0.5 rounded" :class="q.question_type === 'single' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'">
            {{ q.question_type }}
          </span>
          <span class="ml-2 text-xs text-gray-500">Skor: {{ q.score }}</span>
          <div class="ml-4 mt-2 space-y-1">
            <div v-for="opt in q.options" :key="opt.id" class="flex gap-2">
              <span class="font-bold">{{ opt.option_key }}.</span>
              <span>{{ opt.option_text }}</span>
              <span v-if="isCorrectAnswer(q.answer_key, opt.option_key)" class="text-green-600">✓</span>
            </div>
          </div>
        </div>
        <div class="flex gap-2 ml-4">
          <button @click="editQuestion(q)" class="text-blue-600 hover:underline text-sm">Edit</button>
          <button @click="deleteQuestion(q.id)" class="text-red-600 hover:underline text-sm">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'

const route = useRoute()
const router = useRouter()
const packageId = route.query.package_id
const packageTitle = ref('')
const questions = ref([])
const showForm = ref(false)
const editing = ref(false)
const form = reactive({
  id: null,
  question_type: 'single',
  question_text: '',
  answer_key: '',
  score: 1,
  options: [
    { option_key: 'A', option_text: '', image_url: '' },
    { option_key: 'B', option_text: '', image_url: '' },
    { option_key: 'C', option_text: '', image_url: '' },
    { option_key: 'D', option_text: '', image_url: '' },
  ]
})

// ========== IMPORT CSV ==========
const showImport = ref(false)
const selectedFile = ref(null)
const uploading = ref(false)
const importResult = ref(null)

const importTemplateUrl = computed(() => {
  return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/import/template`
})

// ========== MOUNTED ==========
onMounted(async () => {
  if (!packageId) {
    router.push('/admin/packages')
    return
  }
  fetchQuestions()
})

// ========== FETCH ==========
async function fetchQuestions() {
  try {
    const res = await api.get(`/questions?package_id=${packageId}`)
    questions.value = res.data

    const pkg = await api.get(`/packages`)
    const found = pkg.data.find(p => p.id === packageId)
    if (found) packageTitle.value = found.title
  } catch (err) { console.error(err) }
}

// ========== IMPORT ==========
function onFileSelected(event) {
  selectedFile.value = event.target.files[0]
  importResult.value = null
}

async function uploadFile() {
  if (!selectedFile.value) return
  
  uploading.value = true
  importResult.value = null
  
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('package_id', packageId)
    
    const res = await api.post('/import/questions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    importResult.value = {
      success: true,
      message: res.data.message,
      errors: res.data.errors
    }
    
    if (res.data.inserted > 0) {
      fetchQuestions()
      selectedFile.value = null
    }
  } catch (err) {
    importResult.value = {
      success: false,
      message: err.response?.data?.message || 'Gagal import',
      errors: err.response?.data?.errors || []
    }
  } finally {
    uploading.value = false
  }
}

// ========== FORM ==========
function openForm() {
  editing.value = false
  form.id = null
  form.question_type = 'single'
  form.question_text = ''
  form.answer_key = ''
  form.score = 1
  form.options = [
    { option_key: 'A', option_text: '', image_url: '' },
    { option_key: 'B', option_text: '', image_url: '' },
    { option_key: 'C', option_text: '', image_url: '' },
    { option_key: 'D', option_text: '', image_url: '' },
  ]
  showForm.value = true
}

function editQuestion(q) {
  editing.value = true
  form.id = q.id
  form.question_type = q.question_type
  form.question_text = q.question_text
  form.answer_key = q.answer_key
  form.score = q.score
  form.options = q.options.map(o => ({
    option_key: o.option_key,
    option_text: o.option_text,
    image_url: o.image_url || ''
  }))
  showForm.value = true
}

function addOption() {
  const keys = ['A', 'B', 'C', 'D', 'E', 'F']
  const nextKey = keys.find(k => !form.options.find(o => o.option_key === k)) || 'X'
  form.options.push({ option_key: nextKey, option_text: '', image_url: '' })
}

function removeOption(idx) {
  form.options.splice(idx, 1)
}

// ========== HELPERS ==========
function isCorrectAnswer(answerKey, optionKey) {
  if (!answerKey) return false
  const keys = answerKey.split(',').map(k => k.trim().toLowerCase())
  return keys.includes(optionKey.toLowerCase())
}

// ========== SAVE / DELETE ==========
async function saveQuestion() {
  try {
    const payload = {
      package_id: packageId,
      question_type: form.question_type,
      question_text: form.question_text,
      answer_key: form.answer_key,
      score: form.score,
      options: form.options
    }
    if (editing.value) {
      await api.put(`/questions/${form.id}`, payload)
    } else {
      await api.post('/questions', payload)
    }
    showForm.value = false
    fetchQuestions()
  } catch (err) { console.error(err) }
}

async function deleteQuestion(id) {
  if (!confirm('Hapus soal ini?')) return
  try {
    await api.delete(`/questions/${id}`)
    fetchQuestions()
  } catch (err) { console.error(err) }
}
</script>