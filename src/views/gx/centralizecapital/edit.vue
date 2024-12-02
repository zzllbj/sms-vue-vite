<template>
  <component is="a-modal" v-model:visible="visible" :width="600" :title="title" :mask-closable="false"
    :ok-loading="loading" @cancel="close" @before-ok="submit">
    <!-- 表单信息 start -->
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item label="课题名称" field="name_id">
        <a-select v-model="formData.name_id" :options="projectnames" placeholder="请选择课题名称" allow-clear />
      </a-form-item>
      <a-form-item label="归集时间" field="centralize_date">
        <a-date-picker v-model="formData.centralize_date" :show-time="false" mode="date" placeholder="请选择归集时间" />
      </a-form-item>
      <a-form-item label="人员费" field="user_fee">
        <a-input v-model="formData.user_fee" placeholder="请输入人员费" :max-length="11" allow-clear show-word-limit >
          <template #append>
            元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="材料费" field="material_fee">
        <a-input v-model="formData.material_fee" placeholder="请输入材料费" :max-length="11" allow-clear show-word-limit>
          <template #append>
            元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="其它费" field="other_fee">
        <a-input v-model="formData.other_fee" placeholder="请输入其它费" :max-length="11" allow-clear show-word-limit>
          <template #append>
            元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="审核状态" field="audit_status">
        <sa-select v-model="formData.audit_status" dict="audit_status" placeholder="请选择审核状态" allow-clear />
      </a-form-item>
      <a-form-item label="记录人" field="record_user">
        <a-input v-model="formData.record_user" placeholder="请输入记录人" />
      </a-form-item>
    </a-form>
    <!-- 表单信息 end -->
  </component>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import api from '../api/centralizecapital'
import commonApi from '@/api/common'

const emit = defineEmits(['success'])
// 引用定义
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const mode = ref('')
const projectnames = ref([])

let title = computed(() => {
  return '资金归集' + (mode.value == 'add' ? '-新增' : '-编辑')
})

// 表单信息
const formData = reactive({
  id: null,
  name_id: null,
  centralize_date: '',
  user_fee: '',
  material_fee: '',
  other_fee: '',
  audit_status: '',
  record_user: null,
})

// 验证规则
const rules = {
  name_id: [{ required: true, message: '课题名称必需填写' }],
}

// 打开弹框
const open = async (type = 'add') => {
  mode.value = type
  visible.value = true
  formRef.value.resetFields()
  await initPage()
}

// 初始化页面数据
const initPage = async () => {
  const projectgetData = await commonApi.commonGet('/gx/ProjectsInfo/index')
  projectnames.value = projectgetData.data.data.map((item) => ({
    value: item.id,
    label: item.name
  }));
}

// 设置数据
const setFormData = async (data) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      formData[key] = data[key]
    }
  }
  console.info(formData.user_fee)
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
