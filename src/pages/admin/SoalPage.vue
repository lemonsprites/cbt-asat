<template>
  <div class="p-6">
    <!-- HEADER -->
    <div
      class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
    >
      <div>
        <h1 class="text-3xl font-bold text-gray-800">
          Manajemen Paket Soal
        </h1>

        <p class="text-gray-500 mt-1">
          Kelola paket soal, mapping ke sesi ujian, dan kelas.
        </p>
      </div>

      <div class="flex gap-3">
        <button
          class="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow transition"
        >
          + Mapping Soal
        </button>

        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow transition"
        >
          + Buat Paket
        </button>
      </div>
    </div>

    <!-- SUBMENU -->
    <div class="bg-white rounded-xl shadow mb-6">
      <div class="flex flex-wrap border-b">
        <button
          class="px-6 py-4 font-medium border-b-2 border-blue-600 text-blue-600"
        >
          Paket Soal
        </button>

        <button
          class="px-6 py-4 font-medium text-gray-600 hover:text-blue-600"
        >
          Mapping Sesi
        </button>

        <button
          class="px-6 py-4 font-medium text-gray-600 hover:text-blue-600"
        >
          Mapping Kelas
        </button>

        <button
          class="px-6 py-4 font-medium text-gray-600 hover:text-blue-600"
        >
          Bank Soal
        </button>
      </div>
    </div>

    <!-- FILTER -->
    <div class="bg-white rounded-xl shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Cari Paket
          </label>

          <input
            type="text"
            placeholder="Nama paket..."
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <!-- Mata Pelajaran -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Mata Pelajaran
          </label>

          <select
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Semua</option>
            <option>Matematika</option>
            <option>Bahasa Indonesia</option>
            <option>IPA</option>
          </select>
        </div>

        <!-- Kelas -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Kelas
          </label>

          <select
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Semua</option>
            <option>X IPA 1</option>
            <option>X IPA 2</option>
            <option>XI IPS 1</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Status
          </label>

          <select
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Semua</option>
            <option>Aktif</option>
            <option>Draft</option>
          </select>
        </div>
      </div>
    </div>

    <!-- LIST PAKET SOAL -->
    <div class="space-y-4">
      <!-- CARD -->
      <div
        class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
      >
        <div
          class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6"
        >
          <!-- LEFT -->
          <div class="flex-1">
            <!-- Badge -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                Matematika
              </span>

              <span
                class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
              >
                Aktif
              </span>

              <span
                class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
              >
                40 Soal
              </span>
            </div>

            <!-- Title -->
            <h2 class="text-2xl font-bold text-gray-800">
              Paket Ujian Matematika Semester Genap
            </h2>

            <!-- Description -->
            <p class="text-gray-500 mt-2">
              Paket soal untuk ujian semester genap kelas X.
            </p>

            <!-- Info -->
            <div
              class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            >
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-500">
                  Sesi Ujian
                </p>

                <p class="font-semibold text-gray-800 mt-1">
                  UTS Semester Genap
                </p>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-500">
                  Mapping Kelas
                </p>

                <p class="font-semibold text-gray-800 mt-1">
                  X IPA 1, X IPA 2
                </p>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-500">
                  Dibuat Oleh
                </p>

                <p class="font-semibold text-gray-800 mt-1">
                  Admin Utama
                </p>
              </div>
            </div>
          </div>

          <!-- ACTION -->
          <div class="flex flex-col gap-3 w-full lg:w-auto">
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
            >
              Kelola Soal
            </button>

            <button
              class="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
            >
              Mapping
            </button>

            <button
              class="bg-yellow-400 hover:bg-yellow-500 text-white px-5 py-3 rounded-lg"
            >
              Edit
            </button>

            <button
              class="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>

      <!-- CARD -->
      <div
        class="bg-white rounded-xl shadow p-6 hover:shadow-lg transition"
      >
        <div
          class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6"
        >
          <div class="flex-1">
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
              >
                IPA
              </span>

              <span
                class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
              >
                Draft
              </span>

              <span
                class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                25 Soal
              </span>
            </div>

            <h2 class="text-2xl font-bold text-gray-800">
              Paket IPA Kelas XI
            </h2>

            <p class="text-gray-500 mt-2">
              Digunakan untuk simulasi ujian akhir.
            </p>

            <div
              class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            >
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-500">
                  Sesi Ujian
                </p>

                <p class="font-semibold text-gray-800 mt-1">
                  Simulasi UAS
                </p>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-500">
                  Mapping Kelas
                </p>

                <p class="font-semibold text-gray-800 mt-1">
                  XI IPA 1
                </p>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-sm text-gray-500">
                  Dibuat Oleh
                </p>

                <p class="font-semibold text-gray-800 mt-1">
                  Budi Santoso
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-3 w-full lg:w-auto">
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
            >
              Kelola Soal
            </button>

            <button
              class="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
            >
              Mapping
            </button>

            <button
              class="bg-yellow-400 hover:bg-yellow-500 text-white px-5 py-3 rounded-lg"
            >
              Edit
            </button>

            <button
              class="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- PAGINATION -->
    <div class="flex items-center justify-between mt-8">
      <p class="text-sm text-gray-500">
        Menampilkan 1 - 2 dari 20 paket soal
      </p>

      <div class="flex gap-2">
        <button
          class="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Prev
        </button>

        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          1
        </button>

        <button
          class="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          2
        </button>

        <button
          class="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>