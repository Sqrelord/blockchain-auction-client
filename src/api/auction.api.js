import { request } from './request.api'

function bid(id, data) {
  return request.post(`/auction/bid?lotId=${id}`, data)
}

function participate(id) {
  return request.post(`/auction/participate?lotId=${id}`)
}

function getParticipate(id) {
  return request.get(`/auction/participate?lotId=${id}`)
}

function getJoinAuction() {
  return request.get('/auction/list')
}

module.exports = {
  bid,
  participate,
  getParticipate,
  getJoinAuction
}
