```vue
<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Content -->
    <main class="max-w-7xl mx-auto p-6">
      <h2 class="text-3xl font-bold text-gray-800">
        Dashboard Admin
      </h2>

      <p class="text-gray-500 mt-2">
        Selamat datang di halaman administrasi sistem ujian.
      </p>

      <!-- Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <!-- Card Users -->
        <div class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-700">
              Total Pengguna
            </h3>

            <div class="bg-blue-100 text-blue-600 p-3 rounded-full">
              👤
            </div>
          </div>

          <p class="text-4xl font-bold mt-4 text-gray-800">
            120
          </p>

          <p class="text-gray-500 mt-2">
            Guru & Siswa terdaftar
          </p>
        </div>

        <!-- Card Exams -->
        <div class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-700">
              Total Ujian
            </h3>

            <div class="bg-green-100 text-green-600 p-3 rounded-full">
              📝
            </div>
          </div>

          <p class="text-4xl font-bold mt-4 text-gray-800">
            35
          </p>

          <p class="text-gray-500 mt-2">
            Ujian aktif & selesai
          </p>
        </div>

        <!-- Card Results -->
        <div class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-700">
              Hasil Ujian
            </h3>

            <div class="bg-purple-100 text-purple-600 p-3 rounded-full">
              📊
            </div>
          </div>

          <p class="text-4xl font-bold mt-4 text-gray-800">
            540
          </p>

          <p class="text-gray-500 mt-2">
            Data hasil tersimpan
          </p>
        </div>
      </div>

    </main>
  </div>
</template>
```
