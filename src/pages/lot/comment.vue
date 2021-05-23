<template>
  <view class="comment-container">
    <view v-if="commentList.length > 0" class="comment-list">
      <view class="comment-content" v-for="(item, index) in commentList" :key="index">
        <view class="comment-content-left">
          <image :src="item.account.avatar" mode="aspectFill"></image>
        </view>
        <view class="comment-content-right">
          <view class="comment-top">
            <view class="comment-username">{{ item.account.username }}</view>
          </view>
          <view class="comment-text">{{ item.text }}</view>
          <view class="comment-bottom">{{ item.commentTime | timeFormat('yyyy-mm-dd hh:MM') }}</view>
        </view>
      </view>
    </view>
    <view v-else class="u-flex-col u-flex-1">
      <u-empty text="当前拍卖品没有评论" mode="message"></u-empty>
    </view>
    <view class="comment-add-btn-bg">
      <view class="comment-add-btn">
        <u-icon name="chat" color="#c0c4cc"></u-icon>
        <label for="input">
          <input id="input" v-model="value" type="text" placeholder="快来发表评论吧~"/>
        </label>
      </view>
      <u-button size="medium" shape="circle" type="success" :custom-style="{marginLeft:'20rpx',width:'10vw'}" @click="comment">发表</u-button>
    </view>
    <u-modal v-model="show" :content="content" @confirm="navTo(`/pages/login/login?redirectUrl=/pages/lot/comment?lotId=${lotId}`)"></u-modal>
    <u-toast ref="toast"/>
    <ca-loading :active="loading" is-full-screen></ca-loading>
  </view>
</template>

<script>
import CaLoading from '@/components/ca-loading/ca-loading'
import uButton from 'uview-ui/components/u-button/u-button'
import uEmpty from 'uview-ui/components/u-empty/u-empty'
import uIcon from 'uview-ui/components/u-icon/u-icon'
import uModal from 'uview-ui/components/u-modal/u-modal'
import uToast from 'uview-ui/components/u-toast/u-toast'

export default {
  components: {
    CaLoading,
    uButton,
    uEmpty,
    uIcon,
    uModal,
    uToast
  },
  data() {
    return {
      loading: true,
      value: '',
      lotId: Number,
      show: false,
      content: '',
      commentList: [
        {
          id: 0,
          text: '',
          account: {
            username: '',
            avatar: this.$asset.userEmptyAvatar
          },
          commentTime: ''
        }
      ]
    }
  },
  onLoad(options) {
    this.lotId = options.lotId
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$api.lot.getComment(this.lotId).then(res => {
        this.commentList = res.data
        this.loading = false
      })
    },
    comment() {
      if (this.$u.test.empty(this.value)) {
        this.$refs.toast.show({ title: '内容不能为空', type: 'error', })
        this.value = ''
      } else {
        this.$api.lot.addComment(this.lotId, { text: this.value }).then(res => {
          this.$refs.toast.show({ title: '发表成功', type: 'success', })
          this.value = ''
          this.commentList = res.data
        }).catch(err => {
          if (err.code === 5) {
            this.content = '登录信息已过期，请重新登录'
            this.show = true
          } else {
            this.content = '您还未登录'
            this.show = true
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: white;
}

.comment-container {
  display: flex;
  height: 100%;

  .comment-list {
    padding-bottom: 120rpx;

    .comment-content {
      display: flex;
      padding: 30rpx;

      .comment-content-left > image {
        width: 64rpx;
        height: 64rpx;
        background-color: #f2f2f2;
        border-radius: 50%;
      }

      .comment-content-right {
        flex: 1;
        padding-left: 20rpx;
        font-size: 30rpx;

        .comment-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10rpx;

          .comment-username {
            font-weight: bold;
          }
        }

        .comment-text {
          margin-bottom: 10rpx;
        }

        .comment-bottom {
          display: flex;
          margin-top: 20rpx;
          font-size: 24rpx;
          color: #9a9a9a;
        }
      }
    }
  }

  .comment-add-btn-bg {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100rpx;
    padding: 0 20rpx;
    background: white;
    box-shadow: 0px -4px 4px -4px rgba(96, 98, 102, 0.2);

    .comment-add-btn {
      display: flex;
      width: 100%;
      padding: 0 20rpx;
      background-color: #f2f2f2;
      border-radius: 100rpx;

      #input {
        width: 100%;
        height: 70rpx;
        padding-left: 10rpx;
        font-size: 26rpx;
        background-color: #f2f2f2;
      }
    }
  }
}
</style>
