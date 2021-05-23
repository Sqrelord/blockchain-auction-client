<template>
  <view class="category-container">
    <u-navbar :is-back="false" :background="{backgroundColor: '#ffffff'}">
      <view class="category-nav-search">
        <u-search
            height="56"
            :show-action="false"
            :action-style="{color: '#000000'}"
            :style="{width: '100%'}"
            disabled
            @click="navTo('/pages/search/search')"
        ></u-search>
      </view>
    </u-navbar>
    <view class="category-menu-wrap">
      <scroll-view
          :scroll-y="true"
          :scroll-with-animation="true"
          class="category-tab-view menu-scroll-view"
          :scroll-top="scrollTop"
          :scroll-into-view="itemId"
      >
        <view class="category-tab-item"
              :class="[current === index ? 'category-tab-item-active' : '']"
              v-for="(item, index) in categories" :key="index"
              @tap.stop="switchMenu(index)"
        >
          <text class="u-line-1">{{ item.parentName }}</text>
        </view>
      </scroll-view>
      <scroll-view
          :scroll-top="scrollRightTop"
          :scroll-y="true"
          :scroll-with-animation="true"
          class="category-right-box"
          @scroll="rightScroll"
      >
        <view class="category-page-view">
          <view class="category-class-item" :id="`item${index}`" v-for="(item, index) in categories" :key="index">
            <view class="category-item-title">
              <text>{{ item.parentName }}</text>
            </view>
            <view class="category-item-container">
              <view class="category-thumb-box" v-for="cate in item.child" :key="cate.id">
                <image class="category-item-menu-image" :src="cate.icon"
                       @tap="navTo(`/pages/search/list?type=category&categoryId=${cate.id}`)"></image>
                <view class="category-item-menu-name">{{ cate.name }}</view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
import _ from 'lodash/collection'
import uNavbar from 'uview-ui/components/u-navbar/u-navbar'
import uSearch from 'uview-ui/components/u-search/u-search'

export default {
  components: {
    uNavbar,
    uSearch
  },
  data() {
    return {
      scrollTop: 0,
      oldScrollTop: 0,
      current: 0,
      menuHeight: 0,
      menuItemHeight: 0,
      itemId: '',
      menuItemPos: [],
      arr: [],
      scrollRightTop: 0,
      timer: null,
      categories: []
    }
  },
  onLoad() {
    this.fetchData()
  },
  onReady() {
    this.getMenuItemTop()
  },
  methods: {
    async fetchData() {
      let res = await this.$api.search.getCategories()
      this.categories = _.map(_.groupBy(res.data, 'parent'), (val, key) => {
        return { parentName: key, child: val }
      })
    },
    onclick(cat) {
      console.log(cat)
    },
    async switchMenu(index) {
      if (this.arr.length === 0) {
        await this.getMenuItemTop()
      }
      if (index === this.current) return
      this.scrollRightTop = this.oldScrollTop
      this.$nextTick(function () {
        this.scrollRightTop = this.arr[index]
        this.current = index
        this.leftMenuStatus(index)
      })
    },
    getElRect(elClass, dataVal) {
      new Promise((resolve) => {
        const query = uni.createSelectorQuery().in(this)
        query.select('.' + elClass).fields({
          size: true
        }, res => {
          if (!res) {
            setTimeout(() => {
              this.getElRect(elClass)
            }, 10)
            return
          }
          this[dataVal] = res.height
          resolve()
        }).exec()
      })
    },
    async observer() {
      this.tabbar.map((val, index) => {
        let observer = uni.createIntersectionObserver(this)
        observer.relativeTo('.category-right-box', {
          top: 0
        }).observe('#item' + index, res => {
          if (res.intersectionRatio > 0) {
            let id = res.id.substring(4)
            this.leftMenuStatus(id)
          }
        })
      })
    },
    async leftMenuStatus(index) {
      this.current = index
      if (this.menuHeight === 0 || this.menuItemHeight === 0) {
        await this.getElRect('menu-scroll-view', 'menuHeight')
        await this.getElRect('category-tab-item', 'menuItemHeight')
      }
      this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2
    },
    getMenuItemTop() {
      new Promise(resolve => {
        let selectorQuery = uni.createSelectorQuery()
        selectorQuery.selectAll('.category-class-item').boundingClientRect((rects) => {
          if (!rects.length) {
            setTimeout(() => {
              this.getMenuItemTop()
            }, 10)
            return
          }
          rects.forEach((rect) => {
            this.arr.push(rect.top - rects[0].top)
            resolve()
          })
        }).exec()
      })
    },
    async rightScroll(e) {
      this.oldScrollTop = e.detail.scrollTop
      if (this.arr.length === 0) {
        await this.getMenuItemTop()
      }
      if (this.timer) return
      if (!this.menuHeight) {
        await this.getElRect('menu-scroll-view', 'menuHeight')
      }
      setTimeout(() => {
        this.timer = null
        let scrollHeight = e.detail.scrollTop + this.menuHeight / 2
        for (let i = 0; i < this.arr.length; i++) {
          let height1 = this.arr[i]
          let height2 = this.arr[i + 1]
          if (!height2 || scrollHeight >= height1 && scrollHeight < height2) {
            this.leftMenuStatus(i)
            return
          }
        }
      }, 10)
    }
  }
}
</script>

<style lang="scss">
page{
  background-color: $page-color-base;
}

.category-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh);

  .category-nav-search {
    display: flex;
    flex: 1;
    align-items: center;
    margin: 0 20rpx;
  }

  .category-menu-wrap {
    display: flex;
    flex: 1;
    overflow: hidden;

    .category-tab-item {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 110rpx;
      font-size: 26rpx;
      font-weight: 400;
      line-height: 1;
      color: #444;
      background: #f6f6f6;
    }

    .category-tab-view {
      width: 200rpx;
      height: 100%;
    }

    .category-tab-item-active {
      position: relative;
      font-size: 30rpx;
      font-weight: 600;
      color: #000;
      background: #fff;
    }

    .category-tab-item-active::before {
      position: absolute;
      top: 39rpx;
      left: 0;
      height: 32rpx;
      content: "";
      border-left: 4px solid $uni-color-primary;
    }

    .category-right-box {
      background-color: rgb(250, 250, 250);

      .category-page-view {
        padding: 16rpx;

        .category-class-item {
          padding: 16rpx;
          margin-bottom: 30rpx;
          background-color: #fff;
          border-radius: 8rpx;
        }

        .category-class-item:last-child {
          min-height: 100vh;
        }

        .category-item-title {
          font-size: 26rpx;
          font-weight: bold;
          color: $u-main-color;
        }

        .category-item-menu-name {
          font-size: 24rpx;
          font-weight: normal;
          color: $u-main-color;
        }

        .category-item-container {
          display: flex;
          flex-wrap: wrap;
        }

        .category-thumb-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 33.333333%;
          margin-top: 20rpx;
        }

        .category-item-menu-image {
          width: 120rpx;
          height: 120rpx;
        }
      }
    }
  }
}
</style>
