import axios from 'axios'
import { toast } from 'react-toastify'
import configFile from '../config.json'
import localStorageService from './localStorage.service'
import authService from './auth.services'

// "apiEndPoint": "http://localhost:4000/api/v1/"
const http = axios.create({
  baseURL: configFile.apiEndPoint
})

const transformData = (data) => {
  return data && !data._id
    ? Object.keys(data).map(key => ({
      ...data[key]
    }))
    : data
}

// перехват запроса
http.interceptors.request.use(
  async function (config) {
    const expiresData = localStorageService.getTokenExpirensData()
    const refreshToken = localStorageService.getRefreshToken()
    const isExpired = refreshToken && expiresData < Date.now()

    if (configFile.isFirebase) {
      const containSlash = /\/$/gi.test(config.url)
      config.url = (containSlash ? config.url.slice(0, -1) : config.url) + '.json'

      // const expiresData = localStorageService.getTokenExpirensData()
      // const refreshToken = localStorageService.getRefreshToken()

      if (isExpired) {
        const data = await authService.refresh()

        localStorageService.setTokens({
          localId: data.user_id,
          idToken: data.id_token,
          refreshToken: data.refresh_token,
          expiresIn: data.expires_in
        })
      }
      const idToken = localStorageService.getAccessToken()
      if (idToken) {
        config.params = {...config.params, auth: idToken}
      }
    } else {
      if (isExpired) {
        const data = await authService.refresh()
        localStorageService.setTokens(data)
      }
      const accessToken = localStorageService.getAccessToken()
      if (accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`
        }
      }
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  }
)

// перехват ответа сервера
http.interceptors.response.use((res) => {
  if (configFile.isFirebase) {
    res.data = {content: transformData(res.data)}
  }
  res.data = { content: res.data }
  return res
},
function (error) {
  // условие для отлавливания ожидаемой ошибки, со стороны клиента, запроса. (см коды статусов http)
  const expectedErrors = 
  error.response &&
  error.response.status >= 400 &&
  error.response.status < 500
  // expectedErrors = 401, 404, ...
  // условие для отлавливания НЕожидаемой ошибки (см коды статусов http)
  // если ошибка не от клиента (нет подключения к серверу или он упал)
  if (!expectedErrors) {
    // если expectedErrors НЕ = 401, 404, ...
    // то ловим и показываем неожидаемые ошибки
    console.log('error :>> ', error)
    toast.error(error.message + '. http.service -> line: 68')
  }
  return Promise.reject(error)
})

// ------------------------

const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete
}

export default httpService
