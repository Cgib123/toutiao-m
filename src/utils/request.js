// 请求模块
import axios from 'axios'
import store from '@/store/'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'// 接口的基础路径
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // config配置对象
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 注意：这里必须返回config，否则请求就停在这里出不去了
  return config
}, function (error) {
  // 如果请求出错会进入这里
  return Promise.reject(error)
})
// 响应拦截器

export default request
