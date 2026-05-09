<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">Dashboard</h1>
    <p class="text-gray-600 mb-6">Selamat datang, {{ auth.user?.name }}</p>
    
    <h2 class="text-xl font-semibold mb-4">Ujian Tersedia</h2>
    <div v-if="loading" class="text-gray-500">Memuat...</div>
    <div v-else-if="exams.length === 0" class="text-gray-400">Tidak ada ujian saat ini.</div>
    <div v-for="exam in exams" :key="exam.id" class="bg-white rounded shadow p-4 mb-3 flex justify-between items-center">
      <div>
        <h3 class="font-bold text-lg">{{ exam.title }}</h3>
        <p class="text-sm text-gray-500">
          {{ formatDate(exam.start_time) }} - {{ formatDate(exam.end_time) }}
        </p>
      </div>
      <button @click="enterExam(exam)" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Mulai
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getStudentExams } from '@/api/exam'
import dayjs from 'dayjs'

const auth = useAuthStore()
const router = useRouter()
const exams = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    exams.value = await getStudentExams()
  } finally {
    loading.value = false
  }
})

function enterExam(exam) {
  router.push(`/exam/${exam.id}`)
}

function formatDate(ts) {
  return dayjs(ts).format('DD/MM HH:mm')
}
</script>