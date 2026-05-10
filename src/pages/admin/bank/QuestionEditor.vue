<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Soal Paket: {{ packageTitle }}</h1>
      <button @click="addQuestion" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Soal Baru
      </button>
    </div>

    <div v-if="questions.length === 0" class="text-gray-500">Belum ada soal.</div>

    <div v-for="(q, idx) in questions" :key="q.id" class="bg-white p-4 rounded shadow mb-3">
      <div class="flex justify-between">
        <strong>Soal {{ idx + 1 }}</strong>
        <button @click="deleteQuestion(q.id)" class="text-red-600 hover:underline">Hapus</button>
      </div>
      <input v-model="q.question_text" placeholder="Teks pertanyaan" class="w-full border px-2 py-1 rounded mt-2" />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div>
          <label class="text-sm">Tipe Soal</label>
          <select v-model="q.question_type" class="w-full border px-2 py-1 rounded">
            <option value="single">Pilihan Tunggal</option>
            <option value="multiple">Pilihan Ganda</option>
          </select>
        </div>
        <div>
          <label class="text-sm">Kunci Jawaban</label>
          <input v-model="q.answer_key" placeholder="a" class="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label class="text-sm">Skor</label>
          <input v-model.number="q.score" type="number" class="w-full border px-2 py-1 rounded" />
        </div>
      </div>

      <!-- Opsi -->
      <div class="mt-3">
        <p class="text-sm text-gray-700 mb-1">Opsi Jawaban:</p>
        <div v-for="(opt, oIdx) in q.options" :key="oIdx" class="flex gap-2 items-center mb-1">
          <input v-model="opt.key" placeholder="Key (a,b,c,d)" class="border px-2 py-1 rounded w-20" />
          <input v-model="opt.text" placeholder="Teks opsi" class="border px-2 py-1 rounded flex-1" />
          <button @click="removeOption(q, oIdx)" class="text-red-500">x</button>
        </div>
        <button @click="addOption(q)" class="text-sm text-blue-600">+ Tambah Opsi</button>
      </div>

      <button @click="updateQuestion(q)" class="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">
        Simpan Soal
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axios';

const route = useRoute();
const packageId = route.params.packageId;
const questions = ref([]);
const packageTitle = ref('');

onMounted(async () => {
  try {
    const [pkgRes, qsRes] = await Promise.all([
      api.get(`/packages/${packageId}`),
      api.get(`/packages/${packageId}/questions`)
    ]);
    packageTitle.value = pkgRes.data.title;
    questions.value = qsRes.data.map(q => ({
      ...q,
      options: q.options || []
    }));
  } catch (err) { console.error(err); }
});

function addQuestion() {
  questions.value.push({
    id: null, // temporary id untuk UI
    question_text: '',
    question_type: 'single',
    answer_key: '',
    score: 1,
    options: []
  });
}

function addOption(question) {
  question.options.push({ key: '', text: '' });
}

function removeOption(question, oIdx) {
  question.options.splice(oIdx, 1);
}

async function updateQuestion(question) {
  try {
    if (question.id) {
      // Update soal + opsi bisa di-handle terpisah, tapi untuk simpel kita update teks dulu
      await api.put(`/packages/${packageId}/questions/${question.id}`, {
        question_text: question.question_text,
        question_type: question.question_type,
        answer_key: question.answer_key,
        score: question.score
      });
      alert('Soal diperbarui');
    } else {
      // Create baru
      const res = await api.post(`/packages/${packageId}/questions`, {
        question_text: question.question_text,
        question_type: question.question_type,
        answer_key: question.answer_key,
        score: question.score,
        options: question.options
      });
      question.id = res.data.id; // update id sementara
      alert('Soal dibuat');
    }
  } catch (err) { console.error(err); }
}

async function deleteQuestion(id) {
  if (!confirm('Hapus soal ini?')) return;
  try {
    await api.delete(`/packages/${packageId}/questions/${id}`);
    questions.value = questions.value.filter(q => q.id !== id);
  } catch (err) { console.error(err); }
}
</script>