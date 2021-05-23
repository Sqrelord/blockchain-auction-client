<template>
  <!-- #ifdef H5 -->
  <transition name="fade">
    <!-- #endif -->
    <view class="mask" v-show="isActive" :class="{ 'full-screen': isFullScreen }" :style="{ backgroundColor }">
      <view class="spinner" :style="{ transform:`translate(-50%, -${translateY}%)`}">
        <slot>
          <bounce :color="color" :size="size"/>
        </slot>
        <view v-if="text.length" :style="{ color:textColor }">
          {{ text }}
        </view>
      </view>
    </view>
    <!-- #ifdef H5 -->
  </transition>
  <!-- #endif -->
</template>

<script>
import Bounce from '@/components/ca-loading/loaders/bounce'

export default {
  name: 'ca-loading',
  components: { Bounce, },
  props: {
    active: Boolean,
    translateY: {
      type: Number,
      default: 150
    },
    text: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#fa436a'
    },
    textColor: {
      type: String,
      default: '#333'
    },
    isFullScreen: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: 'rgba(255, 255, 255)'
    },
    size: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      isActive: this.active || false
    }
  },
  watch: {
    active(value) {
      this.isActive = value
    }
  }
}
</script>

<style scoped>
.mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  transition: opacity .3s linear;
}

.full-screen {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
}

/* #ifdef H5 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* #endif */
</style>
