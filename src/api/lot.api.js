import { request } from './request.api'

function getLotInfo(param) {
  return request.get(`/lot/info?lotId=${param}`)
}

function addComment(id, data) {
  return request.post(`/lot/comment?lotId=${id}`, data)
}

function getComment(id) {
  return request.get(`/lot/comment?lotId=${id}`)
}

module.exports = {
  getLotInfo,
  addComment,
  getComment
}
