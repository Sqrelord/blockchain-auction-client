<template>
  <view class="address-container">
    <view v-if="addressList.length > 0">
      <view class="address-item" v-for="(address, index) in addressList" :key="index">
        <view class="address-header">
          <view class="address-info">
            <view id="name">{{ address.consignee }}</view>
            <view id="phone">{{ address.phone }}</view>
            <view id="tag" v-if="address.isDefault">
              <text>默认</text>
            </view>
          </view>
          <u-icon
              name="trash-fill"
              :size="40"
              :color="'#999999'"
              @tap="onDelete(address.id)"
          ></u-icon>
        </view>
        <view class="address-detail">
          {{ address.address }}
          <u-icon
              name="edit-pen"
              :size="40"
              :color="'#999999'"
              @tap="navTo(`/pages/profile/address/add?address=${JSON.stringify(address)}`)"
          ></u-icon>
        </view>
      </view>
    </view>
    <view class="address-empty" v-else>
      <u-empty mode="address" font-size="30"></u-empty>
    </view>
    <view class="address-add-btn-bg">
      <view class="address-add-btn" @tap="navTo(`/pages/profile/address/add`)">
        <view id="add">
          <u-icon id="icon" name="plus" color="#ffffff" :size="30"></u-icon>
          新建收货地址
        </view>
      </view>
    </view>
    <u-modal
        v-model="modal"
        content="确定删除该地址"
        :show-cancel-button="true"
        :async-close="true"
        @confirm="confirmDelete"
    ></u-modal>
    <u-toast ref="toast"/>
  </view>
</template>

<script>
import uEmpty from 'uview-ui/components/u-empty/u-empty'
import uIcon from 'uview-ui/components/u-icon/u-icon'
import uModal from 'uview-ui/components/u-modal/u-modal'
import uToast from 'uview-ui/components/u-toast/u-toast'

export default {
  components: {
    uEmpty,
    uIcon,
    uModal,
    uToast
  },
  data() {
    return {
      modal: false,
      addressList: [],
      deletedId: String
    }
  },
  onLoad() {
    this.fetchData()
  },
  onShow() {
    this.fetchData()
  },
  onPullDownRefresh() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$api.user.getAddress().then(data => {
        this.addressList = data.data
        uni.stopPullDownRefresh()
      })
    },
    onDelete(id) {
      this.deletedId = id.toString()
      this.modal = true
    },
    confirmDelete() {
      this.$api.user.deleteAddress(this.deletedId).then(res => {
        this.deletedId = String
        this.modal = false
        this.addressList = res.data
      }).catch(err => {
        console.error(err)
        this.$refs.toast.show({ title: `服务器错误:${err.msg}`, type: 'error' })
        this.modal = false
      })
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: white;
}

.address-container {
  padding: 20rpx 20rpx 140rpx;

  .address-item {
    padding: 40rpx 20rpx;
    margin-bottom: 20rpx;
    background-color: white;
    border-radius: 40rpx 10rpx;
    box-shadow: 2px 2px 10px $u-type-info-disabled;

    .address-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 34rpx;
      font-weight: bold;

      .address-info {
        display: flex;
        align-items: center;

        #phone {
          margin-left: 60rpx;
        }

        #tag {
          display: flex;
          align-items: center;
          font-weight: normal;

          text {
            display: block;
            width: 60rpx;
            height: 34rpx;
            margin-left: 30rpx;
            font-size: 20rpx;
            line-height: 34rpx;
            color: #ffffff;
            text-align: center;
            background-color: #fa3534;
            border-radius: 6rpx;
          }
        }
      }
    }

    .address-detail {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-top: 40rpx;
      font-size: 28rpx;
      color: #999999;
    }
  }

  .address-empty{
    margin-top: 30vh;
  }

  .address-add-btn-bg {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150rpx;
    background: linear-gradient(rgba(255, 255, 255, 0.65), white);
    box-shadow: 0 0 30px 10px white;
    backdrop-filter: blur(1px);

    .address-add-btn {
      position: fixed;
      bottom: 40rpx;
      left: 80rpx;
      display: flex;
      justify-content: space-around;
      width: 600rpx;
      height: 80rpx;
      font-size: 30rpx;
      line-height: 100rpx;
      background-color: $base-color;
      border-radius: 60rpx;

      #add {
        display: flex;
        align-items: center;
        color: #ffffff;

        #icon {
          margin-right: 10rpx;
        }
      }
    }
  }
}
</style>
