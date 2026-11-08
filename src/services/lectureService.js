import API from './api'

export const lectureService = {
  getTodayLectures: async () => {
    const response = await API.get('/lectures/today')
    return response.data
  },
  getAllLectures: async () => {
    const response = await API.get('/lectures')
    return response.data
  },
  getProgress: async () => {
    const response = await API.get('/lectures/progress')
    return response.data
  },
  addLecture: async (lectureData) => {
    const response = await API.post('/lectures', lectureData)
    return response.data
  },
}
