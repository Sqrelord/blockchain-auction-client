import Vue from 'vue'
import Vuex from 'vuex'
import constant from '../common/constant'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    themeColor: constant.themeColor,
    token: '',
    userInfo: {},
  },
  mutations: {
    login(state, data) {
      console.log(data)
      state.userInfo = data.info
      state.token = data.token
      uni.setStorageSync('userInfo', data.info)
      uni.setStorageSync('token', data.token)
    },
    logout(state) {
      console.log('user ' + state.userInfo.username + ' logout')
      state.userInfo = {}
      state.token = ''
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('token')
    },
    userInfo(state, info) {
      state.userInfo = info
      uni.setStorageSync('userInfo', info)
    }
  },
  getters: {
    hasLogin: state => {
      return !!state.token
    }
  }
})

export default store
