<template>
  <view class="setting-info-container">
    <view>
      <view class="setting-info-avatar">
        <u-upload
            :action="uploadUrl"
            :header="uploadHeader"
            ref="upload"
            :disabled="type === 'password'"
            :custom-btn="true"
            :auto-upload="false"
            :show-upload-list="false"
            :max-size="5<<20"
            @on-choose-complete="onChooseComplete"
            @on-change="onChange"
        >
          <view slot="addBtn">
            <u-avatar :src="avatar" :size="140"></u-avatar>
          </view>
        </u-upload>
        <u-avatar v-if="type === 'password'" :src="avatar" :size="140"></u-avatar>
      </view>
      <u-form v-if="type === 'info'" :model="infoChangeForm" ref="infoForm" :error-type="['message']">
        <u-form-item label="用户名" prop="username" :label-width="170">
          <u-input v-model="infoChangeForm.username" placeholder="请填写用户名"/>
        </u-form-item>
        <u-form-item label="身份识别码" prop="identifier" :label-width="170">
          <u-input v-model="infoChangeForm.accountIdentifier" class="u-font-8" placeholder="" :disabled="true" :custom-style="{fontSize:'23rpx',color:'#909399'}"/>
        </u-form-item>
        <u-form-item label="邮箱" prop="email" :label-width="170">
          <u-input v-model="infoChangeForm.email" placeholder="请填写邮箱"/>
        </u-form-item>
        <u-form-item label="姓名" prop="realName" :label-width="170">
          <u-input v-model="infoChangeForm.realName" placeholder="请填写姓名"/>
        </u-form-item>
        <u-form-item label="身份证号码" prop="idCard" :label-width="170">
          <u-input v-model="infoChangeForm.idCard" placeholder="请填写身份证号码" type="idcard"/>
        </u-form-item>
      </u-form>
      <u-form v-if="type === 'password'" :model="passwordChangeForm" ref="infoForm" :error-type="['message']">
        <u-form-item label="旧密码" prop="oldPassword" :label-width="130">
          <u-input v-model="passwordChangeForm.oldPassword" placeholder="请输入旧密码" type="password" :password-icon="true"/>
        </u-form-item>
        <u-form-item label="新密码" prop="password" :label-width="130">
          <u-input v-model="passwordChangeForm.password" placeholder="请输入新密码" type="password" :password-icon="true"/>
        </u-form-item>
      </u-form>
    </view>
    <view>
      <u-button type="primary" :custom-style="{width:'100%'}" @click="submit" :disabled="btnDisabled">
        <u-loading mode="flower" :show="btnLoading"></u-loading>
        <text class="u-p-l-10">{{ btnValue }}</text>
      </u-button>
      <u-toast ref="uToast"/>
    </view>
  </view>
</template>

<script>
import { request } from '@/api/request.api'
import uAvatar from 'uview-ui/components/u-avatar/u-avatar'
import uButton from 'uview-ui/components/u-button/u-button'
import uForm from 'uview-ui/components/u-form/u-form'
import uFormItem from 'uview-ui/components/u-form-item/u-form-item'
import uInput from 'uview-ui/components/u-input/u-input'
import uLoading from 'uview-ui/components/u-loading/u-loading'
import uToast from 'uview-ui/components/u-toast/u-toast'
import uUpload from 'uview-ui/components/u-upload/u-upload'

export default {
  components: {
    uAvatar,
    uButton,
    uForm,
    uFormItem,
    uInput,
    uLoading,
    uToast,
    uUpload
  },
  data() {
    return {
      type: 'info',
      btnValue: '保存',
      btnDisabled: false,
      btnLoading: false,
      avatar: '',
      uploadHeader: { token: uni.getStorageSync('token') },
      infoChangeForm: {
        username: '',
        avatar: '',
        accountIdentifier: '',
        email: '',
        realName: '',
        idCard: ''
      },
      passwordChangeForm: {
        oldPassword: '',
        password: '',
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          }
        ],
        oldPassword: [
          {
            required: true,
            message: '请输入旧密码',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '新密码不能为空',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            validator: (rule, value) => {
              if (value) {
                return this.$u.test.email(value)
              } else {
                return true
              }
            },
            message: '电子邮箱不正确',
            trigger: ['blur']
          }
        ],
        idCard: [
          {
            validator: (rule, value) => {
              if (value) {
                return this.$u.test.idCard(value)
              } else {
                return true
              }
            },
            message: '身份证号码不正确',
            trigger: ['blur']
          }
        ]
      }
    }
  },
  onLoad(options) {
    this.type = options.type
    this.infoChangeForm = JSON.parse(options.userInfo)
    this.avatar = this.infoChangeForm.avatar
  },
  onReady() {
    this.$refs.infoForm.setRules(this.rules)
  },
  methods: {
    async submit() {
      if (this.type === 'info') {
        this.$refs.infoForm.validate(async valid => {
          if (valid) {
            this.btnDisabled = true
            this.btnLoading = true
            this.btnValue = '保存中'
            await this.$refs.upload.upload()
          }
        })
      } else if (this.type === 'password') {
        this.changePassword()
      }
    },
    changeUserInfo() {
      this.$api.user.editUserInfo(this.infoChangeForm)
        .then(res => {
          this.$store.commit('userInfo', res.data)
          this.btnDisabled = false
          this.btnLoading = false
          this.btnValue = '确认'
          this.$refs.uToast.show({
            title: '修改成功',
            type: 'success',
            duration: 1000,
            back: true
          })
        })
        .catch(err => {
          this.btnDisabled = false
          this.btnLoading = false
          this.btnValue = '确认'
          this.$refs.uToast.show({ title: err.data, type: 'error' })
        })
    },
    changePassword() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          this.btnDisabled = true
          this.btnLoading = true
          this.btnValue = '保存中'
          this.$api.user.editPassword(this.passwordChangeForm)
            .then(() => {
              this.btnDisabled = false
              this.btnLoading = false
              this.btnValue = '确认'
              this.$refs.uToast.show({
                title: '修改成功',
                type: 'success',
                duration: 1000,
                back: true
              })
            })
            .catch(err => {
              this.btnDisabled = false
              this.btnLoading = false
              this.btnValue = '确认'
              this.$refs.uToast.show({ title: err.data, type: 'error' })
            })
        }
      })
    },
    onChooseComplete(lists){
      lists = [lists[1] ? lists[1] : lists[0]]
      this.avatar = lists[0].url
    },
    onChange(res) {
      res = JSON.parse(res.data)
      if (res.code !== 0) {
        this.$refs.uToast.show({ title: '头像上传失败', type: 'error' })
      } else {
        this.infoChangeForm.avatar = res.data
        this.changeUserInfo()
      }
    }
  },
  computed:{
    uploadUrl() {
      return `${request.config.baseURL}/user/avatar`
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: white;
}

.setting-info-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: inherit;
  padding: 20rpx 50rpx 50rpx;

  .setting-info-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 70rpx 0;
  }
}
</style>
