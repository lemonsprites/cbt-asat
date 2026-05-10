<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-2">📝 Pilih Mata Ujian</h1>
    <p class="text-gray-600 mb-6">
      Sesi: {{ examData?.session?.name }} · 
      {{ examData?.session?.schedule }} · 
      {{ examData?.session?.date }}
    </p>

    <div class="space-y-3">
      <div 
        v-for="dist in examData?.distributions" 
        :key="dist.id"
        @click="startExam(dist)"
        class="bg-white border-2 border-gray-200 rounded-lg p-5 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all"
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-semibold">{{ dist.subject_name }}</h3>
            <p class="text-sm text-gray-600">{{ dist.package_title }}</p>
            <p class="text-xs text-gray-500">{{ dist.total_question }} soal · {{ dist.duration }} menit</p>
          </div>
          <div class="text-2xl">➡️</div>
        </div>
      </div>
    </div>

    <button 
      @click="goBack" 
      class="mt-6 text-blue-600 hover:underline"
    >
      ← Kembali ke Dashboard
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const router = useRouter()
const examData = ref(null)

onMounted(() => {
  const stored = sessionStorage.getItem('examData')
  if (!stored) {
    router.push('/')
    return
  }
  examData.value = JSON.parse(stored)
})

async function startExam(dist) {
  try {
    // Mulai ujian (create participant)
    const startRes = await api.post(`/exam/start/${dist.id}`)
    sessionStorage.setItem('participantData', JSON.stringify(startRes.data))
    
    router.push(`/exam/${dist.id}`)
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal memulai ujian')
  }
}

function goBack() {
  sessionStorage.removeItem('examData')
  router.push('/')
}
</script>