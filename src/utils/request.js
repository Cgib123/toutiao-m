// 请求模块
import axios from 'axios'
import store from '@/store/'
import JSONBig from 'json-bigint'

// JSON.parse()
// JSON.stringify()
// JSONBig 可以处理数据中超出 JavaScript 安全证书范围的问题
// JSONBig.parse() // 把json格式字符串转为 javascript 对象
// JSONBig.stringify() // 把javascript 对象转为 json格式字符串
// var jsonStr = '{ "art_id": 123455666424998763 }'
// console.log(JSONBig.parse(jsonStr))  // 转完为一个对象
// 使用时需要把 Bignumber 类型的数据转为字符串来使用
// console.log(JSONBig.parse(jsonStr).art_id.toString())

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 接口的基础路径
  // 自定义后端返回的原始数据
  // data 后端返回的原始数据，即JSON格式字符串
  transformResponse: [function (data) {
    // axios 会默认在内部 JSON处理后端返回的数据，修改为JSONBig
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // config本次请求的配置对象
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
