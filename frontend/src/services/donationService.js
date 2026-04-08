import api from './api'

const donationService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/donations', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/api/donations/${id}`)
    return response.data
  },

  getMyDonations: async () => {
    const response = await api.get('/api/donations/my-donations')
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/api/donations', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/api/donations/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/api/donations/${id}`)
    return response.data
  },

  reserve: async (id) => {
    const response = await api.put(`/api/donations/${id}/reserve`)
    return response.data
  },

  markCollected: async (id) => {
    const response = await api.put(`/api/donations/${id}/collect`)
    return response.data
  },
}

export default donationService
