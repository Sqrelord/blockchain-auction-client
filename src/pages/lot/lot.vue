<template>
  <view class="lot-container">
    <view class="lot-content">
      <view class="lot-header">
        <u-swiper :height="720" :list="lotImgUrl" :autoplay="false" :circular="false"></u-swiper>
        <view class="count-down" :class="{ 'gray': auctionStatus === 'finish' }">
          <view v-if="auctionStatus === 'finish'">
            <text>拍卖已结束</text>
          </view>
          <view v-else id="content">
            <text>{{ auctionStatus === 'ready' ? '距离拍卖开始还有' : '距离拍卖结束还有' }}</text>
            <ca-countdown ref="countdown" :show-colon="false" @timeup="auctionEnd"></ca-countdown>
          </view>
        </view>
      </view>
      <view class="lot-information">
        <view class="lot-information-item">
          <view class="lot-price">
            <view class="lot-highest-price">
              <text>当前价 {{ highestPrice }}</text>
            </view>
            <view class="lot-base-price">
              <text>起拍价 {{ lot.basePrice }}</text>
            </view>
          </view>
        </view>
        <view class="lot-information-item">
          <view class="lot-name">
            <text>{{ lot.name }}</text>
            <text class="lot-description">{{ lot.description }}</text>
          </view>
          <view class="lot-share">
            <button class="lot-share-btn" open-type="share" @tap.stop="share">
              <text class="iconfont icon-share"></text>
              <text>分享</text>
            </button>
          </view>
        </view>
        <view class="lot-information-item">
          <text class="lot-other">出价次数: {{ lot.auctionDetails.length }}</text>
          <text class="lot-other">竞价阶梯: {{ lot.scale }}</text>
          <text class="lot-other">保证金 {{ lot.deposit }}</text>
        </view>
      </view>
      <view class="lot-profile">
        <ca-lot-list title="拍卖品识别码">
          <view slot="content" class="u-line-3 u-font-sm">{{ lot.assetIdentifier }}</view>
        </ca-lot-list>
        <ca-lot-list title="拍卖识别码">
          <view slot="content" class="u-line-3 u-font-sm">{{ lot.auctionIdentifier }}</view>
        </ca-lot-list>
        <ca-lot-list title="拍卖开始时间">
          <view slot="content">{{ lot.auctionStartTime | timeFormat('yyyy-mm-dd hh:MM') }}</view>
        </ca-lot-list>
        <ca-lot-list title="拍卖结束时间">
          <view slot="content">{{ lot.auctionEndTime | timeFormat('yyyy-mm-dd hh:MM') }}</view>
        </ca-lot-list>
        <ca-lot-list title="延时周期">
          <view slot="content">5分钟/次</view>
        </ca-lot-list>
        <ca-lot-list title="佣金">
          <view slot="content">{{ lot.commission }}</view>
        </ca-lot-list>
        <ca-lot-list title="提供服务" :isEmpty="false" :isArrow="true" @click="serviceShow = true">
          <u-popup slot="popup" v-model="serviceShow" closeable mode="bottom" border-radius="14">
            <view class="lot-profile-popup-content">
              <view class="lot-profile-popup-content-service" v-for="(item, index) in ['担保交易','包邮','七天无理由退货','秒杀']" :key="index">
                <text>{{ item }}</text>
              </view>
              <view class="lot-profile-popup-content-btn">
                <u-button
                    :custom-style="{ backgroundColor: themeColor, color: '#ffffff', width: '100%' }"
                    shape="circle"
                    size="medium"
                    @click="serviceShow = false"
                >
                  确认
                </u-button>
              </view>
            </view>
          </u-popup>
        </ca-lot-list>
        <ca-lot-list title="拍卖须知" :isEmpty="false" :isArrow="true" @click="ruleShow = true">
          <u-popup slot="popup" v-model="ruleShow" closeable mode="bottom" border-radius="14">
            <view class="lot-profile-popup-content">
              <view class="lot-profile-popup-content-rule">
                <text v-for="(item, index) in auctionRules" :key="index">{{ item }}</text>
              </view>
              <view class="lot-profile-popup-content-btn">
                <u-button
                    :custom-style="{ backgroundColor: themeColor, color: '#ffffff', width: '100%'}"
                    shape="circle"
                    size="medium"
                    @click="ruleShow = false"
                >
                  确认
                </u-button>
              </view>
            </view>
          </u-popup>
        </ca-lot-list>
      </view>
      <view v-if="lot.auctionDetails.length > 0" class="lot-bidder">
        <u-read-more close-text="展开查看所有出价" :toggle="true" :color="themeColor" text-indent="0">
          <view class="lot-detail-header">
            <text>历史出价</text>
          </view>
          <view class="lot-bidder-detail">
            <u-time-line>
              <u-time-line-item v-for="(item, index) in lot.auctionDetails" :key="index">
                <template v-slot:content>
                  <view class="lot-bidder-item">
                    <view id="price" :class="{ 'highest': !index }">{{ item.amount }}</view>
                    <view class="u-font-md u-tips-color u-line-3">出价人：{{ item.publicKey }}</view>
                    <view class="u-font-xs u-type-warning-dark u-line-3">交易哈希：{{ item.txHash }}</view>
                    <view class="u-font-xs u-light-color">{{ item.bidTime | timeFormat('yyyy-mm-dd hh:MM:ss') }}</view>
                  </view>
                </template>
              </u-time-line-item>
            </u-time-line>
          </view>
        </u-read-more>
      </view>
      <view class="lot-comment" @tap="navTo(`/pages/lot/comment?lotId=${lot.id}`)">
        <view class="lot-comment-header">
          <text class="tit">评价({{ lot.comments.length || 0 }})</text>
          <text class="tip" v-if="!lot.comments">暂无评价信息</text>
          <u-icon name="arrow-right"></u-icon>
        </view>
        <view class="lot-comment-content" v-if="lot.comments && lot.comments.length > 0">
          <image class="lot-comment-avatar" :src="lot.comments[0].account.avatar || asset.userEmptyAvatar" mode="aspectFill"></image>
          <view class="lot-comment-detail">
            <text>{{ lot.comments[0].account.username || '匿名用户' }}</text>
            <text class="in2line">{{ lot.comments[0].text || '这个人很懒，什么都没留下~' }}</text>
            <text>{{ lot.comments[0].commentTime | timeFormat('yyyy-mm-dd hh:MM') }}</text>
          </view>
        </view>
      </view>
      <view class="lot-detail">
        <view class="lot-detail-header">
          <text id="text">商品详情</text>
        </view>
        <u-parse :html="lot.introduction" lazy-load autoscroll></u-parse>
      </view>
      <ca-lot-tabbar
          v-if="auctionStatus !== 'finish'"
          class="lot-action-bar"
          :fill="true"
          :isParticipate="isParticipate"
          @participateOnClick="isAuthed"
          @bidOnClick="bidShow = true"
      >
        <u-number-box
            v-model="bidPrice"
            :step="Number(lot.scale)"
            :min="Number(highestPrice) + Number(lot.scale)"
            :max="9999999999"
            :input-height="70"
            :input-width="150"
            :size="40"
        ></u-number-box>
      </ca-lot-tabbar>
    </view>
    <ca-loading is-full-screen :active="loading" :color="themeColor"></ca-loading>
    <u-back-top :scroll-top="scrollTop" icon="arrow-up" :custom-style="{ opacity: '0.8' }"></u-back-top>
    <u-popup v-model="bidShow" closeable mode="bottom" border-radius="14" height="60%">
      <view class="lot-bid-popup">
        <view class="lot-bid-popup-header">
          <image :src="lotImgUrl[0]" mode="widthFix" :preview="false" ></image>
          <view class="lot-name u-p-l-20">
            <text class="u-m-b-20 u-line-3">{{ lot.name }}</text>
            <text class="u-line-2 u-tips-color u-font-md">{{ lot.description }}</text>
          </view>
        </view>
        <view class="lot-bid-popup-price">
          <view id="highest-price">
            <text>当前最高价</text>
            <text>{{ highestPrice }}元</text>
          </view>
          <view id="bid-price">
            <text>您的出价</text>
            <text>{{ bidPrice }}元</text>
          </view>
          <view class="u-tips-color u-font-md">
            <text>当前出价次数</text>
            <text>{{ lot.auctionDetails.length }}</text>
          </view>
          <view class="u-tips-color u-font-md">
            <text>拍卖结束时间</text>
            <text>{{ lot.auctionEndTime | timeFormat('yyyy-mm-dd hh:MM')}}</text>
          </view>
        </view>
        <u-button type="warning" :custom-style="{ width: '100%' }" @click="bid" :disabled="btnLoading">
          <u-loading mode="flower" :show="btnLoading"></u-loading>
          <text class="u-p-l-10">{{ btnValue }}</text>
        </u-button>
      </view>
    </u-popup>
    <u-modal
        v-model="modalShow"
        :content="`参拍该拍品需要缴纳保证金${lot.deposit}元`"
        async-close
        show-cancel-button
        confirm-text="确认缴纳"
        @confirm="participate"
    ></u-modal>
    <u-modal
        v-model="modalLogin"
        content="请先登录"
        confirm-text="确认"
        @confirm="navTo(`/pages/login/login?redirectUrl=/pages/lot/lot?lotId=${lot.id}`)"
    ></u-modal>
    <u-toast ref="toast"/>
  </view>
</template>

<script>
import caCountdown from '@/components/ca-countdown/ca-countdown'
import caLotList from '@/components/ca-lot-list/ca-lot-list'
import caLoading from '@/components/ca-loading/ca-loading'
import caLotTabbar from '@/components/ca-lot-tabbar/ca-lot-tabbar'

import uBackTop from 'uview-ui/components/u-back-top/u-back-top'
import uButton from 'uview-ui/components/u-button/u-button'
import uIcon from 'uview-ui/components/u-icon/u-icon'
import uLoading from 'uview-ui/components/u-loading/u-loading'
import uModal from 'uview-ui/components/u-modal/u-modal'
import uNumberBox from 'uview-ui/components/u-number-box/u-number-box'
import uParse from 'uview-ui/components/u-parse/u-parse'
import uPopup from 'uview-ui/components/u-popup/u-popup'
import uReadMore from 'uview-ui/components/u-read-more/u-read-more'
import uSwiper from 'uview-ui/components/u-swiper/u-swiper'
import uTimeLine from 'uview-ui/components/u-time-line/u-time-line'
import uTimeLineItem from 'uview-ui/components/u-time-line-item/u-time-line-item'
import uToast from 'uview-ui/components/u-toast/u-toast'

export default {
  components: {
    caCountdown,
    caLotList,
    caLoading,
    caLotTabbar,
    uBackTop,
    uButton,
    uIcon,
    uLoading,
    uModal,
    uNumberBox,
    uParse,
    uPopup,
    uReadMore,
    uSwiper,
    uTimeLine,
    uTimeLineItem,
    uToast
  },
  data() {
    return {
      scrollTop: 0,
      loading: true,
      serviceShow: false,
      ruleShow: false,
      bidShow: false,
      auctionActive: Boolean,
      auctionStatus: 'finish',
      auctionRules: this.$const.auctionRules,
      countdown: null,
      isParticipate: false,
      modalShow: false,
      modalLogin: false,
      btnValue: '确定出价',
      btnLoading: false,
      bidPrice: 0,
      lot: {
        id: 0,
        name: '',
        description: '',
        imgUrl: '',
        introduction: '',
        basePrice: 0,
        scale: 0,
        deposit: 0,
        commission: 0,
        auctionStartTime: '',
        auctionEndTime: '',
        assetIdentifier: '',
        auctionIdentifier: '',
        auctionDetails: [],
        comments: []
      },
    }
  },
  onLoad(options) {
    this.lot.id = options.lotId
    this.fetchData()
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  onPullDownRefresh() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      let lotRes = await this.$api.lot.getLotInfo(this.lot.id)
      let participateRes = await this.$api.auction.getParticipate(this.lot.id)
      this.lot = lotRes.data
      this.loadAuctionStatus()
      this.loadCountdown()
      this.bidPrice = Number(this.highestPrice) + Number(this.lot.scale)
      let id = uni.getStorageSync('userInfo').id
      this.isParticipate = participateRes.data.map(it => it.id).indexOf(id) >= 0
      uni.stopPullDownRefresh()
      this.loading = false
    },
    participate() {
      this.$api.auction.participate(this.lot.id).then(res => {
        this.lot = res.data
        this.modalShow = false
        this.isParticipate = true
        this.$refs.toast.show({ title: '参拍成功', type: 'success' })
      }).catch(err => {
        this.$refs.toast.show({ title: `参拍失败:${err.data}`, type: 'error' })
        this.modalShow = false
      })
    },
    bid() {
      this.btnLoading = true
      this.btnValue = '出价中'
      this.$api.auction.bid(this.lot.id, { amount: this.bidPrice }).then(res => {
        this.$refs.toast.show({ title: '出价成功', type: 'success' })
        this.lot.auctionDetails = res.data
        this.bidPrice = Number(this.highestPrice) + Number(this.lot.scale)
        this.btnLoading = false
        this.btnValue = '确定出价'
        this.bidShow = false
      }).catch(err => {
        this.$refs.toast.show({ title: `出价失败:${err.data}`, type: 'error' })
        this.btnLoading = false
        this.btnValue = '确定出价'
      })
    },
    isAuthed() {
      if (this.$store.getters.hasLogin) {
        this.modalShow = true
      } else {
        this.modalLogin = true
      }
    },
    auctionEnd() {
      this.loadCountdown()
    },
    loadAuctionStatus() {
      if (Date.now() < new Date(this.lot.auctionStartTime)) {
        this.auctionStatus = 'ready'
      } else if (Date.now() > new Date(this.lot.auctionEndTime)) {
        this.auctionStatus = 'finish'
      } else {
        this.auctionStatus = 'active'
      }
    },
    loadCountdown() {
      this.$nextTick(() => {
        if (this.auctionStatus === 'ready') {
          this.$refs.countdown.setTime(Math.round(new Date(this.lot.auctionStartTime) / 1000))
        } else if (this.auctionStatus === 'active') {
          this.$refs.countdown.setTime(Math.round(new Date(this.lot.auctionEndTime) / 1000))
        }
      })
    }
  },
  computed: {
    lotImgUrl() {
      return this.lot.imgUrl.split(';')
    },
    highestPrice: {
      get() {
        return this.lot.auctionDetails.length > 0 ?
          Math.max.apply(Math, this.lot.auctionDetails.map(it => it.amount)) : this.lot.basePrice
      },
      set(value) {
        return value
      }
    }
  }
}
</script>

<style lang="scss">
page {
  background: $page-color-base;
}

.lot-container {
  .lot-content {
    padding-bottom: 60rpx;

    .lot-header {
      .count-down {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 100rpx;
        background: url("../../static/image/count-down-bg.jpg");
        border-radius: 20rpx;

        #content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 30rpx;
        }

        text {
          color: #ffffff;
        }
      }

      .gray {
        filter: grayscale(60%);
      }
    }

    .lot-information {
      margin-bottom: $spacing-base;
      background-color: $color-white;
      border-radius: 0 0 32rpx 32rpx;

      .lot-information-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $spacing-base 0 $spacing-sm $spacing-lg;

        .lot-price {
          padding: 10rpx 0;

          .lot-highest-price > text {
            font-size: 42rpx;
            color: #fa436a;
          }

          .lot-base-price > text {
            font-size: $font-base;
            color: $font-color-light;
          }
        }

        .lot-name {
          flex: 1;
          font-size: 30rpx;
          line-height: 1.3;
          color: $color-black;

          .lot-description {
            display: block;
            margin-top: 10rpx;
            font-size: $font-base;
            color: $font-color-light;
          }
        }

        .lot-share {
          width: 110rpx;
          padding: 10rpx 16rpx;
          margin-left: $spacing-base;
          font-size: 24rpx;
          line-height: 24rpx;
          background: #ededed !important;
          border-radius: 50rpx 0 0 50rpx;

          .icon-share {
            margin-right: 6rpx;
            font-size: $font-sm;
          }

          .lot-share-btn {
            flex: 1;
            height: 32rpx;
            padding: 0;
            margin: 0;
            font-size: $font-sm;
            line-height: 36rpx;
            color: #fa436a;
            text-align: right;
            background: transparent;
            border-radius: none;
          }

          .lot-share-btn:after {
            background: transparent;
            border: none;
          }
        }

        .lot-other {
          flex: 1;
          padding-right: $spacing-lg;
          font-size: $font-sm;
          color: $font-color-light;
          text-align: center;

          &:first-child {
            text-align: left;
          }

          &:last-child {
            text-align: right;
          }
        }
      }
    }

    .lot-profile {
      margin-bottom: 16rpx;
      font-size: 26rpx;
      color: $font-color-base;
      background: #fff;

      .lot-profile-popup-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height: 100%;
        padding: 50rpx 30rpx;

        .lot-profile-popup-content-service {
          padding: 20rpx 0;
        }

        .lot-profile-popup-content-rule {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .lot-profile-popup-content-btn {
          width: 100%;
          padding-top: 50rpx;
        }
      }
    }

    .lot-bidder {
      background-color: $color-white;

      .lot-bidder-detail {
        padding: 40rpx 50rpx;

        .lot-bidder-item {
          justify-content: space-between;

          .highest {
            font-size: 45rpx;
            color: $base-color;
          }

          #price {
            font-weight: bold;
          }
        }
      }
    }

    .lot-comment {
      display: flex;
      flex-direction: column;
      padding: 20rpx 30rpx;
      margin-top: 16rpx;
      background: #fff;

      .lot-comment-header {
        display: flex;
        align-items: center;
        height: 70rpx;
        font-size: 26rpx;
        color: $font-color-light;

        .tit {
          flex: 1;
          margin-right: 4rpx;
          font-size: 30rpx;
          color: $font-color-dark;
        }

        .tip {
          text-align: right;
        }

        .iconyou {
          margin-left: 10rpx;
        }
      }

      .lot-comment-content {
        display: flex;
        padding: 20rpx 0;

        .lot-comment-avatar {
          flex-shrink: 0;
          width: 80rpx;
          height: 80rpx;
          border-radius: 100px;
        }

        .lot-comment-detail {
          display: flex;
          flex: 1;
          flex-direction: column;
          padding-left: 26rpx;
          font-size: $font-base;
          color: $font-color-base;

          &:nth-child(1) {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          &:nth-child(2) {
            font-size: $font-base;
            color: $font-color-dark;
          }

          &:nth-child(3) {
            display: flex;
            justify-content: space-between;
            font-size: $font-sm;
            color: $font-color-light;
          }
        }
      }
    }

    .lot-detail-header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80rpx;
      font-size: 30rpx;
      color: #303133;

      #text {
        position: relative;
        padding: 0 20rpx;
        background: $color-white;
      }
    }

    .lot-detail {
      padding: 0 0 40rpx;
      margin-top: 16rpx;
      background: $color-white;
    }
  }

  .lot-action-bar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 95;
    background: white;
    box-shadow: 0px -4px 4px -4px rgba(96, 98, 102, 0.2);
  }

  .lot-bid-popup {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    height: 100%;
    padding: 60rpx 60rpx;

    .lot-bid-popup-header {
      position: relative;
      display: flex;
      overflow: hidden;
      border-radius: 6rpx;

      image {
        display: block;
        flex-shrink: 0;
        width: 200rpx !important;
        border-radius: 12rpx;
      }

      view {
        display: flex;
        flex: 1;
        flex-direction: column;
        font-size: 30rpx;
        line-height: 1.3;
        color: $color-black;
      }
    }

    .lot-bid-popup-price {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin: 10rpx 0;

      view {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      #highest-price {
        margin: 10rpx 0;
        font-size: 30rpx;
        color: $u-content-color;
      }

      #bid-price {
        margin: 10rpx 0 15rpx;
        font-size: 40rpx;
        color: $base-color;
      }
    }
  }
}
</style>
