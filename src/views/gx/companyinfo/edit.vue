<template>
  <component is="a-modal" v-model:visible="visible" :width="600" :title="title" :mask-closable="false"
    :ok-loading="loading" @cancel="close" @before-ok="submit">
    <!-- 表单信息 start -->
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item label="单位名称" field="name">
        <a-input v-model="formData.name" placeholder="请输入单位名称" />
      </a-form-item>
      <a-form-item label="统一社会信用代码" field="social_credit_code">
        <a-input v-model="formData.social_credit_code" placeholder="请输入统一社会信用代码" />
      </a-form-item>
      <a-form-item label="注册资金" field="registered_capital">
        <a-input v-model="formData.registered_capital" placeholder="请输入注册资金">
          <template #append>
            万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="法人" field="legal_person">
        <a-input v-model="formData.legal_person" placeholder="请输入法人" />
      </a-form-item>
      <a-form-item label="实缴金额" field="paid_amount">
        <a-input v-model="formData.paid_amount" placeholder="请输入实缴金额">
          <template #append>
            万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="成立日期" field="create_date">
        <a-date-picker v-model="formData.create_date" :show-time="false" mode="date" placeholder="请选择成立日期" />
      </a-form-item>
      <a-form-item label="企业类型" field="enterprise_type">
        <sa-select v-model="formData.enterprise_type" dict="enterprise_type" placeholder="请选择企业类型" allow-clear />
      </a-form-item>
      <a-form-item label="主营业务" field="business_main">
        <a-textarea v-model="formData.business_main" placeholder="请输入主营业务" />
      </a-form-item>
    </a-form>
    <!-- 表单信息 end -->
  </component>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import api from '../api/companyinfo'

const emit = defineEmits(['success'])
// 引用定义
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const mode = ref('')

let title = computed(() => {
  return '单位' + (mode.value == 'add' ? '-新增' : '-编辑')
})

// 表单信息
const formData = reactive({
  id: null,
  name: '',
  social_credit_code: '',
  registered_capital: '',
  legal_person: '',
  paid_amount: '',
  create_date: '',
  enterprise_type: null,
  business_main: '',
})

// 验证规则
const rules = {
  name: [{ required: true, message: '单位名称必需填写' }],
}

// 打开弹框
const open = async (type = 'add') => {
  mode.value = type
  visible.value = true
  formRef.value.resetFields()
  await initPage()
}

// 初始化页面数据
const initPage = async () => { }

// 设置数据
const setFormData = async (data) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      formData[key] = data[key]
    }
  }
}

// 数据保存
const submit = async (done) => {
  const validate = await formRef.value?.validate()
  if (!validate) {
    loading.value = true
    let data = { ...formData }
    let result = {}
    if (mode.value === 'add') {
      // 添加数据
      data.id = undefined
      result = await api.save(data)
    } else {
      // 修改数据
      result = await api.update(data.id, data)
    }
    if (result.code === 200) {
      Message.success('操作成功')
      emit('success')
      done(true)
    }
    // 防止连续点击提交
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
  done(false)
}

// 关闭弹窗
const close = () => (visible.value = false)

defineExpose({ open, setFormData })
</script>

<style scoped>
.reminder-text {
  color: red;
  font-size: 12px;
}
</style>