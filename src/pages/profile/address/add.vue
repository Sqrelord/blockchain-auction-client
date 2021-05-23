<template>
  <view class="address-add-container">
    <u-form :model="form" ref="uForm" :error-type="['message']">
      <u-form-item label="收货人" prop="consignee" :label-width="150">
        <u-input v-model="form.consignee" placeholder="请填写收货人姓名"/>
      </u-form-item>
      <u-form-item label="联系电话" prop="phone" :label-width="150">
        <u-input v-model="form.phone" type="number" placeholder="请填写收货人手机号"/>
      </u-form-item>
      <u-form-item label="地区" prop="region" :label-width="150">
        <u-input v-model="form.region" type="select" placeholder="省市区县、乡镇等" @click="pickerShow = true"/>
        <u-picker mode="region" v-model="pickerShow" :default-region="defaultRegion" @confirm="confirmRegion"></u-picker>
      </u-form-item>
      <u-form-item label="详细地址" prop="address" :label-width="150" label-position="top">
        <u-input v-model="form.address" placeholder="街道、楼牌等" type="textarea"/>
      </u-form-item>
      <u-form-item label="设为默认地址" :label-width="300">
        <u-switch slot="right" :size="40" v-model="form.isDefault"></u-switch>
      </u-form-item>
    </u-form>
    <view>
      <u-button type="primary" :custom-style="{width:'100%'}" @click="submit" :disabled="btnDisabled">
        <u-loading mode="flower" :show="btnLoading"></u-loading>
        <text class="u-p-l-10">{{ btnValue }}</text>
      </u-button>
      <u-toast ref="toast"/>
    </view>
  </view>
</template>

<script>
import uButton from 'uview-ui/components/u-button/u-button'
import uForm from 'uview-ui/components/u-form/u-form'
import uFormItem from 'uview-ui/components/u-form-item/u-form-item'
import uInput from 'uview-ui/components/u-input/u-input'
import uLoading from 'uview-ui/components/u-loading/u-loading'
import uPicker from 'uview-ui/components/u-picker/u-picker'
import uSwitch from 'uview-ui/components/u-switch/u-switch'
import uToast from 'uview-ui/components/u-toast/u-toast'

export default {
  components: { uButton, uForm, uFormItem, uInput, uLoading, uPicker, uSwitch, uToast },
  data() {
    return {
      pickerShow: false,
      btnValue: '保存',
      btnDisabled: false,
      btnLoading: false,
      form: {
        id: '',
        consignee: '',
        region: '',
        address: '',
        phone: '',
        isDefault: false
      },
      defaultRegion: [],
      rules: {
        consignee: [
          {
            required: true,
            message: '请输入收货人姓名',
            trigger: ['blur', 'change']
          }, {
            pattern: /^[0-9a-zA-Z\u4e00-\u9fa5]+$/gi,
            transform(value) {
              return String(value)
            },
            message: '只能包含汉字、字母或数字',
            trigger: ['change', 'blur']
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['change', 'blur']
          }, {
            validator: (rule, value) => {
              return this.$u.test.mobile(value)
            },
            message: '手机号码不正确',
            trigger: ['blur']
          }
        ],
        region: [
          {
            required: true,
            message: '请选择地区',
            trigger: ['change', 'blur']
          }
        ],
        address: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  onLoad(options) {
    if (options.address) {
      let data = JSON.parse(options.address)
      let addr = data.address.split(' ')
      this.defaultRegion = [addr[0], addr[1], addr[2]]
      this.form.id = data.id
      this.form.consignee = data.consignee
      this.form.phone = data.phone
      this.form.region = `${addr[0]} ${addr[1]} ${addr[2]}`
      this.form.address = `${addr[3]}`
      this.form.isDefault = data.isDefault
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },
  methods: {
    submit() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          this.btnDisabled = true
          this.btnLoading = true
          this.btnValue = '保存中'
          let criteria = this.generateCriteria()
          this.$api.user.editAddress(criteria).then(() => {
            this.btnDisabled = false
            this.btnLoading = false
            this.btnValue = '确认'
            this.$refs.toast.show({
              title: '修改成功',
              type: 'success',
              duration: 1500,
              back: true
            })
          })
        }
      })
    },
    confirmRegion(region) {
      this.form.region = `${region.province.label} ${region.city.label} ${region.area.label}`
      this.defaultRegion = [region.province.label, region.city.label, region.area.label]
    },
    generateCriteria() {
      let criteria = {}
      criteria.id = this.form.id
      criteria.consignee = this.form.consignee
      criteria.address = `${this.form.region} ${this.form.address}`
      criteria.phone = this.form.phone
      criteria.isDefault = this.form.isDefault
      return criteria
    }
  }
}
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: white;
}

.address-add-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: inherit;
  padding: 20rpx 50rpx 50rpx;
}
</style>
