import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diisi di file .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createStudents() {
  console.log('🔍 Mengambil data kelas...')

  // Ambil semua kelas
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id, name, level, major')

  if (classError) {
    console.error('Gagal ambil kelas:', classError.message)
    return
  }

  if (classes.length === 0) {
    console.error('❌ Belum ada kelas. Buat kelas dulu di halaman admin!')
    return
  }

  console.log(`✅ ${classes.length} kelas ditemukan\n`)

  const password = 'siswa123'
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(password, salt)

  const studentsData = [
    { name: 'Ahmad Rizky', username: 'ahmad', classIdx: 0 },
    { name: 'Budi Santoso', username: 'budi', classIdx: 0 },
    { name: 'Citra Dewi', username: 'citra', classIdx: 0 },
    { name: 'Dewi Lestari', username: 'dewi', classIdx: 1 },
    { name: 'Eko Prasetyo', username: 'eko', classIdx: 1 },
    { name: 'Fitri Handayani', username: 'fitri', classIdx: 1 },
    { name: 'Gilang Ramadhan', username: 'gilang', classIdx: 2 },
    { name: 'Hana Safira', username: 'hana', classIdx: 2 },
    { name: 'Irfan Hakim', username: 'irfan', classIdx: 2 },
    { name: 'Joko Widodo', username: 'joko', classIdx: 3 },
    { name: 'Kartika Sari', username: 'kartika', classIdx: 3 },
    { name: 'Lutfi Maulana', username: 'lutfi', classIdx: 3 },
  ]

  let created = 0
  const errors = []

  for (const s of studentsData) {
    const cls = classes[s.classIdx % classes.length]

    if (!cls) {
      errors.push(`Kelas index ${s.classIdx} tidak ditemukan`)
      continue
    }

    try {
      // 1. Insert ke users (dengan class_id)
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: `${s.username}@siswa.id`,
          username: s.username,
          password_hash: hash,
          role: 'student',
          name: s.name,
          class_id: cls.id  // ← langsung assign kelas
        })
        .select()
        .single()

      if (userError) {
        if (userError.code === '23505') {
          errors.push(`${s.name}: username/email sudah ada`)
        } else {
          errors.push(`${s.name}: ${userError.message}`)
        }
        continue
      }

      created++
      console.log(`✅ ${s.name} → ${cls.name} (${s.username} / ${s.username}@siswa.id)`)
    } catch (err) {
      errors.push(`${s.name}: ${err.message}`)
    }
  }

  console.log(`\n📊 Hasil: ${created}/${studentsData.length} siswa berhasil dibuat`)

  if (errors.length > 0) {
    console.log(`\n⚠️ Error:`)
    errors.forEach(e => console.log(`  - ${e}`))
  }

  console.log(`\n🔑 Password default: ${password}`)
  console.log(`📋 Contoh login:`)
  console.log(`   Username: ${studentsData[0].username}`)
  console.log(`   Password: ${password}`)
  console.log(`   Email   : ${studentsData[0].username}@siswa.id`)
}

createStudents()