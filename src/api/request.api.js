import Request from 'luch-request'
import constant from '@/common/constant'

const request = new Request()

request.setConfig(config => {
  if (process.env.NODE_ENV === 'production') {
    config.baseURL = constant.requestBaseUrl.prod
  } else {
    config.baseURL = constant.requestBaseUrl.dev
    // #ifdef H5
    config.baseURL = ''
    // #endif
  }
  return config
})

request.interceptors.request.use(
  config => {
    config.header['token'] = uni.getStorageSync('token')
    config.withCredentials = true
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

request.interceptors.response.use(
  async res => {
    if (res.data.code === 0) {
      return res.data
    } else {
      return await Promise.reject(res.data)
    }
  },
  err => {
    uni.showToast({ title: '服务器错误', image: '/static/image/error.png' })
    return Promise.reject(err)
  }
)

export { request }
