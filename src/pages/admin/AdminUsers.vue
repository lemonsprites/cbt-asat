<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">
          Manajemen Pengguna
        </h1>

        <p class="text-gray-500 mt-1">
          Kelola data admin, pengajar, dan siswa.
        </p>
      </div>

      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow transition"
      >
        + Tambah User
      </button>
    </div>

    <!-- Filter -->
    <div class="bg-white rounded-xl shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Cari User
          </label>

          <input
            type="text"
            placeholder="Nama atau email..."
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <!-- Role -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">
            Role
          </label>

          <select
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="teacher">Pengajar</option>
            <option value="student">Siswa</option>
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
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-6 py-4 font-semibold">Nama</th>
              <th class="px-6 py-4 font-semibold">Email</th>
              <th class="px-6 py-4 font-semibold">Role</th>
              <th class="px-6 py-4 font-semibold">Status</th>
              <th class="px-6 py-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <!-- User 1 -->
            <tr class="border-t hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-800">
                  Admin Utama
                </div>
              </td>

              <td class="px-6 py-4 text-gray-600">
                admin@example.com
              </td>

              <td class="px-6 py-4">
                <span
                  class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  Admin
                </span>
              </td>

              <td class="px-6 py-4">
                <span
                  class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                >
                  Aktif
                </span>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Edit
                  </button>

                  <button
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>

            <!-- User 2 -->
            <tr class="border-t hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-800">
                  Budi Santoso
                </div>
              </td>

              <td class="px-6 py-4 text-gray-600">
                budi@example.com
              </td>

              <td class="px-6 py-4">
                <span
                  class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  Pengajar
                </span>
              </td>

              <td class="px-6 py-4">
                <span
                  class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                >
                  Aktif
                </span>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Edit
                  </button>

                  <button
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>

            <!-- User 3 -->
            <tr class="border-t hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-800">
                  Siti Nurhaliza
                </div>
              </td>

              <td class="px-6 py-4 text-gray-600">
                siti@example.com
              </td>

              <td class="px-6 py-4">
                <span
                  class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                >
                  Siswa
                </span>
              </td>

              <td class="px-6 py-4">
                <span
                  class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  Nonaktif
                </span>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-2">
                  <button
                    class="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Edit
                  </button>

                  <button
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-6">
      <p class="text-sm text-gray-500">
        Menampilkan 1 - 3 dari 20 pengguna
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