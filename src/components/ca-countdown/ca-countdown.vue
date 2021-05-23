<template>
	<view class="uni-countdown">
		<text v-if="showDay" :style="{ fontSize: fontSize, borderColor: borderColor, color: color, backgroundColor: backgroundColor, justifyContent: 'flex-end', padding: '0 10rpx', width: 'auto' }" class="uni-countdown__number">{{ d }}</text>
		<text v-if="showDay" :style="{ fontSize: fontSize, color: splitorColor }" class="uni-countdown__splitor">天</text>
		<text :style="{ fontSize: fontSize, borderColor: borderColor, color: color, backgroundColor: backgroundColor }" class="uni-countdown__number">{{ h }}</text>
		<text :style="{ fontSize: fontSize, color: splitorColor }" class="uni-countdown__splitor">{{ showColon ? ':' : '时' }}</text>
		<text :style="{ fontSize: fontSize, borderColor: borderColor, color: color, backgroundColor: backgroundColor }" class="uni-countdown__number">{{ i }}</text>
		<text :style="{ fontSize: fontSize, color: splitorColor }" class="uni-countdown__splitor">{{ showColon ? ':' : '分' }}</text>
		<text :style="{ fontSize: fontSize, borderColor: borderColor, color: color, backgroundColor: backgroundColor }" class="uni-countdown__number">{{ s }}</text>
		<text v-if="!showColon" :style="{ fontSize: fontSize, color: splitorColor }" class="uni-countdown__splitor">秒</text>
	</view>
</template>
<script>
export default {
  name: 'ca-countdown',
  props: {
    showDay: {
      type: Boolean,
      default: true
    },
    showColon: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: 'rgba(255,255,255,0)'
    },
    borderColor: {
      type: String,
      default: '#FFFFFF'
    },
    color: {
      type: String,
      default: '#FFFFFF'
    },
    splitorColor: {
      type: String,
      default: '#FFFFFF'
    },
    fontSize: {
      type: Number,
      default: 16
    },
    day: {
      type: Number,
      default: 0
    },
    hour: {
      type: Number,
      default: 0
    },
    minute: {
      type: Number,
      default: 0
    },
    second: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      timer: null,
      syncFlag: false,
      d: '00',
      h: '00',
      i: '00',
      s: '00',
      leftTime: 0,
      seconds: 0,
      timestamp: 0
    }
  },
  watch: {
    day() {
      this.changeFlag()
    },
    hour() {
      this.changeFlag()
    },
    minute() {
      this.changeFlag()
    },
    second() {
      this.changeFlag()
    }
  },
  created: function () {
    this.timestamp = this.second
    this.startData()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    toSeconds(timestamp, day, hours, minutes, seconds) {
      if (timestamp) {
        return timestamp - Math.round(new Date().getTime() / 1000)
      }
      return day * 60 * 60 * 24 + hours * 60 * 60 + minutes * 60 + seconds
    },
    timeUp() {
      clearInterval(this.timer)
      this.$emit('timeup')
    },
    countDown() {
      let seconds = this.seconds
      let [day, hour, minute, second] = [0, 0, 0, 0]
      if (seconds > 0) {
        day = Math.floor(seconds / (60 * 60 * 24))
        hour = Math.floor(seconds / (60 * 60)) - (day * 24)
        minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
        second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
      } else {
        this.timeUp()
      }
      if (day < 10) {
        day = '0' + day
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (minute < 10) {
        minute = '0' + minute
      }
      if (second < 10) {
        second = '0' + second
      }
      this.d = day
      this.h = hour
      this.i = minute
      this.s = second
    },
    startData() {
      this.seconds = this.toSeconds(this.timestamp, this.day, this.hour, this.minute, this.second)
      if (this.seconds <= 0) {
        return
      }
      this.countDown()
      this.timer = setInterval(() => {
        this.seconds--
        if (this.seconds < 0) {
          this.timeUp()
          return
        }
        this.countDown()
      }, 1000)
    },
    changeFlag() {
      if (!this.syncFlag) {
        this.seconds = this.toSeconds(this.timestamp, this.day, this.hour, this.minute, this.second)
        this.startData()
        this.syncFlag = true
      }
    },
    setTime(time) {
      clearInterval(this.timer)
      this.timestamp = time
      this.startData()
    }
  }
}
</script>
<style scoped>
  .uni-countdown {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 2rpx 0;
  }

  .uni-countdown__splitor {
    display: flex;
    justify-content: center;
    padding: 5rpx;
    line-height: 48rpx;
  }

  .uni-countdown__number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52rpx;
    height: 48rpx;
    margin: 5rpx;
    line-height: 48rpx;
    text-align: center;
    border-radius: 5px;
  }
</style>
