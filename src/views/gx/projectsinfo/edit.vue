<template>
  <component is="a-modal" v-model:visible="visible" :width="800" :title="title" :mask-closable="false"
    :ok-loading="loading" @cancel="close" @before-ok="submit">
    <!-- 表单信息 start -->
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item v-if="showReminder">
        <a-col :span="18">
          <a-alert type="warning" title="警告" center>包含集团管理办法里需要注意的关键词:{{containedKeywords[0].label}}</a-alert>
        </a-col>
      </a-form-item>
      <a-form-item label="课题名称" field="name">
        <a-input v-model="formData.name" placeholder="请输入课题名称" />
      </a-form-item>
      <a-form-item label="开始时间" field="start_date">
        <a-date-picker v-model="formData.start_date" :show-time="false" mode="date" placeholder="请选择开始时间" />
      </a-form-item>
      <a-form-item label="结束时间" field="end_date">
        <a-date-picker v-model="formData.end_date" :show-time="false" mode="date" placeholder="请选择结束时间" />
      </a-form-item>
      <a-form-item label="项目级别" field="project_level">
        <sa-select v-model="formData.project_level" dict="project_level" placeholder="请选择项目级别" allow-clear />
      </a-form-item>
      <a-form-item label="研究领域" field="project_domain">
        <sa-select v-model="formData.project_domain" dict="scientific_domain" placeholder="请选择研究领域" allow-clear />
      </a-form-item>
      <a-form-item label="合作单位" field="cooperate_company">
        <sa-checkbox v-model="formData.cooperate_company" dict="" />
      </a-form-item>
      <a-form-item label="合作模式" field="cooperate_mode">
        <sa-select v-model="formData.cooperate_mode" dict="cooperate" placeholder="请选择合作模式" allow-clear />
      </a-form-item>
      <a-form-item label="步骤节点" field="step">
        <sa-select v-model="formData.step" dict="lifecycle" placeholder="请选择步骤节点" allow-clear />
      </a-form-item>
      <a-form-item label="单位信息" field="company">
        <a-input v-model="formData.company" placeholder="请输入单位信息" />
      </a-form-item>
      <a-form-item label="预算金额" field="amount">
        <a-input-number v-model="formData.amount" placeholder="请输入预算金额" >
          <template #append>
            万元
          </template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="录入人员" field="input_user">
        <a-input v-model="formData.input_user" placeholder="请输入录入人员" />
      </a-form-item>
      <a-form-item label="附件" field="attachment">
        <sa-upload-file v-model="formData.attachment" :limit="3" :multiple="false" />
      </a-form-item>
    </a-form>
    <!-- 表单信息 end -->
  </component>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import api from '../api/projectsinfo'
import commonApi from '@/api/common'

const emit = defineEmits(['success'])
// 引用定义
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const mode = ref('')
const showReminder = ref(false);
const containedKeywords = ref([]); //存储关键词
const keywordsget = ref([])

let title = computed(() => {
  return '项目信息' + (mode.value == 'add' ? '-新增' : '-编辑')
})

// 表单信息
const formData = reactive({
  id: null,
  name: '',
  input_user: null,
  start_date: '',
  end_date: '',
  project_level: null,
  project_domain: null,
  cooperate_company: null,
  cooperate_mode: null,
  step: null,
  company: null,
  amount: null,
  attachment: '',
})

// 验证规则
const rules = {
  name: [{ required: true, message: '课题名称必需填写' }],
  start_date: [{ required: true, message: '开始时间必需填写' }],
  end_date: [{ required: true, message: '结束时间必需填写' }],
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
  const keywords = await commonApi.getDict('Keyword_Warning')
  keywordsget.value = keywords.data
}

//定义过滤关键词
watch(() => formData.name, (newValue) => {
  showReminder.value = false;
  containedKeywords.value = [];
  for (const keyword of keywordsget.value) {
    if (newValue.includes(keyword.label)) {
      showReminder.value = true;
      containedKeywords.value.push(keyword);
    }
  }
});

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
