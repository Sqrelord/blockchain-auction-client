<template>
  <view style="height: inherit">
    <view class="setting-container">
      <view class="setting-content">
        <view class="setting-header">
          <view class="u-p-30">
            <u-avatar :src="userInfo.avatar" size="140"></u-avatar>
          </view>
          <view>
            <view class="u-font-18 u-p-b-20">{{ userInfo.username }}</view>
            <view class="u-font-12 u-tips-color">{{ userInfo.accountIdentifier }}</view>
          </view>
        </view>
        <u-cell-group class="setting-cell">
          <u-cell-item
              icon="account"
              title="个人信息"
              @click="navTo(`/pages/profile/setting/info?type=info&userInfo=${JSON.stringify(userInfo)}`)"
          ></u-cell-item>
          <u-cell-item
              icon="lock"
              title="修改密码"
              @click="navTo(`/pages/profile/setting/info?type=password&userInfo=${JSON.stringify(userInfo)}`)"
          ></u-cell-item>
          <u-cell-item
              icon="map"
              title="地址管理"
              @click="navTo('/pages/profile/address/address')"
          ></u-cell-item>
        </u-cell-group>
        <u-cell-group class="setting-cell u-p-t-20">
          <u-cell-item
              icon="reload"
              title="清除缓存"
              :value="cacheSize"
              @click="cacheModal = true"
          ></u-cell-item>
          <u-cell-item
              icon="error-circle"
              title="关于"
              @click="navTo('/pages/profile/setting/about')"
          ></u-cell-item>
        </u-cell-group>
      </view>
      <view class="setting-logout">
        <u-button
            type="error"
            :ripple="true"
            :custom-style="{width:'100%'}"
            @click="logoutModal = true"
        >退出登录</u-button>
      </view>
    </view>
    <u-modal
        v-model="cacheModal"
        content="确定清除缓存"
        :show-cancel-button="true"
        :async-close="true"
        @confirm="clearCache"
    ></u-modal>
    <u-modal
        v-model="logoutModal"
        content="确定退出登录"
        :show-cancel-button="true"
        :async-close="true"
        @confirm="logout"
    ></u-modal>
  </view>
</template>

<script>
import uAvatar from 'uview-ui/components/u-avatar/u-avatar'
import uButton from 'uview-ui/components/u-button/u-button'
import uCellGroup from 'uview-ui/components/u-cell-group/u-cell-group'
import uCellItem from 'uview-ui/components/u-cell-item/u-cell-item'
import uModal from 'uview-ui/components/u-modal/u-modal'

export default {
  components: { uAvatar,uButton,uCellGroup, uCellItem, uModal },
  data() {
    return {
      userInfo:{
        id:1,
        username: 'admin',
        password: null,
        oldPassword: null,
        avatar: 'https://uviewui.com/common/logo.png',
        accountIdentifier: '8371fedd-5952-4767-aa32-c6c99d0977df',
        email: 'admin@auction.dhu.edu.cn',
        realName: 'Admin',
        idCard: '110101199003079278'
      },
      cacheSize: '',
      cacheModal: false,
      logoutModal: false
    }
  },
  onLoad() {
    this.cacheSize = `${uni.getStorageInfoSync().currentSize} KB`
    this.$api.user.getUserInfo().then(res => {
      this.userInfo = res.data
    })
  },
  onShow(){
    this.userInfo = this.$store.state.userInfo
  },
  methods: {
    logout() {
      this.$store.commit('logout')
      this.logoutModal = false
      uni.reLaunch({
        url: '/pages/user/user',
        complete: () => uni.showToast({ title: '已退出登录', icon: 'none' })
      })
    },
    clearCache() {
      uni.clearStorage({
        success: () => {
          this.cacheSize = '0 KB'
          this.$store.commit('userInfo', this.userInfo)
          this.cacheModal = false
          this.$u.toast('清除缓存成功')
        },
        fail: () => {
          this.cacheModal = false
          this.$u.toast('清除缓存失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: $page-color-base;
}

.setting-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: inherit;

  .setting-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: inherit;

    .setting-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      width: inherit;
      padding: 50rpx 30rpx;
      background-color: white;
    }

    .setting-cell {
      width: inherit;
    }
  }

  .setting-logout {
    width: 100%;
    padding: 50rpx 20rpx;
  }
}
</style>
