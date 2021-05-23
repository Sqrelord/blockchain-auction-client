import { request } from './request.api'

function getCategories() {
  return request.get('/category/list')
}

function searchByKeyword(type, keyword, page, status, sort) {
  return request.get('/lot/search', { params: { type, value: keyword, page, status, sort } })
}

function searchByCategory(type, categoryId, page, status, sort) {
  return request.get('/lot/search', { params: { type, value: categoryId, page, status, sort } })
}

function getWaterfallLots(page) {
  return request.get('/home/waterfall', { params: { page } })
}

module.exports = {
  getCategories,
  searchByKeyword,
  searchByCategory,
  getWaterfallLots
}
