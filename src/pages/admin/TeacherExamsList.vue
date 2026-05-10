<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-4">Daftar Ujian</h1>
    <div class="mb-6 flex gap-2">
      <router-link to="/teacher/exams/new" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Buat Ujian Baru
      </router-link>
      <router-link to="/teacher" class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
        Kembali ke Dashboard
      </router-link>
    </div>

    <div v-if="loading" class="text-center text-gray-500 mt-4">Memuat ujian...</div>
    <div v-else-if="exams.length === 0" class="text-gray-400 mt-4">Belum ada ujian. Silakan buat baru.</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="exam in exams" :key="exam.id" class="bg-white p-4 rounded shadow">
        <h2 class="text-xl font-semibold">{{ exam.title }}</h2>
        <p class="text-sm text-gray-500">Status: {{ exam.status }}</p>
        <p class="text-sm text-gray-500">Mulai: {{ formatTime(exam.start_time) }}</p>
        <div class="mt-2 flex gap-2">
          <router-link :to="`/teacher/exams/${exam.id}`" class="text-blue-600 hover:underline">Kelola</router-link>
          <span class="text-gray-400">|</span>
          <router-link :to="`/teacher/results/${exam.id}`" class="text-blue-600 hover:underline">Hasil</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import { formatTime } from '@/utils/time'

const exams = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get('/exams')
    exams.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>