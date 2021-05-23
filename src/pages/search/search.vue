<template>
  <view class="search-container">
    <view class="search-box">
      <u-search
          v-model="keyword"
          class="search-input"
          bg-color="#ffffff"
          :action-style="{
            backgroundColor:themeColor,
            color:'#ffffff',
            height:'64rpx',
            width:'128rpx',
            borderRadius:'64px',
            display:'flex',
            alignItems:'center',
            justifyContent:'space-around'
          }"
          @search="toSearch"
          @custom="toSearch"
      ></u-search>
    </view>
    <view class="search-keyword" @tap="hideKeyboard">
      <scroll-view class="keyword-box" :scroll-y="true">
        <view class="keyword-block">
          <view class="keyword-list-header">
            <view>历史搜索</view>
            <u-icon name="trash" :size="40" @click="deleteHistory"></u-icon>
          </view>
          <view class="keyword" v-if="historyKeywordList.length > 0">
            <view v-for="(keyword, index) in historyKeywordList" :key="index">
              <u-tag :text="keyword" type="info" shape="circle" mode="plain" @click="navTo(`/pages/search/list?keyword=${keyword}`)"/>
            </view>
          </view>
          <view class="keyword-empty" v-else>
            <u-empty text="暂无记录" mode="history" :icon-size="60"></u-empty>
          </view>
        </view>
        <view class="keyword-block">
          <view class="keyword-list-header">
            <view>热门搜索</view>
          </view>
          <view class="keyword" v-if="popularKeywordList.length > 0">
            <view v-for="(keyword, index) in popularKeywordList" :key="index">
              <u-tag :text="keyword" type="info" shape="circle" @click="navTo(`/pages/search/list?keyword=${keyword}`)"/>
            </view>
          </view>
          <view class="keyword-empty" v-else>
            <u-empty text="暂无热门商品" mode="favor" :icon-size="60"></u-empty>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import uEmpty from 'uview-ui/components/u-empty/u-empty'
import uIcon from 'uview-ui/components/u-icon/u-icon'
import uSearch from 'uview-ui/components/u-search/u-search'
import uTag from 'uview-ui/components/u-tag/u-tag'

export default {
  components: {
    uEmpty,
    uIcon,
    uSearch,
    uTag
  },
  data() {
    return {
      keyword: '',
      historyKeywordList: [],
      popularKeywordList: ['珠宝', '房产', '翡翠', '狗粮', '手表', '玉石', '网盘商品', '鞋', '虚拟商品'],
    }
  },
  onLoad() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      let searchHistory = uni.getStorageSync('searchHistory')
      this.historyKeywordList = searchHistory === '' ? [] : searchHistory
    },
    hideKeyboard() {
      uni.hideKeyboard()
    },
    deleteHistory() {
      uni.removeStorageSync('searchHistory')
    },
    toSearch(value) {
      if (value !== '') {
        this.historyKeywordList.push(value)
        uni.setStorageSync('searchHistory', this.historyKeywordList)
      }
      this.$routers.navigateTo(`/pages/search/list?type=keyword&keyword=${value}`)
    },
  },
}
</script>

<style lang="scss">
page {
  background-color: $page-color-base;
}

.search-container {
  .search-box {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 15rpx 2.5%;
    background-color: rgb(242, 242, 242);

    .search-input {
      width: 100%;
    }
  }

  .search-keyword {
    width: 100%;
    background-color: rgb(242, 242, 242);

    .keyword-box {
      padding-bottom: 50rpx;
      background-color: #fff;
      border-radius: 20rpx;

      .keyword-block {
        padding: 10rpx 0;

        .keyword-list-header {
          display: flex;
          justify-content: space-between;
          width: 100vw;
          padding: 10rpx 3%;
          font-size: 27rpx;
          color: #333;
        }

        .keyword {
          display: flex;
          flex-flow: wrap;
          justify-content: flex-start;
          width: 100vw;
          padding: 3px 3%;
        }

        .keyword-empty {
          display: flex;
          justify-content: center;
        }

        .keyword > view {
          padding: 0 5rpx;
          margin: 10rpx 20rpx 10rpx 0;
        }
      }
    }
  }
}
</style>
