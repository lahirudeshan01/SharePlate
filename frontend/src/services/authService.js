import api from './api'

const authService = {
  /**
   * Register a new user
   * @param {Object} data - { name, email, password, role, phone, organizationName, address }
   */
  register: async (data) => {
    const response = await api.post('/api/auth/register', data)
    return response.data
  },

  /**
   * Login user
   * @param {Object} data - { email, password }
   */
  login: async (data) => {
    const response = await api.post('/api/auth/login', data)
    return response.data
  },

  /**
   * Get currently authenticated user
   */
  getMe: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  /**
   * Update password
   * @param {Object} data - { currentPassword, newPassword }
   */
  updatePassword: async (data) => {
    const response = await api.put('/api/auth/update-password', data)
    return response.data
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await api.post('/api/auth/logout')
    return response.data
  },

  /**
   * Send forgot-password email
   * @param {string} email
   */
  forgotPassword: async (email) => {
    const response = await api.post('/api/auth/forgot-password', { email })
    return response.data
  },

  /**
   * Reset password using token from email
   * @param {string} token
   * @param {string} password
   */
  resetPassword: async (token, password) => {
    const response = await api.put(`/api/auth/reset-password/${token}`, { password })
    return response.data
  },
}

export default authService
