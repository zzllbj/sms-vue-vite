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
      <a-form-item label="审核人ID" field="auditor_id">
        <a-input v-model="formData.auditor_id" placeholder="请输入审核人ID" />
      </a-form-item>
      <a-form-item label="审核结果" field="audit_result">
        <sa-select v-model="formData.audit_result" dict="upload_mode" placeholder="请选择审核结果" allow-clear />
      </a-form-item>
      <a-form-item label="审核意见" field="audit_comment">
        <a-textarea v-model="formData.audit_comment" placeholder="请输入审核意见" />
      </a-form-item>
      <a-form-item label="备注" field="remark">
        <a-textarea v-model="formData.remark" placeholder="请输入备注" />
      </a-form-item>
    </a-form>
    <!-- 表单信息 end -->
  </component>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import api from '../api/auditrecord'

const emit = defineEmits(['success'])
// 引用定义
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const mode = ref('')

let title = computed(() => {
  return '审核记录表' + (mode.value == 'add' ? '-新增' : '-编辑')
})

// 表单信息
const formData = reactive({
  id: null,
  auditor_id: null,
  audit_result: null,
  audit_comment: '',
  remark: 'NULL',
})

// 验证规则
const rules = {
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
