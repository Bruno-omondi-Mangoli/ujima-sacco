import axios from 'axios'

const api = axios.create({
  baseURL: 'https://ujima-sacco-server.onrender.com'
})

export default api