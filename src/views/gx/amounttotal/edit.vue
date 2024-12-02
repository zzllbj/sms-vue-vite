<template>
  <component is="a-modal" v-model:visible="visible" :width="600" :title="title" :mask-closable="false"
    :ok-loading="loading" @cancel="close" @before-ok="submit">
    <!-- 表单信息 start -->
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item label="项目ID" field="project_id">
        <a-select v-model="formData.project_id" :options="projectnames" placeholder="请选择项目名称" allow-clear />
      </a-form-item>
      <a-form-item field="budget_cost_sum">
        <a-input v-model="formData.budget_cost_sum" placeholder="自动计算" :readonly="true"
        id="total-cost-input">
          <template #append>
            RMB/万元
          </template>
          <template #prepend>
            预算总费用
          </template>
        </a-input>

      </a-form-item>
      <a-form-item label="人员费" field="user_cost">
        <a-input v-model="formData.user_cost" placeholder="请输入人员费">
          <template #append>
            RMB/万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="设备费" field="device_cost">
        <a-input v-model="formData.device_cost" placeholder="请输入设备费">
          <template #append>
            RMB/万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="材料费" field="material_cost">
        <a-input v-model="formData.material_cost" placeholder="请输入材料费">
          <template #append>
            RMB/万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="测试化验加工费" field="test_process_cost">
        <a-input v-model="formData.test_process_cost" placeholder="请输入测试化验加工费">
          <template #append>
            RMB/万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="燃料动力费" field="fuel_power_cost">
        <a-input v-model="formData.fuel_power_cost" placeholder="请输入燃料动力费">
          <template #append>
            RMB/万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="差旅会议合作交流费" field="travel_meet_cost">
        <a-input v-model="formData.travel_meet_cost" placeholder="请输入差旅会议合作交流费">
          <template #append>
            RMB/万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="出版文献知识产权费" field="publish_literature_cost">
        <a-input v-model="formData.publish_literature_cost" placeholder="请输入出版文献知识产权费">
          <template #append>
            RMB/万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="劳务费" field="labor_services_cost">
        <a-input v-model="formData.labor_services_cost" placeholder="请输入劳务费">
          <template #append>
            RMB/万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="专家咨询费用" field="expert_consultation_cost">
        <a-input v-model="formData.expert_consultation_cost" placeholder="请输入专家咨询费用">
          <template #append>
            RMB/万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="其他费用" field="other_cost">
        <a-input v-model="formData.other_cost" placeholder="请输入其他费用">
          <template #append>
            RMB/万元
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="间接费用" field="indirect_cost">
        <a-input v-model="formData.indirect_cost" placeholder="请输入间接费用">
          <template #append>
            RMB/万元
          </template>
        </a-input>
      </a-form-item>
    </a-form>
    <!-- 表单信息 end -->
  </component>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import api from '../api/amounttotal'
import commonApi from '@/api/common'

const emit = defineEmits(['success'])
// 引用定义
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const mode = ref('')
const projectnames = ref([])

let title = computed(() => {
  return '预算资金' + (mode.value == 'add' ? '-新增' : '-编辑')
})

// 表单信息
const formData = reactive({
  id: null,
  project_id: null,
  budget_cost_sum: null,
  user_cost: null,
  device_cost: null,
  material_cost: null,
  test_process_cost: null,
  fuel_power_cost: null,
  travel_meet_cost: null,
  publish_literature_cost: null,
  labor_services_cost: null,
  expert_consultation_cost: null,
  other_cost: null,
  indirect_cost: null,
})

const expenseFields = [
    'user_cost',
    'device_cost',
    'material_cost',
    'test_process_cost',
    'fuel_power_cost',
    'travel_meet_cost',
    'publish_literature_cost',
    'labor_services_cost',
    'expert_consultation_cost',
    'other_cost',
    'indirect_cost'
  ];

// 计算预算总费用的函数
const calculateBudgetCostSum = () => {
  let totalCost = 0;
  expenseFields.forEach(field => {
    if (formData[field] && !isNaN(formData[field])) {
      totalCost += parseFloat(formData[field]);
    }
  });

  return totalCost;
};

// 监听各个费用字段的变化
expenseFields.forEach(field => {
  watch(() => formData[field], () => {
    formData.budget_cost_sum = calculateBudgetCostSum();
  });
});

// 验证规则
const rules = {
  budget_cost_sum: [{ required: true, message: '预算总费用必需填写' }],
  user_cost: [{ required: true, message: '人员费用必需填写' }],
  material_cost: [{ required: true, message: '材料费用必需填写' }],
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

<style>
#total-cost-input .arco-input-wrapper {
    font-weight: bold; /* 字体加粗 */
    color: red; /* 改变颜色为红色，你可以根据需求换成其他颜色值 */
}
</style>