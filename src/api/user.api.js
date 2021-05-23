import { request } from './request.api'

function login(data) {
  return request.post('/user/login', data)
}

function getCaptcha(phone) {
  return request.get('/user/captcha', { params: { phone } })
}

function captchaLogin(phone, captcha) {
  return request.post(`/user/login/phone?phone=${phone}&captcha=${captcha}`)
}

function wxLogin(data) {
  return request.post('/user/login/wx', data)
}

function getUserInfo() {
  return request.get('/user/info')
}

function editUserInfo(data) {
  return request.post('/user/edit', data)
}

function editPassword(data) {
  return request.post('/user/password', data)
}

function getAddress() {
  return request.get('/user/address')
}

function editAddress(data) {
  return request.post('/user/address', data)
}

function deleteAddress(param) {
  return request.delete(`/user/address?id=${param}`)
}

module.exports = {
  login,
  getCaptcha,
  captchaLogin,
  wxLogin,
  getUserInfo,
  editUserInfo,
  editPassword,
  getAddress,
  editAddress,
  deleteAddress
}
