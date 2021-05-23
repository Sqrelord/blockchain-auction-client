import Vue from 'vue'

import constant from '@/common/constant'
import api from '@/api'
import asset from '@/common/asset'
import routers from '@/common/router'
import uView from 'uview-ui'
import store from './store'
import App from './App'

Vue.use(uView)

Vue.config.productionTip = false
Vue.prototype['$api'] = api
Vue.prototype['$asset'] = asset
Vue.prototype['$const'] = constant
Vue.prototype['$routers'] = routers

routers.beforeEach((navType, to) => {
  if (to == null) {
    throw 'No Page : ' + to
  } else if (to === '/pages/login/login' && store.getters.hasLogin) {
    uni.reLaunch({ url: '/pages/home/home' })
  } else if (constant.authPage.includes(to.split('?')[0]) && !store.getters.hasLogin) {
    uni.navigateTo({
      url: `/pages/login/login?redirectUrl=${to}`
    })
  } else {
    uni[navType]({ url: to })
  }
})

Vue.mixin({
  data() {
    return {
      themeColor: '#fa436a',
      asset
    }
  },
  methods: {
    navTo(page) {
      routers.navigateTo(page)
    },
    navBack(delta) {
      routers.back({ delta })
    },
  },
})

App.mpType = 'app'

const app = new Vue({
  store,
  ...App,
})
app.$mount()
