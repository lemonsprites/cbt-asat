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

async function createAdmin() {
  const plainPassword = 'admin123'
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(plainPassword, salt)

  const { data, error } = await supabase
    .from('users')
    .insert({
      email: 'admin@asat.com',
      username: 'AdminSuper',          // ← tambahkan username
      password_hash: hash,
      role: 'admin',
      name: 'Administrator Utama'
    })
    .select()

  if (error) {
    console.error('Gagal insert admin:', error.message)
  } else {
    console.log('✅ Admin berhasil dibuat')
    console.log('   Email   : admin@asat.com')
    console.log('   Username: admin')
    console.log('   Password: Admin123!')
  }
}

createAdmin()