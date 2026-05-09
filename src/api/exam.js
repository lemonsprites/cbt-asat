import api from './axios'

export function getStudentExams() {
  return api.get('/student/exams').then(res => res.data)
}

export function getExamQuestions(examId) {
  return api.get(`/student/exams/${examId}/questions`).then(res => res.data)
}

export function autosaveAnswer(examId, answers) {
  return api.post(`/student/exams/${examId}/autosave`, { answers })
}

export function submitExam(examId, answers) {
  return api.post(`/student/exams/${examId}/submit`, { answers }).then(res => res.data)
}

export function logEvent(examId, event, metadata = {}) {
  return api.post(`/student/exams/${examId}/log`, { event, metadata }).catch(() => {}) // optional
}