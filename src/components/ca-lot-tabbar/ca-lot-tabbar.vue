<template>
  <view class="uni-goods-nav">
    <view class="uni-tab__seat"/>
    <view class="uni-tab__cart-box flex">
      <view class="flex uni-tab__cart-sub-left">
        <view class="flex uni-tab__cart-button-left uni-tab__shop-cart">
          <slot/>
        </view>
      </view>
      <view :class="{'uni-tab__right':fill}" class="flex uni-tab__cart-sub-right ">
        <view v-if="isParticipate" @click="bidOnClick"
              :style="{backgroundColor:bid.backgroundColor,color:bid.color}" class="flex uni-tab__cart-button-right">
          <text :style="{color:bid.color}" class="uni-tab__cart-button-right-text">{{ bid.text }}</text>
        </view>
        <view v-else @click="participateOnClick"
              :style="{backgroundColor:participate.backgroundColor,color:participate.color}"
              class="flex uni-tab__cart-button-right">
          <text :style="{color:participate.color}" class="uni-tab__cart-button-right-text">{{ participate.text }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ca-lot-tabbar',
  props: {
    fill: {
      type: Boolean,
      default: false
    },
    isParticipate: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      participate: {
        text: '立即参拍',
        backgroundColor: '#ffa200',
        color: '#ffffff'
      },
      bid: {
        text: '出价',
        backgroundColor: '#ff0000',
        color: '#ffffff'
      }
    }
  },
  methods: {
    bidOnClick() {
      this.$emit('bidOnClick')
    },
    participateOnClick() {
      this.$emit('participateOnClick')
    }
  }
}
</script>

<style scoped>
.flex {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}

.uni-goods-nav {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex: 1;
  flex-direction: row;
}

.uni-tab__cart-box {
  flex: 1;
  height: 8vh;
  background-color: #fff;
  z-index: 900;
}

.uni-tab__cart-sub-left {
  padding: 0 10px;
}

.uni-tab__cart-sub-right {
  flex: 1;
}

.uni-tab__right {
  margin: 5px 10px 5px 0;
  border-radius: 100px;
  overflow: hidden;
}

.uni-tab__cart-button-left {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  position: relative;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 0 10px;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.uni-tab__cart-button-right {
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  flex: 1;
  justify-content: center;
  align-items: center;
  /* #ifdef H5 */
  cursor: pointer;
  /* #endif */
}

.uni-tab__cart-button-right-text {
  font-size: 14px;
  color: #fff;
}

.uni-tab__cart-button-right:active {
  opacity: 0.7;
}
</style>
