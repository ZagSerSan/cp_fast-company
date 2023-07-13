import axios from 'axios'
import { toast } from 'react-toastify'
import configFile from '../config.json'

// "apiEndPoint": "http://localhost:4000/api/v1/"
axios.defaults.baseURL = configFile.apiEndPoint

axios.interceptors.request.use(
  function (config) {
    if (configFile.isFirebase) {
      const containSlash = /\/$/gi.test(config.url)
      config.url = (containSlash ? config.url.slice(0, -1) : config.url) + '.json'
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  }
)
const transformData = (data) => {
  return data ? Object.keys(data).map(key => ({
    ...data[key]
  })) : []
}
axios.interceptors.response.use((res) => {
  if (configFile.isFirebase) {
    res.data = {content: transformData(res.data)}
  }
  return res
},
function (error) {
  // условие для отлавливания ожидаемой ошибки (см коды статусов http)
  const expectedErrors = 
  error.response &&
  error.response.status >= 400 &&
  error.response.status < 500
  if (!expectedErrors) {
    console.log('error :>> ', error)
    // неожидаемые ошибки
    toast.error('Something was wrong. Try it later.')
  }
  return Promise.reject(error)
})

const httpService = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
}

export default httpService
