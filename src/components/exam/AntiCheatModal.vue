<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded shadow-lg max-w-sm">
      <h3 class="text-xl font-bold text-red-600 mb-2">Peringatan!</h3>
      <p class="mb-4">{{ message }}</p>
      <button @click="$emit('close')" class="px-4 py-2 bg-blue-600 text-white rounded">Mengerti</button>
    </div>
  </div>
</template>

<script setup>
defineProps({ message: String })
defineEmits(['close'])
</script>