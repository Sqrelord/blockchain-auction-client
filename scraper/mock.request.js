/* eslint-disable */
const http = require('superagent')

export function addCategories(data) {
  http.post('http://localhost:8085/mock/category')
    .send(data)
    .end()
}

export function addLots(data) {
  http.post('http://localhost:8085/mock/lot')
    .send(data)
    .end()
}
