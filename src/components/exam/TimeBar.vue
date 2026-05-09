<template>
  <div class="text-lg font-mono font-bold" :class="timerColor">
    {{ formattedTime }}
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

const props = defineProps({
  endTime: String   // ISO timestamp
})
const emit = defineEmits(['time-up'])

const now = ref(dayjs())
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    now.value = dayjs()
    if (now.value.isAfter(dayjs(props.endTime))) {
      emit('time-up')
      clearInterval(interval)
    }
  }, 1000)
})

onBeforeUnmount(() => clearInterval(interval))

const remaining = computed(() => {
  const diff = dayjs(props.endTime).diff(now.value)
  return diff > 0 ? dayjs.duration(diff) : dayjs.duration(0)
})

const formattedTime = computed(() => {
  const r = remaining.value
  return `${String(r.hours()).padStart(2, '0')}:${String(r.minutes()).padStart(2, '0')}:${String(r.seconds()).padStart(2, '0')}`
})

const timerColor = computed(() => {
  if (remaining.value.asMinutes() < 5) return 'text-red-600'
  if (remaining.value.asMinutes() < 15) return 'text-yellow-600'
  return 'text-gray-800'
})
</script>