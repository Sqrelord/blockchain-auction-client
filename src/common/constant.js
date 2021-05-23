export default {
  requestBaseUrl: {
    prod: 'https://example.com:8085',
    dev: 'http://localhost:8085'
  },
  authPage: [
    '/pages/profile/setting/setting',
    '/pages/profile/setting/about',
    '/pages/profile/setting/info',
    '/pages/profile/address/address',
    '/pages/profile/address/add',
    '/pages/auction/auction',
    '/pages/order/order',
    '/pages/order/detail'
  ],
  searchDropdownOptions: {
    statusOptions: [
      { label: '全部', value: 'default', },
      { label: '正在拍卖', value: 'active', },
      { label: '已结束', value: 'finish', }
    ],
    auctionOptions: [
      { label: '默认', value: '', },
      { label: '当前价最高', value: 'highest', },
      { label: '当前价最低', value: 'lowest', }
    ],
    bidOptions: [
      { label: '默认', value: '', },
      { label: '出价次数最多', value: 'most', },
      { label: '出价次数最少', value: 'least', }
    ]
  },
  auctionRules: [
    '1、关于拍品：拍品为全新未拆封机器，竞拍成功之后，不指定颜色的话默认随机发货。',
    '2、关于签收：本店默认包邮顺丰或者京东快递，这两者快递不能到达地区，请自行联系客服修改快递方式；由于属于贵重物品，请务必本人签收，代签的，一律视为本人签收！',
    '3、关于售后：由于机器为全新未拆封机器，请签收前务必确认需求后方可激活，激活之后，拒绝退换货！全国联保1年。',
    '4、关于保证金：竞拍失败，保证金会原路返回、竞拍成功，请在规定时间内完成付款，不完成付款的抑或付款后退款的会冻结扣除保证金，请理性参拍',
  ],
  auctionSwiperList: [
    { name: '未开拍' },
    { name: '已开拍' },
    { name: '已结束' }
  ],
  auctionSectionList: [
    { title: '未开拍', icon: 'lock', url: '/pages/auction/auction?state=0' },
    { title: '已开拍', icon: 'hourglass', url: '/pages/auction/auction?state=1' },
    { title: '已结束', icon: 'bell', url: '/pages/auction/auction?state=2' }
  ],
  orderSwiperList: [
    { name: '全部' },
    { name: '待确认' },
    { name: '待发货' },
    { name: '待收货' },
    { name: '已签收' }
  ],
  orderSectionList: [
    { title: '待确认', icon: 'iconfont icondaifukuan', url: '/pages/order/order?state=1', },
    { title: '待发货', icon: 'iconfont iconshouye', url: '/pages/order/order?state=2', },
    { title: '待收货', icon: 'iconfont iconyishouhuo', url: '/pages/order/order?state=3', },
    { title: '已签收', icon: 'iconfont iconpingjia', url: '/pages/order/order?state=4', }
  ],
  settingSectionList: [
    { title: '地址管理', icon: 'map', url: '/pages/profile/address/address' },
    { title: '分享', icon: 'share', url: '' },
    { title: '设置', icon: 'setting', url: '/pages/profile/setting/setting' }
  ]
}
