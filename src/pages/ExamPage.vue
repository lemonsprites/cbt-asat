<template>
  <div class="min-h-screen bg-gray-50">
    <div class="p-4 bg-white shadow flex justify-between items-center">
      <h1 class="text-xl font-bold truncate">{{ exam?.title }}</h1>
      <TimerBar :end-time="exam?.end_time" @time-up="autoSubmit" />
    </div>
    
    <div v-if="loading" class="text-center py-20">Memuat soal...</div>
    <div v-else class="max-w-3xl mx-auto p-4">
      <!-- Navigasi soal -->
      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="(q, idx) in questions"
          :key="idx"
          @click="currentIndex = idx"
          :class="[
            'w-10 h-10 rounded-full text-sm font-medium',
            currentIndex === idx ? 'bg-blue-600 text-white' : 
            answers[idx] !== undefined ? 'bg-green-100 border border-green-500' : 'bg-gray-200'
          ]"
        >
          {{ idx + 1 }}
        </button>
      </div>
      
      <!-- Soal aktif -->
      <QuestionCard
        v-if="currentQuestion"
        :question="currentQuestion"
        :answer="answers[currentIndex]"
        @update:answer="val => updateAnswer(currentIndex, val)"
      />
      
      <div class="flex justify-between mt-8">
        <button @click="prev" :disabled="currentIndex === 0" class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Sebelumnya</button>
        <button v-if="currentIndex < questions.length - 1" @click="next" class="px-4 py-2 bg-blue-600 text-white rounded">Selanjutnya</button>
        <button v-else @click="handleSubmitExam" class="px-6 py-2 bg-red-600 text-white rounded">Kumpulkan</button>
      </div>
    </div>
    
    <AntiCheatModal v-if="cheatWarning" :message="cheatMessage" @close="cheatWarning = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getExamQuestions, autosaveAnswer, submitExam, logEvent } from '@/api/exam'
import { useAntiCheat } from '@/utils/antiCheat'
import TimerBar from '@/components/exam/TimerBar.vue'
import QuestionCard from '@/components/exam/QuestionCard.vue'
import AntiCheatModal from '@/components/exam/AntiCheatModal.vue'

const route = useRoute()
const router = useRouter()
const examId = route.params.examId

const exam = ref(null)
const questions = ref([])
const answers = ref({})
const currentIndex = ref(0)
const loading = ref(true)
const cheatWarning = ref(false)
const cheatMessage = ref('')

const currentQuestion = computed(() => questions.value[currentIndex.value] || null)

let autosaveInterval = null

onMounted(async () => {
  try {
    const data = await getExamQuestions(examId)
    exam.value = data.exam
    questions.value = data.questions
    if (data.savedAnswers) {
      answers.value = data.savedAnswers
    }
  } finally {
    loading.value = false
  }

  autosaveInterval = setInterval(() => {
    autosaveAnswer(examId, answers.value).catch(() => {})
  }, 15000)

  const { cleanup } = useAntiCheat({
    onTabHidden: () => {
      logEvent(examId, 'tab_hidden')
      showCheatWarning('Peringatan! Anda meninggalkan halaman ujian. Kejadian ini dicatat.')
    },
    onFullscreenExit: () => {
      logEvent(examId, 'fullscreen_exit')
      showCheatWarning('Fullscreen dinonaktifkan. Harap kembali ke mode fullscreen.')
    }
  })

  onBeforeUnmount(() => {
    clearInterval(autosaveInterval)
    cleanup()
  })
})

function updateAnswer(qIndex, answer) {
  answers.value[qIndex] = answer
}

function showCheatWarning(msg) {
  cheatMessage.value = msg
  cheatWarning.value = true
}

function prev() { if (currentIndex.value > 0) currentIndex.value-- }
function next() { if (currentIndex.value < questions.value.length - 1) currentIndex.value++ }

async function submitExamNow() {
  try {
    const result = await submitExam(examId, answers.value)  // ini panggil API submitExam
    router.push(`/result/${result.id}`)
  } catch {
    alert('Gagal submit, coba lagi')
  }
}

function autoSubmit() {
  alert('Waktu habis! Ujian akan dikumpulkan otomatis.')
  submitExamNow()
}


async function handleSubmitExam() {
  if (confirm('Yakin ingin mengumpulkan? Jawaban akan dikumpulkan.')) {
    await submitExamNow()
  }
}
</script>