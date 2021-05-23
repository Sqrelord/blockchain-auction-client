<template>
  <view class="order-container">
    <u-tabs-swiper
        :activeColor="themeColor"
        ref="tabs"
        :list="list"
        :current="current"
        @change="change"
        :is-scroll="false"
        swiperWidth="750"
    ></u-tabs-swiper>
    <swiper class="order-swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationFinish">
      <swiper-item class="order-swiper-item" v-for="(item, state) in orderList" :key="state">
        <scroll-view v-if="item.length > 0" :scroll-y="true" style="height: 100%;">
          <view class="order-content" v-for="(order, index) in item" :key="index" @tap="navTo(`/pages/order/detail?orderId=${order.id}`)">
            <view class="order-content-top">
              <view class="order-status" :class="'order-status-' + order.status.toLowerCase()">{{ order.status | status }}</view>
              <view class="u-tips-color">创建时间：{{ order.createTime | timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
            </view>
            <view class="order-content-item">
              <view class="order-img">
                <image :src="order.lot.imgUrl" mode="aspectFill"></image>
              </view>
              <view class="order-info">
                <view class="order-lot-name u-line-3">{{ order.lot.name }}</view>
                <view class="order-lot-description">{{ order.lot.description }}</view>
              </view>
            </view>
            <view class="order-payment u-font-xs">
              成交价<text class="u-font-xl">￥{{ order.payment }}</text>
            </view>
          </view>
        </scroll-view>
        <view v-else class="order-empty">
          <u-empty v-if="!loading" text="您还没有相关的订单" font-size="30" mode="order"></u-empty>
          <u-loading :show="loading" size="150" mode="flower"></u-loading>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import _ from 'lodash/collection'
import uEmpty from 'uview-ui/components/u-empty/u-empty'
import uLoading from 'uview-ui/components/u-loading/u-loading'
import uTabsSwiper from 'uview-ui/components/u-tabs-swiper/u-tabs-swiper'

export default {
  components: {
    uEmpty,
    uLoading,
    uTabsSwiper
  },
  data() {
    return {
      loading: false,
      orderList: {
        all: [],
        unconfirmed: [],
        confirmed: [],
        sent: [],
        signed: []
      },
      list: this.$const.orderSwiperList,
      current: 0,
      swiperCurrent: 0,
      tabsHeight: 0,
      dx: 0
    }
  },
  onLoad(options) {
    this.fetchData()
    this.current = options.state
    this.swiperCurrent = options.state
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$api.order.getOrder().then(res => {
        _.forEach(res.data, order => {
          this.orderList.all.push(order)
          if (order.status === 'UNCONFIRMED') {
            this.orderList.unconfirmed.push(order)
          } else if (order.status === 'CONFIRMED') {
            this.orderList.confirmed.push(order)
          } else if (order.status === 'SENT') {
            this.orderList.sent.push(order)
          } else if (order.status === 'SIGNED') {
            this.orderList.signed.push(order)
          }
        })
        this.loading = false
      })
    },
    change(index) {
      this.swiperCurrent = index
    },
    transition({ detail: { dx } }) {
      this.$refs.tabs.setDx(dx)
    },
    animationFinish({ detail: { current } }) {
      this.$refs.tabs.setFinishCurrent(current)
      this.swiperCurrent = current
      this.current = current
    }
  },
  filters:{
    status(status) {
      if (status === 'UNCONFIRMED') {
        return '待确认'
      } else if (status === 'CONFIRMED') {
        return '待发货'
      } else if (status === 'SENT') {
        return '待收货'
      } else if (status === 'SIGNED') {
        return '已签收'
      } else {
        return '未知状态'
      }
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: $page-color-base;
}

.order-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - var(--window-top));

  .order-swiper-box {
    flex: 1;

    .order-swiper-item {
      height: 100%;
      padding-bottom: 20rpx;

      .order-content {
        box-sizing: border-box;
        width: 710rpx;
        padding: 20rpx;
        margin: 20rpx auto;
        font-size: 28rpx;
        background-color: #ffffff;
        border-radius: 20rpx;

        .order-content-top {
          display: flex;
          justify-content: space-between;
          .order-status{
            font-weight: bold;
          }
          .order-status-unconfirmed {
            color: $u-type-error;
          }

          .order-status-confirmed {
            color: $u-type-warning-dark;
          }

          .order-status-sent {
            color: $u-type-success-dark;
          }

          .order-status-signed {
            color: $u-type-primary-dark;
          }
        }

        .order-content-item {
          display: flex;
          margin: 20rpx 0 0;

          .order-img {
            margin-right: 20rpx;

            image {
              width: 200rpx;
              height: 200rpx;
              border-radius: 10rpx;
            }
          }

          .order-info {
            .order-lot-name {
              font-size: 28rpx;
              line-height: 50rpx;
            }

            .order-lot-description {
              margin: 10rpx 0;
              font-size: 24rpx;
              color: $u-tips-color;
            }

            .delivery-time {
              font-size: 24rpx;
              color: #e5d001;
            }
          }

          .right {
            padding-top: 20rpx;
            margin-left: 10rpx;
            text-align: right;

            .decimal {
              margin-top: 4rpx;
              font-size: 24rpx;
            }

            .number {
              font-size: 24rpx;
              color: $u-tips-color;
            }
          }
        }

        .order-payment {
          text-align: right;
        }
      }

      .order-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
    }
  }
}
</style>
