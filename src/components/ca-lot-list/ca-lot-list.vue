<template>
  <view class="ca-list">
    <view class="ca-list-row" @tap.stop="click">
      <view class="ca-list-left">
        <text>{{ title }}</text>
      </view>
      <view class="ca-list-mid">
        <slot name="content" v-if="!isEmpty"></slot>
        <view class="ca-list-empty" v-else>
          {{ empty }}
        </view>
      </view>
      <text v-if="isArrow" class="iconfont iconyou"></text>
    </view>
    <slot name="popup"></slot>
  </view>
</template>

<script>
export default {
  name: 'ca-lot-list',
  props: {
    title: {
      type: String,
      default: ''
    },
    empty: {
      type: String,
      default: ''
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    isArrow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.ca-list {
  font-size: 26rpx;
  color: #606266;
  background: #fff;

  .ca-list-row {
    position: relative;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;

    .ca-list-left {
      padding-right: 30rpx;
      width: 200rpx;
    }

    .ca-list-mid {
      flex: 1;
    }

    .ca-list-empty {
      font-size: 28rpx;
    }

    &:after {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 3;
      height: 0;
      content: '';
      border-bottom: 1px solid #E4E7ED;
      transform: scaleY(.5);
    }
  }
}
</style>
