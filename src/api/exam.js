import api from './axios'

export function getStudentExams() {
  return api.get('/exams').then(res => res.data)
}

export function getExamQuestions(examId) {
  return api.get(`/exams/${examId}/questions`).then(res => res.data)
}

export function autosaveAnswer(examId, answers) {
  return api.post(`/exams/${examId}/autosave`, { answers })
}

export function submitExam(examId, answers) {
  return api.post(`/exams/${examId}/submit`, { answers }).then(res => res.data)
}

export function logEvent(examId, event, metadata = {}) {
  // Kalau endpoint log ada di Express, bisa ditambahkan nanti
  return api.post(`/exams/${examId}/log`, { event, metadata }).catch(() => {})
}