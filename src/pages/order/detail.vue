<template>
  <view class="order-detail-container">
    <view class="order-detail-section">
      <view class="order-detail-address">
        <u-icon class="u-m-20" name="map" size="60" :color="themeColor"></u-icon>
        <view class="address-content">
          <text>{{ orderDetail.address.consignee }}
            <text class="u-p-l-20 u-font-xs u-tips-color">{{ orderDetail.address.phone }}</text>
          </text>
          <text>{{ orderDetail.address.address }}</text>
        </view>
      </view>
      <image class="order-section-img" src="/static/image/order-section.png"></image>
    </view>
    <view class="order-detail-lot">
      <view class="order-lot-content">
        <view class="order-lot-header" @tap="navTo(`/pages/lot/lot?lotId=${orderDetail.lot.id}`)">
          <view class="u-m-r-20">
            <image :src="orderDetail.lot.imgUrl" mode="aspectFill"></image>
          </view>
          <view class="order-lot-info">
            <view class="order-lot-name u-line-3">{{ orderDetail.lot.name }}</view>
            <view class="order-lot-description">{{ orderDetail.lot.description }}</view>
          </view>
        </view>
        <view class="order-lot-profile">
          <view class="order-lot-item u-tips-color">
            <text>起拍价</text>
            <text>￥{{ Number(orderDetail.lot.basePrice).toFixed(2) }}</text>
          </view>
          <view class="order-lot-item u-tips-color">
            <text>成交价</text>
            <text>￥{{ Number(orderDetail.lot.highestPrice).toFixed(2) }}</text>
          </view>
          <view class="order-lot-item u-tips-color">
            <text>佣金</text>
            <text>￥{{ Number(orderDetail.lot.commission).toFixed(2) }}</text>
          </view>
          <view class="order-lot-item">
            <text class="u-font-xl">最终价</text>
            <text class="u-font-xl u-type-error">￥{{ Number(orderDetail.payment).toFixed(2) }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="order-detail-order">
      <u-cell-group title="订单信息" :title-style="{color: '#000000'}" :border="false">
        <u-cell-item icon="fingerprint" title="拍卖品识别码" :border-bottom="false" :arrow="false">
          {{ orderDetail.lot.assetIdentifier }}
        </u-cell-item>
        <u-cell-item icon="fingerprint" title="拍卖识别码" :border-bottom="false" :arrow="false">
          {{ orderDetail.lot.auctionIdentifier }}
        </u-cell-item>
        <u-cell-item icon="calendar" title="拍卖开始时间" :border-bottom="false" :arrow="false">
          {{ orderDetail.lot.auctionStartTime | timeFormat('yyyy-mm-dd hh:MM:ss') }}
        </u-cell-item>
        <u-cell-item icon="calendar-fill" title="拍卖结束时间" :border-bottom="false" :arrow="false">
          {{ orderDetail.lot.auctionEndTime | timeFormat('yyyy-mm-dd hh:MM:ss') }}
        </u-cell-item>
        <u-cell-item icon="order" title="订单创建时间" :border-bottom="false" :arrow="false">
          {{ orderDetail.createTime | timeFormat('yyyy-mm-dd hh:MM:ss') }}
        </u-cell-item>
      </u-cell-group>
    </view>
    <view class="order-detail-action">
      <view class="order-action" :class="'order-action-' + orderDetail.status.toLowerCase()">
        {{ orderDetail.status | status }}
      </view>
      <view>
        <u-button
            size="medium"
            shape="circle"
            :type="btnType(orderDetail.status)"
            :custom-style="{marginLeft:'20rpx', width:'10vw'}"
            :loading="btnLoading"
            @click="changeStatus"
        >
          {{ btnValue(orderDetail.status) }}
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import uButton from 'uview-ui/components/u-button/u-button'
import uCellGroup from 'uview-ui/components/u-cell-group/u-cell-group'
import uCellItem from 'uview-ui/components/u-cell-item/u-cell-item'
import uIcon from 'uview-ui/components/u-icon/u-icon'

export default {
  components: {
    uButton,
    uCellGroup,
    uCellItem,
    uIcon,
  },
  data() {
    return {
      btnLoading: false,
      orderDetail: {
        id: 0,
        payment: 0,
        createTime: '',
        status: 'UNCONFIRMED',
        address: {},
        owner: {},
        lot: {}
      }
    }
  },
  onLoad(options) {
    this.orderDetail.id = options.orderId
    this.fetchData()
  },
  onPullDownRefresh() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      let res = await this.$api.order.getOrderDetail(this.orderDetail.id)
      this.orderDetail = res.data
      uni.stopPullDownRefresh()
    },
    changeStatus() {
      if (this.orderDetail.status === 'SIGNED') {
        this.$routers.navigateTo(`/pages/lot/comment?lotId=${this.orderDetail.lot.id}`)
      } else {
        this.btnLoading = true
        this.$api.order.changeOrderStatus(this.orderDetail.id, this.orderDetail.status).then(res => {
          this.orderDetail = res.data
          this.btnLoading = false
        })
      }
    }
  },
  computed: {
    btnType() {
      return status => {
        if (status === 'UNCONFIRMED') {
          return 'error'
        } else if (status === 'CONFIRMED') {
          return 'warning'
        } else if (status === 'SENT') {
          return 'success'
        } else if (status === 'SIGNED') {
          return 'primary'
        } else {
          return 'info'
        }
      }
    },
    btnValue() {
      return status => {
        if (status === 'UNCONFIRMED') {
          return '确认订单'
        } else if (status === 'CONFIRMED') {
          return '提醒发货'
        } else if (status === 'SENT') {
          return '确认签收'
        } else if (status === 'SIGNED') {
          return '评价'
        } else {
          return '评价'
        }
      }
    }
  },
  filters: {
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
  background-color: $page-color-light;
}

.order-detail-container {
  .order-detail-section {
    padding: 10rpx;
    margin: 0 0 20rpx;
    background-color: white;

    .order-detail-address {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .address-content {
        display: flex;
        flex-direction: column;
        padding: 10rpx;
        margin: 10rpx;
      }
    }

    .order-section-img {
      width: 100%;
      height: 5rpx;
    }
  }

  .order-detail-lot {
    margin: 30rpx 0;
    background-color: white;

    .order-lot-content {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      padding: 20rpx;

      .order-lot-header {
        display: flex;

        image {
          width: 200rpx;
          height: 200rpx;
          border-radius: 10rpx;
        }

        .order-lot-info {
          padding: 20rpx;

          .order-lot-name {
            font-size: 28rpx;
            line-height: 50rpx;
          }

          .order-lot-description {
            margin: 10rpx 0;
            font-size: 24rpx;
            color: $u-tips-color;
          }
        }
      }

      .order-lot-profile {
        .order-lot-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5rpx 0;
        }
      }
    }
  }

  .order-detail-order {
    padding-bottom: 9vh;
    margin: 30rpx 0;
    background-color: white;
  }

  .order-detail-action {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 8vh;
    padding: 0 20rpx;
    background: white;
    box-shadow: 0px -4px 4px -4px rgba(96, 98, 102, 0.2);

    .order-action {
      font-weight: bold;
    }

    .order-action-unconfirmed {
      color: $u-type-error;
    }

    .order-action-confirmed {
      color: $u-type-warning-dark;
    }

    .order-action-sent {
      color: $u-type-success-dark;
    }

    .order-action-signed {
      color: $u-type-primary-dark;
    }
  }
}
</style>
