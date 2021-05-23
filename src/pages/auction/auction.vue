<template>
  <view class="auction-container">
    <u-tabs-swiper
        :activeColor="themeColor"
        ref="tabs" :list="auctionSwiperList"
        :current="current"
        @change="change"
        :is-scroll="false"
        swiperWidth="750"
    ></u-tabs-swiper>
    <swiper class="u-flex-1" :current="swiperCurrent" @transition="transition" @animationfinish="animationFinish">
      <swiper-item style="height: 100%" v-for="(item, key) in auctionList" :key="key">
        <scroll-view v-if="item.length > 0" :scroll-y="true" style="height: 100%">
          <view class="auction-content" v-for="(lot, index) in item" :key="index" @tap="navTo(`/pages/lot/lot?lotId=${lot.id}`)">
            <view v-if="key === 'active'" class="auction-section">
              <view class="auction-section-head">
                <view id="line"/>
              </view>
              <view class="auction-section-content">
                <text>距离拍卖结束还有</text>
                <ca-countdown :second="countdown(lot)" splitor-color="#000" background-color="#3c3c3c"></ca-countdown>
              </view>
            </view>
            <view class="auction-item">
              <view class="auction-item-img">
                <image :src="lot.imgUrl" mode="aspectFill"></image>
              </view>
              <view class="auction-item-content">
                <view class="u-line-3" id="title">{{ lot.name }}</view>
                <view id="type">{{ lot.description }}</view>
              </view>
            </view>
            <view v-if="key !== 'ready'" class="auction-price">
              总共出价{{ lot.auctionDetails.length }}次
              <text>{{ key === 'active' ? '当前出价￥' : '最高出价￥' }}{{ lot.highestPrice }}</text>
            </view>
            <view class="auction-btn">
              <view>
                <u-button
                    v-if="key === 'active'"
                    shape="circle"
                    type="error"
                    size="mini"
                    ripple
                    :custom-style="{fontSize:'25rpx',width:'200rpx'}"
                    @click="navTo(`/pages/lot/lot?lotId=${lot.id}`)"
                >
                  出价
                </u-button>
              </view>
            </view>
          </view>
        </scroll-view>
        <view v-else class="auction-empty">
          <u-empty v-if="!loading" text="您还没有相关的拍卖" font-size="30" src="/static/image/auction-empty.png" icon-size="100"></u-empty>
          <u-loading :show="loading" size="150" mode="flower"></u-loading>
        </view>
      </swiper-item>
    </swiper>
    <u-modal
        v-model="modal"
        content="请先登录"
        confirm-text="确认"
        @confirm="navTo(`/pages/login/login?redirectUrl=/pages/auction/auction`)"
    ></u-modal>
  </view>
</template>

<script>
import _ from 'lodash/collection'
import caCountdown from '@/components/ca-countdown/ca-countdown'
import uButton from 'uview-ui/components/u-button/u-button'
import uEmpty from 'uview-ui/components/u-empty/u-empty'
import uLoading from 'uview-ui/components/u-loading/u-loading'
import uModal from 'uview-ui/components/u-modal/u-modal'
import uTabsSwiper from 'uview-ui/components/u-tabs-swiper/u-tabs-swiper'

export default {
  components: {
    caCountdown,
    uButton,
    uEmpty,
    uLoading,
    uModal,
    uTabsSwiper
  },
  data() {
    return {
      loading: false,
      isReady: false,
      modal: false,
      auctionSwiperList: this.$const.auctionSwiperList,
      current: 0,
      swiperCurrent: 0,
      tabsHeight: 0,
      dx: 0,
      page: 0,
      auctionList: {
        ready: [],
        active: [],
        finish: []
      }
    }
  },
  onLoad(options) {
    let state = options.state
    this.swiperCurrent = state
    this.current = state
    this.fetchData()
  },
  onPullDownRefresh() {
    this.fetchData()
  },
  computed: {
    countdown() {
      return (lot) => Math.round((new Date(lot.auctionEndTime) ) / 1000)
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      this.auctionList = { ready: [], active: [], finish: [] }
      let res = await this.$api.auction.getJoinAuction()
      _.forEach(res.data, lot => {
        if (Date.now() < new Date(lot.auctionStartTime)) {
          this.auctionList.ready.push(lot)
        } else if (Date.now() > new Date(lot.auctionEndTime)) {
          this.auctionList.finish.push(lot)
        } else {
          this.auctionList.active.push(lot)
        }
      })
      uni.stopPullDownRefresh()
      this.loading = false
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
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: $page-color-base;
}

.auction-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - var(--window-top));

  .auction-content {
    box-sizing: border-box;
    width: 710rpx;
    padding: 20rpx;
    margin: 20rpx auto;
    font-size: 28rpx;
    background-color: #ffffff;
    border-radius: 20rpx;

    .auction-section {
      position: relative;
      /* #ifndef APP-NVUE */
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 35px;
      padding: 0 10px;
      /* #endif */
      margin: 0;
      font-weight: normal;
      background-color: #f8f8f8;
    }

    .auction-section-head {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }

    #line {
      width: 3px;
      height: 15px;
      background-color: $base-color;
      border-radius: 5px;
    }

    .auction-section-content {
      /* #ifndef APP-NVUE */
      display: flex;
      flex: 1;
      /* #endif */
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      color: #333;
    }

    .auction-item {
      display: flex;
      margin: 20rpx 0 0;

      .auction-item-img {
        margin-right: 20rpx;

        image {
          width: 200rpx;
          height: 200rpx;
          border-radius: 10rpx;
        }
      }

      .auction-item-content {
        #title {
          font-size: 28rpx;
          line-height: 50rpx;
        }

        #distraction {
          margin: 10rpx 0;
          font-size: 24rpx;
          color: #e5d001;
        }
      }
    }

    .auction-price {
      margin-top: 20rpx;
      font-size: 24rpx;
      text-align: right;

      text {
        margin-left: 15rpx;
        font-size: 32rpx;
      }
    }

    .auction-btn {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 10rpx;
      margin-top: 40rpx;
    }
  }

  .auction-loadmore {
    // #ifdef H5
    padding: 50rpx 0 150rpx;
    // #endif
    // #ifdef MP-WEIXIN
    padding: 50rpx 0 50rpx;
    // #endif
  }

  .auction-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 200rpx auto;
    font-size: 32rpx;
    text-align: center;

    image {
      width: 164rpx;
      height: 164rpx;
      margin-bottom: 20rpx;
      border-radius: 50%;
    }

    .auction-empty-tips {
      margin-top: 20rpx;
      font-size: 24rpx;
      color: #999999;
    }

    .auction-empty-btn {
      width: 200rpx;
      margin: 80rpx auto;
      font-size: 26rpx;
      line-height: 64rpx;
      color: #ffffff;
      background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
      border-radius: 32rpx;
    }
  }
}
</style>
