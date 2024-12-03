<template>
  <component
    is="a-modal"
    v-model:visible="visible"
    :width="600"
    :title="title"
    :mask-closable="false"
    :ok-loading="loading"
    @cancel="close"
    @before-ok="submit">
    <!-- 表单信息 start -->
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item label="成果名称" field="name">
        <a-input v-model="formData.name" placeholder="请输入成果名称" />
      </a-form-item>
      <a-form-item label="成果类型" field="class">
        <sa-select v-model="formData.class" dict="results_type" placeholder="请选择成果类型" allow-clear />
      </a-form-item>
      <a-form-item label="发明人" field="invention_user">
        <a-input v-model="formData.invention_user" placeholder="请输入发明人" />
      </a-form-item>
      <a-form-item label="专利号" field="patent_number">
        <a-input v-model="formData.patent_number" placeholder="请输入专利号" />
      </a-form-item>
      <a-form-item label="登记号" field="registration_code">
        <a-input v-model="formData.registration_code" placeholder="请输入登记号" />
      </a-form-item>
      <a-form-item label="授权人" field="licensor_user">
        <a-input v-model="formData.licensor_user" placeholder="请输入授权人" />
      </a-form-item>
      <a-form-item label="申请日期" field="apply_date">
        <a-date-picker v-model="formData.apply_date" :show-time="false" mode="date" placeholder="请选择申请日期" />
      </a-form-item>
      <a-form-item label="公告日期" field="public_date">
        <a-date-picker v-model="formData.public_date" :show-time="false" mode="date" placeholder="请选择公告日期" />
      </a-form-item>
      <a-form-item label="公告号" field="public_number">
        <a-input v-model="formData.public_number" placeholder="请输入公告号" />
      </a-form-item>
      <a-form-item label="状态" field="status">
        <sa-select v-model="formData.status" dict="data_status" placeholder="请选择状态" allow-clear />
      </a-form-item>
      <a-form-item label="附件图片" field="attachment">
        <sa-upload-file v-model="formData.attachment" :limit="3" :multiple="false" />
      </a-form-item>
    </a-form>
    <!-- 表单信息 end -->
  </component>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import api from '../api/resulttotal'

const emit = defineEmits(['success'])
// 引用定义
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const mode = ref('')

let title = computed(() => {
  return '成果管理' + (mode.value == 'add' ? '-新增' : '-编辑')
})

// 表单信息
const formData = reactive({
  id: null,
  name: '',
  class: null,
  invention_user: '',
  patent_number: '',
  registration_code: '',
  licensor_user: '',
  apply_date: '',
  public_date: '',
  public_number: null,
  status: null,
  attachment: '',
})

// 验证规则
const rules = {
  name: [{ required: true, message: '成果名称必需填写' }],
}

// 打开弹框
const open = async (type = 'add') => {
  mode.value = type
  visible.value = true
  formRef.value.resetFields()
  await initPage()
}

// 初始化页面数据
const initPage = async () => {}

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
