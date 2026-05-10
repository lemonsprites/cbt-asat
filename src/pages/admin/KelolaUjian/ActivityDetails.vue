<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div v-if="loading" class="text-center text-gray-500">Memuat...</div>
    <div v-else>
      <!-- Info Kegiatan -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold">{{ activity.name }}</h1>
        <p class="text-gray-600">{{ activity.year }}</p>
        <p v-if="activity.description" class="text-gray-500 mt-2">{{ activity.description }}</p>
      </div>

      <!-- Tombol tambah sesi -->
      <div class="mb-4">
        <router-link
          :to="`/teacher/exams/new?activity_id=${activity.id}`"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
        >
          + Tambah Sesi Ujian
        </router-link>
      </div>

      <!-- Sesi dikelompokkan per tanggal -->
      <div v-if="groupedSessions.length === 0" class="text-gray-400 mt-4">
        Belum ada sesi ujian.
      </div>
      <div v-for="group in groupedSessions" :key="group.date" class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700 mb-2 border-b pb-1">
          {{ group.date }}
        </h2>
        <div
          v-for="exam in group.exams"
          :key="exam.id"
          class="bg-white p-4 rounded shadow mb-2 flex justify-between items-center"
        >
          <div>
            <h3 class="font-bold text-lg">{{ exam.title }}</h3>
            <p class="text-sm text-gray-600">
              {{ formatTime(exam.start_time, 'HH:mm') }} - {{ formatTime(exam.end_time, 'HH:mm') }}
            </p>
            <span class="text-xs px-2 py-0.5 rounded-full" :class="statusClass(exam.status)">
              {{ exam.status }}
            </span>
          </div>
          <div class="flex gap-2">
            <router-link :to="`/teacher/exams/${exam.id}`" class="text-blue-600 hover:underline">
              Kelola
            </router-link>
            <router-link :to="`/teacher/results/${exam.id}`" class="text-blue-600 hover:underline">
              Hasil
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/axios'
import dayjs from 'dayjs'
import 'dayjs/locale/id' // jika mau pakai bahasa Indonesia
import { formatTime } from '@/utils/time'

dayjs.locale('id')

const route = useRoute()
const activityId = route.params.activityId
const activity = ref({})
const exams = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [activityRes, examsRes] = await Promise.all([
      api.get(`/activities/${activityId}`),
      api.get(`/exams?activity_id=${activityId}`)
    ])
    activity.value = activityRes.data
    exams.value = examsRes.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

// Grouping exams by date (YYYY-MM-DD) and format to human readable
const groupedSessions = computed(() => {
  const groups = {}
  for (const exam of exams.value) {
    const dateKey = dayjs(exam.start_time).format('YYYY-MM-DD')
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: dayjs(exam.start_time).format('dddd, D MMMM YYYY'),
        exams: []
      }
    }
    groups[dateKey].exams.push(exam)
  }
  // sort by date key
  return Object.keys(groups)
    .sort()
    .map(key => groups[key])
})

function statusClass(status) {
  switch (status) {
    case 'scheduled': return 'bg-yellow-100 text-yellow-800'
    case 'ongoing': return 'bg-green-100 text-green-800'
    case 'finished': return 'bg-gray-100 text-gray-800'
    default: return ''
  }
}
</script>