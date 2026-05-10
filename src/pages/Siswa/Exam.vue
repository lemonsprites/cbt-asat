<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <div class="bg-white shadow p-4 flex justify-between items-center">
      <div>
        <h1 class="font-bold text-lg">{{ currentDist?.subject_name }}</h1>
        <p class="text-sm text-gray-600">{{ currentDist?.package_title }}</p>
      </div>
      <TimerBar :end-time="examEndTime" @time-up="autoSubmit" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-20">Memuat soal...</div>

    <!-- Soal -->
    <div v-else class="max-w-3xl mx-auto p-4">
      <!-- Navigasi Soal -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="(q, idx) in questions"
          :key="q.id"
          @click="currentIndex = idx"
          :class="[
            'w-10 h-10 rounded-full text-sm font-medium',
            currentIndex === idx ? 'bg-blue-600 text-white' : 
            (localAnswers[idx] !== undefined && localAnswers[idx] !== '' && localAnswers[idx]?.length !== 0) ? 'bg-green-100 border border-green-500' : 'bg-gray-200'
          ]"
        >
          {{ idx + 1 }}
        </button>
      </div>

      <!-- Kartu Soal -->
      <div v-if="currentQuestion" class="bg-white p-6 rounded shadow">
        <div class="flex justify-between mb-2">
          <span class="text-sm text-gray-500">Soal {{ currentIndex + 1 }} dari {{ questions.length }} · {{ getTypeLabel(currentQuestion.question_type) }}</span>
          <span class="text-sm text-gray-500">Skor: {{ currentQuestion.score }}</span>
        </div>
        
        <!-- Stimulus -->
        <div v-if="currentQuestion.stimulus" class="bg-gray-50 p-4 rounded mb-4 text-sm italic border-l-4 border-blue-400">
          {{ currentQuestion.stimulus }}
        </div>

        <!-- Gambar Soal -->
        <img v-if="currentQuestion.image_url" :src="currentQuestion.image_url" alt="Gambar Soal" class="mb-4 max-h-60 rounded shadow" />

        <h2 class="text-lg font-semibold mb-4">{{ currentQuestion.question_text }}</h2>

        <!-- ========== Pilihan Ganda (Tunggal & Kompleks) ========== -->
        <div v-if="['single', 'multiple'].includes(currentQuestion.question_type)" class="space-y-3">
          <label 
            v-for="opt in currentQuestion.options" 
            :key="opt.id"
            class="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50"
            :class="{ 'bg-blue-50 border-blue-400': isSelected(opt.key) }"
          >
            <input
              :type="currentQuestion.question_type === 'multiple' ? 'checkbox' : 'radio'"
              :name="'q_' + currentQuestion.id"
              :value="opt.key"
              :checked="isSelected(opt.key)"
              @change="onAnswerChange(opt.key, $event.target.checked)"
              class="mt-1"
            />
            <div class="flex-1">
              <span class="font-bold">{{ opt.key }}.</span>
              <span>{{ opt.text }}</span>
              <img v-if="opt.image_url" :src="opt.image_url" alt="Gambar Opsi" class="mt-2 max-h-32 rounded border" />
            </div>
          </label>
        </div>

        <!-- ========== Benar / Salah ========== -->
        <div v-if="currentQuestion.question_type === 'truefalse'" class="flex gap-4">
          <button 
            @click="onAnswerChange('true', true)"
            :class="localAnswers[currentIndex] === 'true' ? 'bg-green-500 text-white border-green-500' : 'bg-white border-gray-300 hover:bg-gray-50'"
            class="px-8 py-4 rounded-lg text-lg font-bold border-2 transition-colors"
          >✅ Benar</button>
          <button 
            @click="onAnswerChange('false', true)"
            :class="localAnswers[currentIndex] === 'false' ? 'bg-red-500 text-white border-red-500' : 'bg-white border-gray-300 hover:bg-gray-50'"
            class="px-8 py-4 rounded-lg text-lg font-bold border-2 transition-colors"
          >❌ Salah</button>
        </div>

        <!-- ========== Isian Singkat ========== -->
        <div v-if="currentQuestion.question_type === 'short'">
          <input 
            v-model="localAnswers[currentIndex]" 
            type="text" 
            class="w-full border-2 border-gray-300 px-4 py-3 rounded-lg text-lg focus:border-blue-500 focus:outline-none" 
            placeholder="Ketik jawaban kamu..."
            @input="onSaveLocal()"
          />
        </div>

        <!-- ========== Esai ========== -->
        <div v-if="currentQuestion.question_type === 'essay'">
          <textarea 
            v-model="localAnswers[currentIndex]" 
            class="w-full border-2 border-gray-300 px-4 py-3 rounded-lg focus:border-blue-500 focus:outline-none" 
            rows="10" 
            placeholder="Tulis jawaban kamu di sini..."
            @input="onSaveLocal()"
          ></textarea>
        </div>

        <!-- ========== Menjodohkan ========== -->
        <div v-if="currentQuestion.question_type === 'matching'">
          <p class="text-sm text-gray-500 mb-3">Pasangkan pernyataan kiri dengan jawaban kanan:</p>
          <div class="space-y-3">
            <div v-for="(pair, idx) in matchingPairs" :key="idx" class="flex items-center gap-4 bg-gray-50 p-3 rounded">
              <span class="w-1/2 font-medium text-right">{{ pair.left }}</span>
              <span class="text-xl">↔️</span>
              <select 
                v-model="localAnswers[currentIndex][idx]" 
                class="w-1/2 border-2 border-gray-300 p-2 rounded bg-white focus:border-blue-500 focus:outline-none"
                @change="onSaveLocal()"
              >
                <option value="">Pilih...</option>
                <option v-for="right in matchingRights" :key="right" :value="right">{{ right }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Simpan -->
      <div class="text-center mt-3 text-xs font-medium" :class="saveStatusClass">
        {{ saveStatus }}
      </div>

      <!-- Tombol Navigasi -->
      <div class="flex justify-between mt-6">
        <button @click="prevQuestion" :disabled="currentIndex === 0" class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          Sebelumnya
        </button>
        
        <button 
          v-if="currentIndex < questions.length - 1" 
          @click="nextQuestion" 
          class="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Selanjutnya
        </button>
        
        <button 
          v-else 
          @click="submitExam" 
          :disabled="submitting"
          class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {{ submitting ? 'Mengumpulkan...' : 'Kumpulkan' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'
import dayjs from 'dayjs'
import TimerBar from '@/components/exam/TimeBar.vue'

const route = useRoute()
const router = useRouter()

const examData = ref(null)
const participantData = ref(null)
const currentDist = ref(null)
const questions = ref([])
const localAnswers = ref({})
const currentIndex = ref(0)
const loading = ref(true)
const submitting = ref(false)

const saveStatus = ref('💾 Tersimpan lokal')
const saveStatusClass = ref('text-green-600')

let autosaveInterval = null

// ========== COMPUTED ==========
const examEndTime = computed(() => {
  if (!examData.value?.session) return null
  const session = examData.value.session
  const examDate = dayjs(session.date).format('YYYY-MM-DD')
  const endTime = session.end_time?.slice(0, 8) || '23:59:59'
  return `${examDate}T${endTime}`
})

const currentQuestion = computed(() => questions.value[currentIndex.value] || null)

const matchingPairs = computed(() => {
  if (currentQuestion.value?.question_type !== 'matching') return []
  try {
    const pairs = JSON.parse(currentQuestion.value.answer_key || '[]')
    return pairs.map(p => ({ left: p.left, right: p.right }))
  } catch { return [] }
})

const matchingRights = computed(() => {
  const rights = matchingPairs.value.map(p => p.right)
  return [...new Set(rights)].sort(() => Math.random() - 0.5)
})

// ========== LIFECYCLE ==========
onMounted(async () => {
  const stored = sessionStorage.getItem('examData')
  const participantStored = sessionStorage.getItem('participantData')
  
  if (!stored || !participantStored) {
    router.push('/')
    return
  }
  
  examData.value = JSON.parse(stored)
  participantData.value = JSON.parse(participantStored)

  const distId = route.params.distributionId
  const allDists = examData.value.distributions || []
  currentDist.value = allDists.find(d => d.id === distId)

  if (!currentDist.value) {
    alert('Distribusi tidak ditemukan')
    router.push('/')
    return
  }

  try {
    const res = await api.get(`/exam/questions/${distId}`)
    questions.value = res.data.questions

    const savedAnswers = localStorage.getItem(`answers:${distId}`)
    if (savedAnswers) {
      localAnswers.value = JSON.parse(savedAnswers)
      saveStatus.value = '📂 Jawaban dimuat dari lokal'
    }

    const redisRes = await api.get(`/exam/autosave/${distId}`)
    if (redisRes.data.answers) {
      localAnswers.value = redisRes.data.answers
      saveStatus.value = '☁️ Jawaban dimuat dari server'
    }
  } catch (err) {
    console.error(err)
    alert('Gagal memuat soal')
  } finally {
    loading.value = false
  }

  autosaveInterval = setInterval(saveToServer, 120000)
})

onBeforeUnmount(() => {
  clearInterval(autosaveInterval)
  saveToLocalStorage()
  saveToServer()
})

watch(localAnswers, () => {
  saveToLocalStorage()
}, { deep: true })

// ========== HELPERS ==========
function getTypeLabel(type) {
  const labels = {
    single: 'Pilihan Ganda',
    multiple: 'Pilihan Ganda Kompleks',
    truefalse: 'Benar/Salah',
    short: 'Isian Singkat',
    essay: 'Esai',
    matching: 'Menjodohkan'
  }
  return labels[type] || type
}

function isSelected(key) {
  const ans = localAnswers.value[currentIndex.value]
  if (!ans) return false
  if (Array.isArray(ans)) return ans.includes(key)
  return ans === key
}

// ========== JAWABAN ==========
function onAnswerChange(key, checked) {
  const type = currentQuestion.value.question_type

  if (type === 'multiple') {
    let current = localAnswers.value[currentIndex.value] || []
    if (!Array.isArray(current)) current = current ? [current] : []
    if (checked) {
      current.push(key)
    } else {
      current = current.filter(k => k !== key)
    }
    localAnswers.value[currentIndex.value] = current
  } else if (['single', 'truefalse'].includes(type)) {
    localAnswers.value[currentIndex.value] = key
  } else if (['short', 'essay'].includes(type)) {
    localAnswers.value[currentIndex.value] = key
  }
  
  onSaveLocal()
}

function onSaveLocal() {
  saveStatus.value = '💾 Tersimpan lokal'
  saveStatusClass.value = 'text-green-600'
}

// ========== NAVIGASI ==========
function prevQuestion() {
  if (currentIndex.value > 0) currentIndex.value--
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) currentIndex.value++
}

// ========== SIMPAN ==========
function saveToLocalStorage() {
  const distId = route.params.distributionId
  localStorage.setItem(`answers:${distId}`, JSON.stringify(localAnswers.value))
}

async function saveToServer() {
  if (!participantData.value) return
  const distId = route.params.distributionId
  
  try {
    saveStatus.value = '⏳ Menyimpan ke server...'
    saveStatusClass.value = 'text-yellow-600'
    
    await api.post('/exam/autosave', {
      participant_id: participantData.value.participant_id,
      distribution_id: distId,
      answers: localAnswers.value
    })
    
    saveStatus.value = '☁️ Tersimpan di server'
    saveStatusClass.value = 'text-blue-600'
    
    setTimeout(() => {
      saveStatus.value = '💾 Tersimpan lokal'
      saveStatusClass.value = 'text-green-600'
    }, 2000)
  } catch (err) {
    console.error('Autosave gagal:', err)
  }
}

// ========== SUBMIT ==========
function autoSubmit() {
  alert('Waktu habis! Ujian akan dikumpulkan otomatis.')
  submitExamNow()
}

async function submitExam() {
  if (!confirm('Yakin ingin mengumpulkan jawaban?')) return
  await submitExamNow()
}

async function submitExamNow() {
  submitting.value = true
  
  try {
    await saveToServer()
    
    const distId = route.params.distributionId
    
    const formattedAnswers = Object.entries(localAnswers.value).map(([idx, ans]) => ({
      question_id: questions.value[parseInt(idx)]?.id,
      answer: Array.isArray(ans) ? ans.join(',') : (ans || '')
    })).filter(a => a.question_id)

    const res = await api.post('/exam/submit', {
      participant_id: participantData.value.participant_id,
      distribution_id: distId,
      answers: formattedAnswers
    })

    localStorage.removeItem(`answers:${distId}`)
    
    sessionStorage.setItem('examResult', JSON.stringify({
      ...res.data,
      subject: currentDist.value?.subject_name,
      package: currentDist.value?.package_title
    }))
    
    router.push('/result')
  } catch (err) {
    console.error(err)
    alert('Gagal submit. Jawaban masih tersimpan lokal.')
  } finally {
    submitting.value = false
  }
}
</script>