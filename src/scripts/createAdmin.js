import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.VITE_SUPABASE_URL       // pastikan nama variabel di .env sesuai
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY  // service_role, bukan anon key

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus diisi di file .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  const plainPassword = 'Admin123!'   // ganti password admin yang diinginkan
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(plainPassword, salt)

  const { data, error } = await supabase
    .from('users')
    .insert({
      email: 'admin@sekolah.id',
      password_hash: hash,
      role: 'admin',
      name: 'Administrator Utama'
    })
    .select()

  if (error) {
    console.error('Gagal insert admin:', error.message)
  } else {
    console.log('Admin berhasil dibuat:', data)
  }
}

createAdmin()