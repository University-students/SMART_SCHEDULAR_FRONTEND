import API from './api'

export const authService = {
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}
