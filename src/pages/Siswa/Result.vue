<template>
  <div class="p-6 max-w-lg mx-auto text-center">
    <h1 class="text-3xl font-bold mb-4">✅ Ujian Selesai!</h1>
    <div class="bg-white p-6 rounded shadow">
      <p class="text-lg mb-2">Skor Kamu:</p>
      <p class="text-4xl font-bold text-blue-600">{{ result?.total_score || 0 }}</p>
      <p class="text-gray-600 mt-2">
        {{ result?.correct_count }} / {{ result?.total_questions }} soal benar
      </p>
    </div>
    <router-link to="/" class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
      Kembali ke Dashboard
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const result = ref(null)

onMounted(() => {
  const stored = sessionStorage.getItem('examResult')
  if (!stored) {
    router.push('/')
    return
  }
  result.value = JSON.parse(stored)
})
</script>