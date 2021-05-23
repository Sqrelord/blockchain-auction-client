import { request } from './request.api'

function getOrder() {
  return request.get('/order/list')
}

function getOrderDetail(orderId) {
  return request.get('/order/info', { params: { orderId } })
}

function changeOrderStatus(orderId, status) {
  return request.post(`/order/status?orderId=${orderId}&status=${status}`)
}

module.exports = {
  getOrder,
  getOrderDetail,
  changeOrderStatus
}
