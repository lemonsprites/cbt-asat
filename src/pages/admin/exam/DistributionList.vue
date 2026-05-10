<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Distribusi Ujian</h1>

    <div class="flex gap-4">
      <!-- ======== PANEL KIRI: Daftar Paket Soal ======== -->
      <div class="w-72 bg-white rounded shadow p-4 flex flex-col" style="max-height: calc(100vh - 120px)">
        <div class="flex justify-between items-center mb-2">
          <h2 class="font-semibold">Paket Soal</h2>
        </div>

        <div class="text-sm text-gray-500 mb-2">
          🖱️ Drag paket ke sesi di kanan
        </div>

        <!-- Filter Mapel -->
        <select v-model="filterSubject" class="w-full border px-2 py-1 rounded mb-2 text-sm">
          <option value="">Semua Mapel</option>
          <option v-for="s in subjects" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>

        <div class="flex-1 overflow-y-auto">
          <div
            v-for="pkg in filteredPackages"
            :key="pkg.id"
            class="bg-blue-50 border border-blue-200 p-2 rounded mb-2 cursor-grab hover:bg-blue-100 text-sm"
            draggable="true"
            @dragstart="onPackageDragStart($event, pkg)"
          >
            <div class="font-medium">{{ pkg.title }}</div>
            <div class="text-xs text-gray-600">
              📚 {{ pkg.subject_name }} · {{ pkg.total_question || 0 }} soal
            </div>
          </div>
          <div v-if="filteredPackages.length === 0" class="text-gray-400 text-sm text-center">
            Semua paket sudah terdistribusi
          </div>
        </div>
      </div>

      <!-- ======== PANEL KANAN: Grid Jadwal / Sesi ======== -->
      <div class="flex-1">
        <div v-for="schedule in schedules" :key="schedule.id" class="mb-6">
          <h3 class="font-bold text-lg mb-2">
            📅 {{ schedule.title }} - {{ formatDate(schedule.exam_date) }}
          </h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              v-for="session in getSessions(schedule.id)"
              :key="session.id"
              class="border-2 border-dashed border-gray-300 rounded p-4 min-h-[150px] bg-gray-50 transition-colors"
              @dragover.prevent="onDragOver($event, session.id)"
              @dragleave="onDragLeave"
              @drop="onDrop($event, session)"
              :class="{
                'border-blue-400 bg-blue-50': dropTarget === session.id
              }"
            >
              <!-- Header Sesi + Token -->
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h4 class="font-semibold text-sm">{{ session.name }}</h4>
                  <p class="text-xs text-gray-500">
                    🕐 {{ session.start_time?.slice(0,5) }} - {{ session.end_time?.slice(0,5) }}
                  </p>
                </div>
                <div class="text-right">
                  <div v-if="session.token" class="bg-blue-100 rounded px-2 py-1">
                    <p class="text-xs text-gray-500">Token</p>
                    <p class="font-mono font-bold text-blue-700 text-sm">{{ session.token }}</p>
                  </div>
                  <button 
                    v-if="!session.token"
                    @click="generateToken(session.id)" 
                    class="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    Generate Token
                  </button>
                  <button 
                    v-if="session.token"
                    @click="regenerateToken(session.id)" 
                    class="text-xs text-blue-600 hover:underline mt-1"
                  >
                    🔄 Regenerate
                  </button>
                </div>
              </div>

              <!-- Tombol Hapus Semua -->
              <div class="flex justify-between items-center mb-2">
                <p class="text-xs text-gray-400">
                  {{ getPackagesInSession(session.id).length }} paket · 
                  {{ getTotalClassesInSession(session.id) }} kelas
                </p>
                <button
                  v-if="getPackagesInSession(session.id).length > 0"
                  @click="clearSessionDistributions(session.id)"
                  class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                >
                  🗑️ Hapus Semua
                </button>
              </div>

              <!-- Paket yang sudah di-assign -->
              <div class="space-y-3">
                <div
                  v-for="pkg in getPackagesInSession(session.id)"
                  :key="pkg.package_id"
                  class="bg-white border rounded p-3 text-sm"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <div class="font-semibold">📦 {{ pkg.package_title }}</div>
                      <div class="text-xs text-gray-600">📚 {{ pkg.subject_name }}</div>
                    </div>
                    <button @click="removePackageDistribution(pkg.package_id, session.id)" class="text-red-500 hover:text-red-700 text-xs">🗑️</button>
                  </div>

                  <!-- Kelas -->
                  <div class="text-xs text-gray-500 mb-1">🏫 Kelas:</div>
                  <div class="flex flex-wrap gap-1 mb-2">
                    <span
                      v-for="cls in getClassesByPackage(session.id, pkg.package_id)"
                      :key="cls.distId"
                      class="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs flex items-center gap-1"
                    >
                      {{ cls.class_name }}
                      <button @click="removeDistribution(cls.distId)" class="text-red-500 hover:text-red-700">×</button>
                    </span>
                    <span v-if="getClassesByPackage(session.id, pkg.package_id).length === 0" class="text-gray-400 italic">
                      Belum ada kelas
                    </span>
                  </div>

                  <!-- Tambah Kelas -->
                  <button
                    @click="openAddClassModal(session, pkg)"
                    class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 w-full"
                  >
                    + Tambah Kelas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======== MODAL TAMBAH KELAS ======== -->
    <div v-if="showAddClassModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 class="text-xl font-bold mb-4">➕ Tambah Kelas ke Paket</h2>
        <p class="text-sm text-gray-600 mb-2">
          📦 {{ selectedPackage?.package_title || selectedPackage?.title }} 
          ({{ selectedPackage?.subject_name }})
        </p>
        <p class="text-sm text-gray-600 mb-4">
          🕐 Sesi: {{ selectedSession?.name }}
        </p>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm mb-1 font-semibold">
            Pilih Kelas ({{ availableClassesForPackage.length }} tersedia)
          </label>
          <div class="max-h-48 overflow-y-auto border rounded p-2">
            <div v-for="cls in availableClassesForPackage" :key="cls.id" class="flex items-center gap-2 p-1 hover:bg-gray-50">
              <input type="checkbox" :checked="selectedClassesToAdd.has(cls.id)" @change="toggleClassToAdd(cls.id)" class="cursor-pointer" />
              <span class="text-sm">{{ cls.name }} ({{ cls.level }} {{ cls.major }})</span>
            </div>
          </div>
          <div class="flex gap-2 mt-2">
            <button @click="selectAllClasses" class="text-xs text-blue-600 hover:underline">Select All</button>
            <button @click="selectedClassesToAdd.clear()" class="text-xs text-red-600 hover:underline">Clear</button>
          </div>
        </div>

        <div class="flex gap-2 justify-end">
          <button @click="showAddClassModal = false" class="border px-4 py-2 rounded hover:bg-gray-100">Batal</button>
          <button @click="addClassesToPackage" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Tambah {{ selectedClassesToAdd.size }} Kelas
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api/axios'
import dayjs from 'dayjs'

// ========== DATA ==========
const schedules = ref([])
const sessions = ref([])
const classes = ref([])
const subjects = ref([])
const packages = ref([])
const distributions = ref([])

// ========== FILTER ==========
const filterSubject = ref('')

// ========== DRAG ==========
const draggedPackage = ref(null)
const dropTarget = ref(null)

// ========== MODAL ==========
const showAddClassModal = ref(false)
const selectedSession = ref(null)
const selectedPackage = ref(null)
const selectedClassesToAdd = ref(new Set())

// ========== COMPUTED ==========
const filteredPackages = computed(() => {
  if (filterSubject.value) {
    return packages.value.filter(p => p.subject_id === filterSubject.value)
  }
  return packages.value
})

const availableClassesForPackage = computed(() => {
  if (!selectedSession.value || !selectedPackage.value) return []
  const sessionId = selectedSession.value.id
  const packageId = selectedPackage.value.package_id || selectedPackage.value.id
  const usedClassIds = new Set(
    distributions.value
      .filter(d => d.session_id === sessionId && d.package_id === packageId)
      .map(d => d.class_id)
  )
  return classes.value.filter(c => !usedClassIds.has(c.id))
})

// ========== MOUNTED ==========
onMounted(async () => {
  try {
    const [scheduleRes, sessionRes, classRes, subjRes, pkgRes, distRes] = await Promise.all([
      api.get('/schedules'),
      api.get('/sessions'),
      api.get('/classes'),
      api.get('/subjects'),
      api.get('/packages'),
      api.get('/distributions')
    ])
    schedules.value = scheduleRes.data
    sessions.value = sessionRes.data
    classes.value = classRes.data
    subjects.value = subjRes.data
    packages.value = pkgRes.data
    distributions.value = distRes.data
  } catch (err) {
    console.error('Gagal memuat data:', err)
  }
})

// ========== HELPERS ==========
function getSessions(scheduleId) {
  return sessions.value.filter(s => s.schedule_id === scheduleId)
}

function getPackagesInSession(sessionId) {
  const dists = distributions.value.filter(d => d.session_id === sessionId)
  const grouped = {}
  for (const d of dists) {
    const key = d.package_id
    if (!grouped[key]) {
      grouped[key] = {
        package_id: d.package_id,
        package_title: d.package_title,
        subject_name: d.subject_name,
        subject_id: d.subject_id,
        classes: []
      }
    }
    if (d.class_id && d.class_name && d.class_name !== '-') {
      const exists = grouped[key].classes.find(c => c.distId === d.id)
      if (!exists) {
        grouped[key].classes.push({
          distId: d.id,
          class_id: d.class_id,
          class_name: d.class_name,
          token: d.token,
          is_active: d.is_active
        })
      }
    }
  }
  return Object.values(grouped)
}

function getClassesByPackage(sessionId, packageId) {
  return distributions.value
    .filter(d => d.session_id === sessionId && d.package_id === packageId)
    .filter(d => d.class_id)
    .map(d => ({
      distId: d.id,
      class_name: d.class_name,
      token: d.token,
      is_active: d.is_active
    }))
}

function getTotalClassesInSession(sessionId) {
  const classIds = new Set(
    distributions.value
      .filter(d => d.session_id === sessionId && d.class_id)
      .map(d => d.class_id)
  )
  return classIds.size
}

function formatDate(date) {
  return dayjs(date).format('DD MMMM YYYY')
}

async function refreshDistributions() {
  const res = await api.get('/distributions')
  distributions.value = res.data
}

async function refreshSessions() {
  const res = await api.get('/sessions')
  sessions.value = res.data
}

// ========== TOKEN ==========
async function generateToken(sessionId) {
  try {
    await api.put(`/sessions/${sessionId}/regenerate-token`)
    await refreshSessions()
  } catch (err) {
    console.error(err)
    alert('Gagal generate token')
  }
}

async function regenerateToken(sessionId) {
  if (!confirm('Regenerate token? Token lama tidak akan berlaku.')) return
  await generateToken(sessionId)
}

// ========== DRAG ==========
function onPackageDragStart(event, pkg) {
  draggedPackage.value = pkg
  event.dataTransfer.effectAllowed = 'move'
}

function onDragOver(event, sessionId) {
  event.preventDefault()
  dropTarget.value = sessionId
}

function onDragLeave() {
  dropTarget.value = null
}

async function onDrop(event, session) {
  const pkg = draggedPackage.value
  if (!pkg) return

  try {
    await api.post('/distributions', {
      session_id: session.id,
      class_id: null,
      subject_id: pkg.subject_id,
      package_id: pkg.id,
      is_active: true
    })
    draggedPackage.value = null
    dropTarget.value = null
    await refreshDistributions()
  } catch (err) {
    console.error(err)
    alert('Gagal menambahkan paket ke sesi')
  }
}

// ========== MODAL KELAS ==========
function openAddClassModal(session, pkg) {
  selectedSession.value = session
  selectedPackage.value = pkg
  selectedClassesToAdd.value = new Set()
  showAddClassModal.value = true
}

function toggleClassToAdd(classId) {
  const newSet = new Set(selectedClassesToAdd.value)
  if (newSet.has(classId)) newSet.delete(classId)
  else newSet.add(classId)
  selectedClassesToAdd.value = newSet
}

function selectAllClasses() {
  selectedClassesToAdd.value = new Set(availableClassesForPackage.value.map(c => c.id))
}

async function addClassesToPackage() {
  if (selectedClassesToAdd.value.size === 0) {
    alert('Pilih minimal 1 kelas')
    return
  }

  try {
    const promises = []
    for (const classId of selectedClassesToAdd.value) {
      promises.push(
        api.post('/distributions', {
          session_id: selectedSession.value.id,
          class_id: classId,
          subject_id: selectedPackage.value.subject_id || selectedPackage.value.subject_id,
          package_id: selectedPackage.value.package_id || selectedPackage.value.id,
          is_active: true
        })
      )
    }
    await Promise.all(promises)
    showAddClassModal.value = false
    await refreshDistributions()
    alert(`✅ ${promises.length} kelas ditambahkan`)
  } catch (err) {
    console.error(err)
    alert('Gagal menambahkan kelas')
  }
}

// ========== HAPUS ==========
async function removeDistribution(distId) {
  if (!confirm('Hapus kelas ini?')) return
  try {
    await api.delete(`/distributions/${distId}`)
    await refreshDistributions()
  } catch (err) { console.error(err) }
}

async function removePackageDistribution(packageId, sessionId) {
  const dists = distributions.value.filter(d => d.package_id === packageId && d.session_id === sessionId)
  if (dists.length === 0) return
  if (!confirm(`Hapus paket ini beserta ${dists.length} kelasnya?`)) return
  try {
    const promises = dists.map(d => api.delete(`/distributions/${d.id}`))
    await Promise.all(promises)
    await refreshDistributions()
  } catch (err) { console.error(err) }
}

async function clearSessionDistributions(sessionId) {
  const dists = distributions.value.filter(d => d.session_id === sessionId)
  if (dists.length === 0) return
  if (!confirm(`⚠️ Hapus SEMUA ${dists.length} distribusi di sesi ini?`)) return
  try {
    await api.delete(`/distributions/session/${sessionId}`)
    await refreshDistributions()
  } catch (err) { console.error(err) }
}
</script>