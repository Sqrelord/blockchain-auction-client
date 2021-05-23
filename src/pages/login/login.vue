<template>
  <view class="login-container">
    <view>
      <u-navbar
          :is-fixed="false"
          :border-bottom="false"
          :back-icon-color="'#fff'"
          :background="{backgroundColor:themeColor}"
      ></u-navbar>
      <view class="login-background">
        <view id="title">欢迎登录</view>
      </view>
      <view class="login-content">
        <view v-if="loginType === 'captcha'">
          <u-form class="login-form login-form-captcha" :model="captchaForm" ref="loginForm" :error-type="['message']">
            <u-icon v-if="isCaptchaSent" :margin-left="20" :label-color="'#909399'" :color="'#909399'" name="arrow-left" label="重新填写手机号" @click="resetCaptcha"></u-icon>
            <u-form-item v-if="isCaptchaSent" :border-bottom="false">
              <u-message-input :value="captchaForm.captcha" mode="bottomLine" :maxlength="6" :width="70" :focus="true" :bold="false" :font-size="40" @finish="toCaptchaLogin"></u-message-input>
            </u-form-item>
            <u-form-item v-else prop="phone" label-width="0">
              <u-input v-model="captchaForm.phone" placeholder="请输入手机号" :custom-style="{fontSize:'30rpx'}" type="number"></u-input>
            </u-form-item>
          </u-form>
          <view class="login-action">
            <view class="u-p-b-20 u-tips-color u-font-sm">未注册的手机号验证后自动创建账号</view>
            <u-button type="warning" @click="getCaptcha" :disabled="btnCaptchaDisabled">
              <u-verification-code seconds="60" ref="captcha" @change="val => btnCaptchaValue = val" @end="onCaptchaEnd"></u-verification-code>
              <u-loading mode="flower" :show="btnCaptchaLoading"></u-loading>
              <text class="u-p-l-10">{{ btnCaptchaValue }}</text>
            </u-button>
          </view>
        </view>
        <view v-if="loginType === 'password'">
          <u-form class="login-form" :model="passwordForm" ref="loginForm" :error-type="['message']">
            <u-form-item prop="username" left-icon="account" :label-width="40">
              <u-input v-model="passwordForm.username" placeholder="请输入用户名" :custom-style="{fontSize:'30rpx'}"></u-input>
            </u-form-item>
            <u-form-item prop="password" left-icon="lock" :label-width="40">
              <u-input v-model="passwordForm.password" placeholder="请输入密码" :custom-style="{fontSize:'30rpx'}" type="password" :password-icon="true"/>
            </u-form-item>
          </u-form>
          <view class="login-action">
            <u-button type="warning" @click="toPasswordLogin" :disabled="btnPasswordDisabled">
              <u-loading mode="flower" :show="btnPasswordLoading"></u-loading>
              <text class="u-p-l-10">{{ btnPasswordValue }}</text>
            </u-button>
          </view>
        </view>
        <view>
          <view class="login-content-action">
            <text @tap="changeLoginType">{{ loginTypeAction }}</text>
            <text>遇到问题</text>
          </view>
        </view>
      </view>
    </view>
    <view class="login-foot">
      <!--  #ifdef MP-WEIXIN  -->
      <view class="weixin-login">
        <button open-type="getUserInfo" @getuserinfo="toWeixinLogin" @click="onWeixinLoginClick">
          <u-icon size="70" name="weixin-fill" color="rgb(83,194,64)"></u-icon>
        </button>
        <text class="u-tips-color u-font-sm">微信登录</text>
      </view>
      <!--  #endif  -->
      <view class="login-hint">
        登录代表同意<text id="link">用户协议、隐私政策，</text>并授权使用您的账号信息（如昵称、头像、收货地址）以便统一管理
      </view>
      <view>
        <u-toast ref="toast"/>
        <u-modal v-model="modal" content="暂不支持小程序外使用微信登录"></u-modal>
      </view>
    </view>
  </view>
</template>

<script>
import uButton from 'uview-ui/components/u-button/u-button'
import uForm from 'uview-ui/components/u-form/u-form'
import uFormItem from 'uview-ui/components/u-form-item/u-form-item'
import uIcon from 'uview-ui/components/u-icon/u-icon'
import uInput from 'uview-ui/components/u-input/u-input'
import uLoading from 'uview-ui/components/u-loading/u-loading'
import uMessageInput from 'uview-ui/components/u-message-input/u-message-input'
import uModal from 'uview-ui/components/u-modal/u-modal'
import uNavbar from 'uview-ui/components/u-navbar/u-navbar'
import uToast from 'uview-ui/components/u-toast/u-toast'
import uVerificationCode from 'uview-ui/components/u-verification-code/u-verification-code'

export default {
  name: 'login',
  components: {
    uButton,
    uForm,
    uFormItem,
    uIcon,
    uInput,
    uLoading,
    uMessageInput,
    uModal,
    uNavbar,
    uToast,
    uVerificationCode
  },
  data() {
    return {
      loginType: 'captcha',
      loginTypeAction: '账号密码登录',
      btnCaptchaValue: '获取短信验证码',
      btnPasswordValue: '登录',
      btnPasswordLoading: false,
      btnPasswordDisabled: false,
      btnCaptchaLoading: false,
      btnCaptchaDisabled: false,
      isCaptchaSent: false,
      captchaForm: {
        phone: '17621505949',
        captcha: ''
      },
      passwordForm: {
        username: 'admin',
        password: '123456'
      },
      modal: false,
      rules: {
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['blur', 'change']
          },
          {
            validator: (rule, value) => {
              return this.$u.test.mobile(value)
            },
            message: '手机号不正确',
            trigger: ['blur']
          }
        ],
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: ['blur', 'change']
          }
        ],
      }
    }
  },
  onReady() {
    this.$refs.loginForm.setRules(this.rules)
  },
  onLoad(options){
    this.redirectUrl = options.redirectUrl
  },
  onShow() {
    if (uni.getStorageSync('token')) {
      this.$routers.reLaunch({ route: '/pages/home/home' })
    }
  },
  methods: {
    toPasswordLogin() {
      function btnPasswordReset() {
        this.btnPasswordValue = '登录'
        this.btnPasswordLoading = false
        this.btnPasswordDisabled = false
      }

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.btnPasswordValue = '正在登录'
          this.btnPasswordLoading = true
          this.btnPasswordDisabled = true
          this.$api.user.login({
            username: this.passwordForm.username,
            password: this.passwordForm.password
          }).then(res => {
            this.btnPasswordLoading = false
            this.btnPasswordValue = '登陆成功，即将跳转登陆前页面'
            this.$store.commit('login', res.data)
            this.$refs.toast.show({ title: '登录成功', type: 'success' })
            setTimeout(() => {
              if (this.redirectUrl) {
                this.$routers.back(this.redirectUrl)
              } else {
                this.$routers.reLaunch('/pages/user/user')
              }
            }, 1500)
          }).catch(err => {
            this.$refs.toast.show({ title: `登录失败 : ${err.msg}`, type: 'error' })
            btnPasswordReset.call(this)
          })
        }
      })
    },
    toCaptchaLogin(captcha) {
      uni.showLoading({ title: '登陆中' })
      this.$api.user.captchaLogin(this.captchaForm.phone, captcha).then(res => {
        this.$store.commit('login', res.data)
        this.$refs.toast.show({ title: '登录成功', type: 'success' })
        uni.hideLoading()
        setTimeout(() => {
          if (this.redirectUrl) {
            this.$routers.back(this.redirectUrl)
          } else {
            this.$routers.reLaunch('/pages/user/user')
          }
        }, 1500)
      }).catch(err => {
        this.$refs.toast.show({ title: `登录失败 : ${err.msg}`, type: 'error' })
        uni.hideLoading()
      })
    },
    toWeixinLogin(res) {
      if (res.detail.errMsg === 'getUserInfo:ok') {
        let info = res.detail.userInfo
        console.log(info)
        let userInfo = {}
        userInfo.username = info.nickName
        userInfo.avatar = info.avatarUrl
        uni.showLoading({ title: '登陆中' })
        this.$api.user.wxLogin(userInfo).then(res => {
          this.$store.commit('login', res.data)
          this.$refs.toast.show({ title: '登录成功', type: 'success' })
          uni.hideLoading()
          setTimeout(() => {
            if (this.redirectUrl) {
              this.$routers.back(this.redirectUrl)
            } else {
              this.$routers.reLaunch('/pages/user/user')
            }
          }, 1500)
        }).catch(err => {
          this.$refs.toast.show({ title: `登录失败 : ${err.msg}`, type: 'error' })
          uni.hideLoading()
        })
      }
    },
    onWeixinLoginClick() {
      // #ifndef MP-WEIXIN
      this.modal = true
      // #endif
    },
    getCaptcha() {
      this.$refs.loginForm.validate(valid => {
        if (valid && this.$refs.captcha.canGetCode) {
          this.btnCaptchaLoading = true
          this.btnCaptchaDisabled = true
          this.btnCaptchaValue = '验证码发送中'
          this.$api.user.getCaptcha(this.captchaForm.phone).then(() => {
            this.$refs.toast.show({ title: '验证码已发送', type: 'success', })
            this.btnCaptchaLoading = false
            this.isCaptchaSent = true
            this.$refs.captcha.start()
          }).catch(() => {
            this.$refs.toast.show({ title: '验证码发送失败', type: 'error', })
            this.btnCaptchaLoading = false
            this.isCaptchaSent = true
          })
        }
      })
    },
    resetCaptcha() {
      if (this.$refs.captcha) {
        this.$refs.captcha.reset()
      }
      this.btnCaptchaLoading = false
      this.btnCaptchaDisabled = false
      this.btnCaptchaValue = '获取短信验证码'
      this.isCaptchaSent = false
    },
    onCaptchaEnd() {
      this.btnCaptchaValue = '获取短信验证码'
      this.btnCaptchaDisabled = false
    },
    changeLoginType() {
      this.loginType = this.loginType === 'captcha' ? 'password' : 'captcha'
      this.loginTypeAction = this.loginTypeAction === '账号密码登录' ? '验证码登录' : '账号密码登录'
      this.resetCaptcha()
      this.$refs.loginForm.resetFields()
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: white;
}

.login-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: inherit;
  padding: 0 0 40rpx;

  .login-background {
    height: 30vh;
    background-color: $base-color;

    #title {
      display: flex;
      align-items: flex-start;
      height: inherit;
      padding: 80rpx 70rpx;
      font-size: 60rpx;
      font-weight: 500;
      color: white;
    }
  }

  .login-content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: space-between;
    padding: 50rpx;
    margin: -100rpx 50rpx 50rpx;
    background-color: white;
    border-radius: 30rpx;
    box-shadow: 0 5rpx 10rpx 5rpx rgba(200, 201, 240, 0.6);

    .login-form {
      padding: 50rpx 0 80rpx;
    }

    .login-form-captcha {
      align-items: center;
    }

    // noinspection ALL
    .login-action {
      padding: 100rpx 0 30rpx;
      // #ifdef H5
      padding: 10rpx 0 30rpx;
      // #endif
      text-align: center;
    }

    .login-content-action {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: space-between;
      padding: 30rpx 10rpx 10rpx;
    }
  }

  .login-foot {
    .weixin-login {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 10rpx 0;
      color: $u-content-color;

      button {
        background-color: transparent;
      }

      button::after {
        border: none;
      }
    }

    .login-hint {
      padding: 20rpx 40rpx;
      font-size: 22rpx;
      color: $u-tips-color;

      #link {
        color: $u-type-warning;
      }
    }
  }
}
</style>
