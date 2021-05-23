<template>
  <view class="list-container">
    <view class="list-nav">
      <u-navbar :is-fixed="true"
                :is-back="true"
                :background="{backgroundColor: '#ffffff'}"
                back-icon-name="arrow-left"
                back-icon-color="#000"
      >
        <view class="list-nav-search">
          <u-search v-model="keyword"
                    :show-action="true"
                    height="56"
                    :action-style="{color: '#000000'}"
                    @search="toKeywordSearch"
                    @custom="toKeywordSearch"
          ></u-search>
        </view>
      </u-navbar>
      <view class="list-dropdown">
        <u-dropdown ref="searchDropdown" :active-color="'#fa436a'" border-bottom @open="open" @close="close">
          <u-dropdown-item v-model="status" title="状态" :options="statusOptions" @change="toSearch"></u-dropdown-item>
          <u-dropdown-item v-model="sort" title="拍卖" :options="auctionOptions" @change="toSearch"></u-dropdown-item>
          <u-dropdown-item v-model="sort" title="出价" :options="bidOptions" @change="toSearch"></u-dropdown-item>
        </u-dropdown>
      </view>
    </view>
    <view v-if="lotList.length > 0" class="list-content">
      <view v-for="(lot, index) in lotList" :key="index">
        <view class="list-item"
              hover-class="hover"
              :hover-start-time="150"
              @tap.stop="navTo(`/pages/lot/lot?lotId=${lot.id}`)"
        >
          <view class="list-item-image-wrapper">
            <image :src="lot.imgUrl" mode="widthFix" :preview="false" class="list-item-image"></image>
          </view>
          <view class="list-item-info">
            <view class="list-item-name">{{ lot.name }}</view>
            <view v-if="lot">
              <view class="list-item-price">
                <text class="list-item-price-highest">当前价 {{ highestPrice(lot) }}</text>
                <text class="list-item-price-base">起拍价 {{ lot.basePrice }}</text>
              </view>
              <view class="list-item-bid">
                <text>
                  <text class="list-item-bid-text">{{ lot.auctionDetails.length}}</text>次出价
                </text>
                <view>
                  <u-button v-if="isAuctionActive(lot)" type="error" size="mini" shape="circle" ripple @click="navTo(`/pages/lot/lot?lotId=${lot.id}`)">立即参拍</u-button>
                  <u-button v-else type="info" size="mini" shape="circle" ripple disabled>已结束</u-button>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="list-loadmore">
        <u-loadmore :status="loadingStatus"></u-loadmore>
      </view>
    </view>
    <view v-else class="list-empty">
      <u-empty v-if="!loading" text="暂无拍卖品" mode="search" :icon-size="180"></u-empty>
      <u-loading :show="loading" size="150" mode="flower"></u-loading>
    </view>
    <u-back-top :scroll-top="scrollTop" icon="arrow-up" :custom-style="{ opacity: '0.8' }"></u-back-top>
  </view>
</template>

<script>
import uBackTop from 'uview-ui/components/u-back-top/u-back-top'
import uButton from 'uview-ui/components/u-button/u-button'
import uDropdown from 'uview-ui/components/u-dropdown/u-dropdown'
import uDropdownItem from 'uview-ui/components/u-dropdown-item/u-dropdown-item'
import uEmpty from 'uview-ui/components/u-empty/u-empty'
import uLoading from 'uview-ui/components/u-loading/u-loading'
import uLoadmore from 'uview-ui/components/u-loadmore/u-loadmore'
import uNavbar from 'uview-ui/components/u-navbar/u-navbar'
import uSearch from 'uview-ui/components/u-search/u-search'

export default {
  components: {
    uBackTop,
    uButton,
    uDropdown,
    uDropdownItem,
    uEmpty,
    uLoading,
    uLoadmore,
    uNavbar,
    uSearch
  },
  data() {
    return {
      scrollTop: 0,
      loading: false,
      type: 'keyword',
      keyword: '',
      categoryId: 0,
      page: 0,
      loadingStatus: 'nomore',
      status: 'default',
      sort: '',
      statusOptions: this.$const.searchDropdownOptions.statusOptions,
      auctionOptions: this.$const.searchDropdownOptions.auctionOptions,
      bidOptions: this.$const.searchDropdownOptions.bidOptions,
      lotList: [],
      historyKeywordList: []
    }
  },
  onLoad(options) {
    this.type = options.type
    this.keyword = options.keyword
    this.categoryId = options.categoryId
    let searchHistory = uni.getStorageSync('searchHistory')
    this.historyKeywordList = searchHistory === '' ? [] : searchHistory
    this.fetchData()
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  onReachBottom() {
    if (this.loadingStatus !== 'nomore') {
      this.page++
      this.fetchData()
    }
  },
  methods: {
    async fetchData() {
      this.loadingStatus = 'loading'
      this.loading = true
      let res
      if (this.type === 'keyword') {
        res = await this.$api.search.searchByKeyword(this.type, this.keyword, this.page, this.status, this.sort)
      } else {
        res = await this.$api.search.searchByCategory(this.type, this.categoryId, this.page, this.status, this.sort)
      }
      if (res.data.length > 0) {
        this.lotList.push.apply(this.lotList, res.data)
        this.loadingStatus = 'loadmore'
      } else {
        this.loadingStatus = 'nomore'
      }
      this.loading = false
    },
    toKeywordSearch(value) {
      if (value !== '' && this.historyKeywordList[value] != null) {
        this.historyKeywordList.push(value)
        uni.setStorageSync('searchHistory', this.historyKeywordList)
      }
      this.type = 'keyword'
      this.toSearch()
    },
    toSearch() {
      this.page = 0
      this.lotList = []
      this.fetchData()
    },
    open() {
      this.$refs.searchDropdown.highlight()
    },
    close(index) {
      this.$refs.searchDropdown.highlight(index)
    }
  },
  computed: {
    highestPrice() {
      return (lot) => lot.auctionDetails.length > 0 ?
        Math.max.apply(Math, lot.auctionDetails.map(it => it.amount)) : lot.basePrice
    },
    isAuctionActive() {
      return (lot) => new Date(lot.auctionEndTime) - Date.now() > 0
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: $page-color-base;
}

.list-container {
  .list-nav {
    .list-nav-search {
      display: flex;
      flex: 1;
      align-items: center;
      margin: 0 20rpx;
    }

    .list-dropdown {
      background-color: $color-white;
    }
  }

  .list-content {
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    padding: 15rpx $spacing-sm 0;
    margin-right: 10rpx;
    background-color: $page-color-base;

    .list-item {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      margin-bottom: 10rpx;
      overflow: hidden;
      background: $color-white;
      border-radius: 12rpx;
      transition: all 0.15s ease-in-out;

      .list-item-image-wrapper {
        position: relative;
        overflow: hidden;
        border-radius: 6rpx;

        .list-item-image {
          display: block;
          flex-shrink: 0;
          width: 400rpx;
          height: 240rpx !important;
          border-radius: 12rpx;
        }
      }

      .list-item-info {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        padding: 20rpx;

        .list-item-name {
          display: flex;
          height: 78rpx;
          overflow: hidden;
          font-size: 26rpx;
          color: #2e2e2e;
          text-overflow: ellipsis;
          word-break: break-all;
        }

        .list-item-price {
          padding-top: 18rpx;
        }

        .list-item-price-highest {
          font-size: 34rpx;
          font-weight: 500;
          color: $base-color;
        }

        .list-item-price-base {
          padding-left: 12rpx;
          font-size: 24rpx;
          color: #a0a0a0;
        }

        .list-item-bid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10rpx;
          font-size: 24rpx;
          color: #656565;

          .list-item-bid-text {
            color: $base-color;
          }
        }
      }
    }

    .list-loadmore {
      margin-top: 50rpx;
      margin-bottom: 50rpx;
    }
  }

  .list-empty {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: calc(50vh - var(--window-top));
  }
}
</style>
