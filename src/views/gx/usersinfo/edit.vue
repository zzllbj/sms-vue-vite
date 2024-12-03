<template>
  <component is="a-modal" v-model:visible="visible" :width="600" :title="title" :mask-closable="false"
    :ok-loading="loading" @cancel="close" @before-ok="submit">
    <!-- 表单信息 start -->
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item label="姓名" field="name">
        <a-input v-model="formData.name" placeholder="请输入姓名" />
      </a-form-item>
      <a-form-item label="性别" field="sex">
        <sa-select v-model="formData.sex" dict="sex" placeholder="请选择性别" allow-clear />
      </a-form-item>
      <a-form-item label="电话" field="tel">
        <a-input v-model="formData.tel" placeholder="请输入电话" />
      </a-form-item>
      <a-form-item label="证书" field="cert">
        <sa-checkbox v-model="formData.cert" dict="" />
      </a-form-item>
      <a-form-item label="专业" field="professional">
        <sa-select v-model="formData.professional" dict="profession" placeholder="请选择专业" allow-clear />
      </a-form-item>
      <a-form-item label="职称" field="jobtitle">
        <sa-select v-model="formData.jobtitle" dict="occupation" placeholder="请选择职称" allow-clear />
      </a-form-item>
      <a-form-item label="学历" field="educated">
        <sa-select v-model="formData.educated" dict="degree" placeholder="请选择学历" allow-clear />
      </a-form-item>
      <a-form-item label="类型" field="type">
        <sa-select v-model="formData.type" dict="establishment" placeholder="请选择类型" allow-clear />
      </a-form-item>
      <a-form-item label="部门" field="department">
        <a-tree-select v-model="formData.department" :data="deptData" :field-names="{ key: 'value', title: 'label' }"
          placeholder="请选择所属部门" allow-clear />
      </a-form-item>
      <a-form-item label="破壳日" field="born_date">
        <a-date-picker v-model="formData.born_date" :show-time="false" mode="date" placeholder="请选择破壳日" />
      </a-form-item>
    </a-form>
    <!-- 表单信息 end -->
  </component>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import api from '../api/usersinfo'
import commonApi from '@/api/common'

const emit = defineEmits(['success'])
// 引用定义
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const mode = ref('')
const deptData = ref([])

let title = computed(() => {
  return '人员信息' + (mode.value == 'add' ? '-新增' : '-编辑')
})

// 表单信息
const formData = reactive({
  id: null,
  name: '',
  sex: 1,
  tel: '',
  cert: '',
  professional: null,
  jobtitle: null,
  educated: null,
  type: null,
  department: 1,
  born_date: '',
})

// 验证规则
const rules = {
  name: [{ required: true, message: '姓名必需填写' }],
  tel: [{ required: true, message: '手机号必须填写且不能重复使用相同的号码' }],
  born_date: [{ required: true, message: '因动态计算年龄，需填写出生日期' }],
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
  const departmentData = await commonApi.commonGet('/core/dept/index?tree=true&filter=false')
  deptData.value = departmentData.data
}

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
