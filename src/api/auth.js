import api from './axios'

export function loginApi(email, password) {
  return api.post('/auth/login', { email, password }).then(res => res.data)
}

export function getProfile() {
  return api.get('/auth/me').then(res => res.data)
}

export function logoutApi() {
  return api.post('/auth/logout')
}