<template>
  <view class="user-container">
    <view class="user-header">
      <image class="user-header-bg" :src="asset.userBg"></image>
      <view class="user-info">
        <view class="u-p-l-20 u-flex" @tap="avatarClick">
          <u-avatar :src="userInfo.avatar || asset.userEmptyAvatar" size="130"></u-avatar>
          <text class="username">{{ userInfo.username || '请登录' }}</text>
        </view>
      </view>
    </view>
    <view class="user-content">
      <image class="user-content-arc" :src="asset.userBgArc"></image>
      <view class="user-content-item">
        <ca-list-cell
            icon="iconqianbao"
            :iconColor="'#ff6b81'"
            title="我的拍卖"
            @click="navTo('/pages/auction/auction')"
        ></ca-list-cell>
        <view class="auction-section">
          <view class="auction-item"
                v-for="item in auctionSectionList"
                :key="item.title"
                @tap="navTo(item.url)">
            <u-icon :name="item.icon" :label="item.title" :color="'#ff6b81'" label-pos="bottom" size="50" margin-top="20" label-size="24"></u-icon>
          </view>
        </view>
      </view>
      <view class="user-content-item">
        <ca-list-cell
            icon="iconicon1"
            :iconColor="'#ff6b81'"
            title="我的订单"
            @click="navTo(`/pages/order/order?state=0`)"
        ></ca-list-cell>
        <view class="order-section">
          <view class="order-item"
                v-for="item in orderSectionList"
                :key="item.title"
                @tap="navTo(item.url)"
                hover-class="common-hover"
                :hover-stay-time="50">
            <i class="order-item-iconfont" :class="item.icon"/>
            <text>{{ item.title }}</text>
            <u-badge
                v-if="item.num"
                type="error"
                class="order-item-badge"
                :count="item.num"
                :offset="[0,0]"
            ></u-badge>
          </view>
        </view>
      </view>
      <view class="user-content-item">
        <ca-list-cell
            icon="iconfuwu"
            navigate-type="none"
            :iconColor="'#ff6b81'"
            title="我的服务"
            @click="navTo('/pages/set/set')"
        ></ca-list-cell>
        <view class="service-section">
          <view class="service-list">
            <view class="service-item"
                  v-for="(item, index) in settingSectionList"
                  :key="index"
                  @tap.stop="navTo(item.url)">
              <view v-if="item.title !== '分享'">
                <view class="service-item-img">
                  <u-icon :name="item.icon" :label="item.title" :color="'#ff6b81'" label-pos="bottom" size="50" margin-top="20" label-size="24"></u-icon>
                </view>
              </view>
              <button v-else class="service-item-share-btn" open-type="share" @tap="share">
                <view class="service-item-img">
                  <u-icon :name="item.icon" :label="item.title" :color="'#ff6b81'" label-pos="bottom" size="50" margin-top="20" label-size="24"></u-icon>
                </view>
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import caListCell from '@/components/ca-list-cell/ca-list-cell'
import uAvatar from 'uview-ui/components/u-avatar/u-avatar'
import uBadge from 'uview-ui/components/u-badge/u-badge'
import uIcon from 'uview-ui/components/u-icon/u-icon'

export default {
  components: {
    caListCell,
    uIcon,
    uAvatar,
    uBadge
  },
  data() {
    return {
      userInfo: {},
      auctionSectionList: this.$const.auctionSectionList,
      orderSectionList: this.$const.orderSectionList,
      settingSectionList: this.$const.settingSectionList,
    }
  },
  onLoad() {
    if (this.$store.getters.hasLogin) {
      this.$api.user.getUserInfo().then(res => {
        this.userInfo = res.data
      })
    }
  },
  onShow() {
    this.userInfo = this.$store.state.userInfo
  },
  methods: {
    avatarClick() {
      if (uni.getStorageSync('token')) {
        this.navTo('/pages/profile/setting/setting')
      } else {
        this.navTo('/pages/login/login')
      }
    }
  },
}
</script>

<style lang="scss">
page {
  background-color: $page-color-base;
}

.user-container {
  .user-header {
    position: relative;
    height: 520rpx;
    padding: 100rpx 30rpx 0;
    color: #ffffff;
    background-color: #fa436a;

    .user-header-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 60vw;
      opacity: 0.84;
    }

    .user-info {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 180rpx;

      .username {
        padding-left: 30rpx;
        font-size: 40rpx;
        color: $color-white;
      }
    }
  }

  .user-content {
    position: relative;
    padding: 0 30rpx 20rpx;
    margin-top: -150rpx;
    background-color: $page-color-base;

    .user-content-arc {
      position: absolute;
      top: -34rpx;
      left: 0;
      width: 100%;
      height: 36rpx;
    }

    .user-content-item {
      margin-bottom: 20rpx;
      background: #fff;
    }


    .auction-section {
      @extend %section;
      display: flex;

      .auction-item {
        @extend %flex-center;
        flex: 1;
        flex-direction: column;
        margin: 30rpx 0;
        font-size: 24rpx;
        color: #75787d;
      }

      .auction-item-num {
        font-size: 28rpx;
      }
    }

    .order-section {
      @extend %section;
      padding: 28rpx 0;

      .order-item {
        @extend %flex-center;
        position: relative;
        width: 120rpx;
        height: 120rpx;
        font-size: 24rpx;
        color: $font-color-dark;
        border-radius: 10rpx;

        .order-item-iconfont {
          font-size: 48rpx;
          color: #fa436a;
        }

        .order-item-badge {
          position: absolute;
          top: 0;
          right: 4rpx;
        }
      }
    }

    .service-section {
      @extend %section;
      display: flex;

      .service-list {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        padding: 0 0 30rpx 0;
        border-bottom: solid 2rpx #f6f6f6;

        .service-item {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          width: 33.3%;
          margin-top: 50rpx;

          .service-item-img {
            display: flex;
            justify-content: center;
            width: 100%;
          }

          .service-item-text {
            display: flex;
            justify-content: center;
            width: 100%;
            font-size: 24rpx;
            color: #3c3c3c;
          }

          .service-item-share-btn {
            height: 142rpx;
            padding: 0;
            margin: 0;
            text-align: left;
            background: none;
          }

          .service-item-share-btn:after {
            border: none;
            border-radius: none;
          }
        }
      }
    }
  }
}

%flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

%section {
  display: flex;
  align-content: center;
  justify-content: space-around;
  background: #fff;
  border-radius: 10rpx;
}
</style>
