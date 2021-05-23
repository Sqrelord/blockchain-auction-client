/* eslint-disable */
import { addCategories, addLots } from './mock.request'

const agent = require('superagent')
const _ = require('lodash')

async function getCategory() {
  let allCategories = []
  let first = await agent.get('https://api.m.jd.com/api?appid=paimai&functionId=getCategoryListByParentId&body={"parentId":"12650","categoryLevelRpcEnum":"FIRST","categorySearchTypeRpcEnum":"TREASURE_SEARCH"}&loginType=3&time=1616481214067')
  for (const parentCate of JSON.parse(first.text).data) {
    let second = await agent.get(`https://api.m.jd.com/api?appid=paimai&functionId=getCategoryListByParentId&body={"parentId":"${parentCate.id}","categoryLevelRpcEnum":"SECOND","categorySearchTypeRpcEnum":"TREASURE_SEARCH"}&loginType=3&time=${new Date().getTime()}`)
    for (const cate of JSON.parse(second.text).data) {
      let dbCate = {
        id: cate.id,
        name: cate.name,
        parentId: parentCate.id,
        parent: parentCate.name
      }
      allCategories.push(dbCate)
    }
  }
  return _.uniqBy(allCategories, 'name')
}

async function getLot(categories) {
  let allLots = []
  for (const cate of categories) {
    let searchProducts = await agent.get(`https://api.m.jd.com/api?appid=paimai&functionId=getSearchProducts&body={"page":1,"pageSize":1,"keyword":"","paimaiStatus":"","sortField":"","publishSource":5,"platTypeList":"0,1,2,3,4,5,6","businessType":1,"firstCateIds":"[12650]","secondCateIds":"[${cate.parentId}]","thirdCateIds":"[${cate.id}]"}&loginType=3&time=${new Date().getTime()}`)
    for (const lot of JSON.parse(searchProducts.text).datas) {
      setTimeout(async () => {
        let detail = await agent.get(`https://api.m.jd.com/api?appid=paimai&functionId=getProductBasicInfo&body={"paimaiId":${lot.id}}`)
        let description = await agent.get(`https://api.m.jd.com/api?appid=paimai&functionId=queryProductDescription&body={"paimaiId":${lot.id}}`)
        let basicInfo = JSON.parse(detail.text).data
        let dbLot = {
          name: basicInfo.title,
          description: basicInfo.serviceSupport,
          imgUrl: basicInfo.paimaiImageResultList.map(it => `https://img14.360buyimg.com/imgb/s800x800_${it.imagePath}`).join(';'),
          introduction: JSON.parse(description.text).data.replace(/'/g, '\"'),
          basePrice: basicInfo.startPrice,
          highestPrice: basicInfo.startPrice,
          deposit: basicInfo.ensurePrice,
          scale: basicInfo.priceLowerOffset,
          commission: 0,
          auctionStartTime: new Date(basicInfo.startTime),
          auctionEndTime: new Date(basicInfo.endTime),
          category: {
            name: cate.name
          }
        }
        allLots.push(dbLot)
      }, 500)
    }
  }
  return _.uniqBy(allLots, 'name')
}

describe('从京东拍卖爬取数据并保存', () => {
  let category = []
  let lot = []

  test('爬取分类信息', async (done) => {
    category = await getCategory()
    addCategories(category)
    done()
  }, 20 * 60 * 1000)

  test('爬取拍卖品', async (done) => {
    lot = await getLot(category)
    addLots(lot)
    done()
  }, 20 * 60 * 1000)
})
