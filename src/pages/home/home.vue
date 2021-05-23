<template>
  <view class="home-container">
    <view class="home-nav">
      <u-navbar :is-fixed="true"
                :is-back="false"
                :background="{backgroundColor: '#fa436a'}"
      >
        <view class="home-nav-search">
          <u-search class="home-nav-input"
                    :disabled="true"
                    :show-action="false"
                    input-align="center"
                    :bg-color="'#ffffff'"
                    @click="navTo('/pages/search/search')"
                    height="56"
          ></u-search>
        </view>
      </u-navbar>
    </view>
    <view class="home-content">
      <view class="home-swiper">
        <u-swiper :list="list" mode="rect" effect3d></u-swiper>
      </view>
      <view>
        <u-waterfall v-model="lotList" ref="waterfall">
          <template v-slot:left="{leftList}">
            <view class="home-waterfall" v-for="(lot, index) in leftList" :key="index" @tap="navTo(`/pages/lot/lot?lotId=${lot.id}`)">
              <!--  #ifdef MP-WEIXIN  -->
              <view class="home-waterfall-img">
                <image :src="lot.imgUrl" mode="widthFix"></image>
              </view>
              <!--  #endif  -->
              <!--  #ifndef MP-WEIXIN  -->
              <u-lazy-load threshold="-250" border-radius="10" :image="lot.imgUrl" :index="index"></u-lazy-load>
              <!--  #endif  -->
              <view class="home-waterfall-title u-line-3">{{ lot.name }}</view>
              <view class="home-waterfall-highest-price">当前价 {{ lot.highestPrice }}元</view>
              <view class="home-waterfall-base-price">起拍价 {{ lot.basePrice }}元</view>
              <view class="home-waterfall-tag">{{ `出价${lot.auctionDetails.length}次` }}</view>
            </view>
          </template>
          <template v-slot:right="{rightList}">
            <view class="home-waterfall" v-for="(lot, index) in rightList" :key="index" @tap="navTo(`/pages/lot/lot?lotId=${lot.id}`)">
              <!--  #ifdef MP-WEIXIN  -->
              <view class="home-waterfall-img">
                <image :src="lot.imgUrl" mode="widthFix"></image>
              </view>
              <!--  #endif  -->
              <!--  #ifndef MP-WEIXIN  -->
              <u-lazy-load threshold="-250" border-radius="10" :image="lot.imgUrl" :index="index"></u-lazy-load>
              <!--  #endif  -->
              <view class="home-waterfall-title u-line-3">{{ lot.name }}</view>
              <view class="home-waterfall-highest-price">当前价 {{ lot.highestPrice }}元</view>
              <view class="home-waterfall-base-price">起拍价 {{ lot.basePrice }}元</view>
              <view class="home-waterfall-tag">{{ `出价${lot.auctionDetails.length}次` }}</view>
            </view>
          </template>
        </u-waterfall>
        <view class="home-loadmore">
          <u-loadmore :status="loadingStatus"></u-loadmore>
        </view>
      </view>
    </view>
    <u-back-top :scroll-top="scrollTop" icon="arrow-up" :custom-style="{ opacity: '0.8' }"></u-back-top>
  </view>
</template>

<script>
import _ from 'lodash/collection'
import uBackTop from 'uview-ui/components/u-back-top/u-back-top'
import uLazyLoad from 'uview-ui/components/u-lazy-load/u-lazy-load'
import uLoadmore from 'uview-ui/components/u-loadmore/u-loadmore'
import uNavbar from 'uview-ui/components/u-navbar/u-navbar'
import uSearch from 'uview-ui/components/u-search/u-search'
import uSwiper from 'uview-ui/components/u-swiper/u-swiper'
import uWaterfall from 'uview-ui/components/u-waterfall/u-waterfall'

export default {
  components: {
    uBackTop,
    uLazyLoad,
    uLoadmore,
    uNavbar,
    uSearch,
    uSwiper,
    uWaterfall
  },
  data() {
    return {
      scrollTop: 0,
      loadingStatus: 'loadmore',
      page: 0,
      lotList: [],
      list: [
        { image: 'https://cdn.uviewui.com/uview/swiper/1.jpg' },
        { image: 'https://cdn.uviewui.com/uview/swiper/2.jpg' },
        { image: 'https://cdn.uviewui.com/uview/swiper/3.jpg' }
      ],
    }
  },
  onLoad() {
    this.fetchData(false)
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  onReachBottom() {
    if (this.loadingStatus !== 'nomore') {
      this.page++
      this.fetchData(false)
    }
  },
  onPullDownRefresh() {
    // this.$routers.reLaunch('/pages/home/home')
    // this.page = 0
    this.fetchData(true)
  },
  methods: {
    async fetchData(refresh) {
      this.loadingStatus = 'loading'
      let res = await this.$api.search.getWaterfallLots(this.page)
      _.forEach(res.data, it => it.imgUrl = it.imgUrl.split(';')[0])
      if (refresh) {
        this.lotList = res.data
      } else {
        if (res.data.length > 0) {
          this.lotList.push.apply(this.lotList, res.data)
          this.loadingStatus = 'loadmore'
        } else {
          this.loadingStatus = 'nomore'
        }
      }
      uni.stopPullDownRefresh()
    }
  }
}
</script>

<style lang="scss">
@import "~uview-ui/libs/css/style.components";

page {
  background-color: $page-color-base;
}

.home-waterfall-img {
  overflow: hidden;
  background-color: #eee;
  border-radius: 10rpx;
  transition: opacity 0.5s ease-in-out;

  image {
    display: block;
    width: 100%;
    height: 450rpx;
    border-radius: 10rpx;
    transform: transition3d(0, 0, 0);
    will-change: transform;
  }
}

.home-container {
  .home-nav {
    .home-nav-search {
      display: flex;
      flex: 1;
      align-items: center;
      margin: 0 20rpx;

      .home-nav-input {
        width: 100%;
      }
    }
  }

  .home-content {
    .home-swiper {
      padding: 20rpx 0;
    }
  }

  .home-waterfall {
    position: relative;
    padding: 8px;
    margin: 5px;
    background-color: #ffffff;
    border-radius: 8px;

    .home-waterfall-title {
      margin-top: 5px;
      font-size: 26rpx;
      color: $u-main-color;
    }

    .home-waterfall-tag {
      box-sizing: border-box;
      /* #ifndef APP-NVUE */
      display: inline-block;
      align-items: center;
      padding: 6rpx 12rpx;
      margin-top: 5px;
      font-size: 20rpx;
      /* #endif */
      line-height: 1;
      color: $u-type-primary;
      background-color: #FFFFFF;
      border: 1px solid $u-type-primary;
      border-radius: 100rpx;
    }

    .home-waterfall-highest-price {
      margin-top: 5px;
      font-size: 30rpx;
      color: $u-type-error;
    }

    .home-waterfall-base-price {
      font-size: 22rpx;
      color: $u-tips-color;
    }
  }

  .home-loadmore {
    margin: 50rpx 0;
  }
}
</style>
