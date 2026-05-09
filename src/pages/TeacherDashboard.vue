<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold">Dashboard Pengajar</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <router-link to="/teacher/exams" class="p-6 bg-white rounded shadow hover:shadow-lg">
        <h2 class="text-xl font-semibold">Manajemen Ujian</h2>
        <p class="text-gray-500">Buat dan atur ujian, soal, dan jadwal.</p>
      </router-link>
      <router-link to="/teacher/results" class="p-6 bg-white rounded shadow hover:shadow-lg">
        <h2 class="text-xl font-semibold">Hasil Ujian</h2>
        <p class="text-gray-500">Lihat nilai per siswa atau kelas.</p>
      </router-link>
    </div>
  </div>
</template>