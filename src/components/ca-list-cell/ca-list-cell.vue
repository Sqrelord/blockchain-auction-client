<template>
  <view class="content">
    <view
        class="mix-list-cell b-b"
        @tap="click"
        hover-class="cell-hover"
        :hover-stay-time="50"
    >
      <view
          v-if="icon"
          class="iconfont cell-icon"
          :style="{ color: iconColor }"
          :class="icon"
      ></view>
      <text class="cell-tit clamp">{{ title }}</text>
      <text v-if="tips" class="cell-tip">{{ tips }}</text>
      <text class="cell-more iconfont" :class="typeList[navigateType]"></text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ca-list-cell',
  data() {
    return {
      typeList: {
        left: 'iconzuo',
        right: 'iconyou',
        up: 'iconshang',
        down: 'iconxia',
        none: ''
      }
    }
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '标题'
    },
    tips: {
      type: String,
      default: ''
    },
    navigateType: {
      type: String,
      default: 'right'
    },
    border: {
      type: String,
      default: 'b-b'
    },
    hoverClass: {
      type: String,
      default: 'cell-hover'
    },
    iconColor: {
      type: String,
      default: '#333'
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.icon .mix-list-cell.b-b:after {
  left: 90rpx;
}

.mix-list-cell {
  position: relative;
  display: flex;
  align-items: baseline;
  padding: 20rpx 30rpx;
  line-height: 60rpx;

  &.cell-hover {
    background: #fafafa;
  }

  &.b-b:after {
    right: 30rpx;
    left: 30rpx;
  }

  .cell-icon {
    align-self: center;
    width: 56rpx;
    max-height: 60rpx;
    font-size: 38rpx;
  }

  .cell-more {
    align-self: center;
    margin-left: 10px;
    font-size: 30rpx;
    color: #606266;
  }

  .cell-tit {
    flex: 1;
    margin-right: 10rpx;
    font-size: 28rpx;
    color: #303133;
  }

  .cell-tip {
    font-size: 26rpx;
  }
}
</style>
