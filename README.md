# 🎓 CBT Online - Frontend

Platform Computer Based Test (CBT) Online berbasis web untuk pelaksanaan ujian digital di sekolah.

## 🚀 Teknologi

| Teknologi | Keterangan |
|-----------|------------|
| **Vue 3** | Framework JavaScript progresif |
| **Vite** | Build tool modern & cepat |
| **Tailwind CSS** | Utility-first CSS framework |
| **Pinia** | State management Vue 3 |
| **Vue Router** | Routing SPA |
| **Axios** | HTTP client |
| **Day.js** | Library manipulasi tanggal |

---

## 📁 Struktur Folder

```
cbt-asat/
├── public/                    # Static files
├── src/
│   ├── api/                   # Axios instance & API calls
│   │   ├── axios.js           # Axios config + interceptor
│   │   ├── auth.js            # Auth API (login, logout, me)
│   │   └── exam.js            # Exam API (soal, submit, autosave)
│   │
│   ├── components/            # Komponen reusable
│   │   └── exam/              # Komponen ujian
│   │       ├── TimerBar.vue   # Timer countdown
│   │       ├── QuestionCard.vue # Kartu soal
│   │       └── AntiCheatModal.vue # Modal peringatan
│   │
│   ├── layouts/               # Layout halaman
│   │   ├── DefaultLayout.vue  # Layout siswa (navbar + content)
│   │   └── AdminLayout.vue    # Layout admin (sidebar + content)
│   │
│   ├── pages/                 # Halaman
│   │   ├── LoginPage.vue      # Halaman login
│   │   ├── Siswa/             # Halaman siswa
│   │   │   ├── StudentDashboard.vue  # Dashboard + input token
│   │   │   ├── ExamSelect.vue # Pilih mata ujian
│   │   │   ├── Exam.vue       # Halaman ujian
│   │   │   └── Result.vue     # Hasil ujian
│   │   │
│   │   └── admin/             # Halaman admin
│   │       ├── Dashboard.vue  # Dashboard admin
│   │       ├── subjects/      # Manajemen mapel
│   │       ├── classes/       # Manajemen kelas
│   │       ├── users/         # Manajemen user
│   │       ├── bank/          # Bank soal
│   │       │   ├── PackageList.vue    # Daftar paket soal
│   │       │   └── QuestionList.vue   # Daftar soal
│   │       ├── exam/          # Manajemen ujian
│   │       │   ├── ScheduleList.vue   # Jadwal ujian
│   │       │   ├── SessionList.vue    # Sesi ujian
│   │       │   ├── DistributionList.vue # Distribusi ujian
│   │       │   └── TokenList.vue      # Daftar token
│   │       └── result/        # Hasil ujian
│   │
│   ├── router/                # Vue Router
│   │   └── index.js           # Konfigurasi routing
│   │
│   ├── stores/                # Pinia stores
│   │   └── auth.js            # Auth store (token, user)
│   │
│   ├── utils/                 # Utility functions
│   │   └── antiCheat.js       # Anti-cheat utilities
│   │
│   ├── App.vue                # Root component
│   ├── main.js                # Entry point
│   └── style.css              # Global styles
│
├── .env                       # Environment variables
├── vite.config.js             # Vite config
├── tailwind.config.js         # Tailwind config
├── jsconfig.json              # Path alias config
└── package.json               # Dependencies
```

---

## 🔧 Instalasi

### 1. Clone repository
```bash
git clone <repo-url>
cd cbt-asat
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment
Buat file `.env` di root folder:
```env
VITE_API_URL=http://localhost:3000
```

### 4. Jalankan development server
```bash
npm run dev
```

Buka browser di `http://localhost:5173`

### 5. Build untuk production
```bash
npm run build
```

File production ada di folder `dist/`

---

## 🔑 Fitur

### 👨‍🎓 Halaman Siswa

| Fitur | Deskripsi |
|-------|-----------|
| **Dashboard** | Kartu sambutan, info akun, ketentuan ujian |
| **Input Token** | Masukkan token untuk masuk ujian |
| **Pilih Mapel** | Pilih mata ujian jika sesi memiliki banyak mapel |
| **Halaman Ujian** | Timer, navigasi soal, 6 tipe soal, autosave |
| **Hasil Ujian** | Skor langsung setelah submit |

### 👩‍🏫 Halaman Admin

| Modul | Deskripsi |
|-------|-----------|
| **Dashboard** | Overview data |
| **Mapel** | CRUD mata pelajaran |
| **Kelas** | CRUD kelas + jurusan |
| **Users** | Manajemen user (admin, guru, siswa) |
| **Paket Soal** | CRUD paket soal per mapel |
| **Soal** | CRUD soal + opsi, import CSV |
| **Jadwal** | CRUD jadwal ujian |
| **Sesi** | CRUD sesi + generate token |
| **Distribusi** | Drag & drop mapping paket ke kelas |
| **Token** | Export token per jadwal/sesi |

---

## 🎯 Tipe Soal Didukung

| Tipe | Keterangan |
|------|------------|
| **Pilihan Ganda** | Satu jawaban benar |
| **Pilihan Ganda Kompleks** | Lebih dari satu jawaban benar |
| **Benar/Salah** | True/False |
| **Menjodohkan** | Matching pairs |
| **Isian Singkat** | Short answer |
| **Esai** | Uraian panjang |

---

## 📝 Script Development

```bash
# Jalankan dev server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

---

## 🌐 Deploy

### Cloudflare Pages
1. Build: `npm run build`
2. Output directory: `dist/`
3. Environment variable: `VITE_API_URL`

### Vercel / Netlify
1. Framework preset: Vite
2. Build command: `npm run build`
3. Output directory: `dist`

---

## 📄 Lisensi

Internal - Hanya untuk keperluan sekolah
