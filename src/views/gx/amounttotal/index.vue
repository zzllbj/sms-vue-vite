<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
      </template>

      <!-- Table 自定义渲染 -->
      <template #project_id="{record}">
        <span>{{ getProjectName(record.project_id)}}</span>
       </template>
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import EditForm from './edit.vue'
import api from '../api/amounttotal'
import commonApi from '@/api/common'

// 引用定义
const crudRef = ref()
const editRef = ref()
const projectnames = ref([])

// 搜索表单
const searchForm = ref({
})


// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  rowSelection: { showCheckedAll: true },
  add: {
    show: true,
    auth: ['/gx/AmountTotal/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/gx/AmountTotal/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/gx/AmountTotal/destroy'],
    func: async (params) => {
      const resp = await api.delete(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
    realAuth: ['/gx/AmountTotal/realDestroy'],
    realFunc: async (params) => {
      const resp = await api.realDestroy(params)
      if (resp.code === 200) {
        Message.success(`销毁成功！`)
        crudRef.value?.refresh()
      }
    },
  },
  recovery: {
    show: true,
    auth: ['/gx/AmountTotal/recovery'],
    func: async (params) => {
      const resp = await api.recovery(params)
      if (resp.code === 200) {
        Message.success(`恢复成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

// SaTable 列配置
const columns = reactive([
  { title: '项目名称', dataIndex: 'project_id', width: 240 },
  { title: '预算总费用', dataIndex: 'budget_cost_sum', width: 80 },
  { title: '人员费', dataIndex: 'user_cost', width: 80 },
  { title: '设备费', dataIndex: 'device_cost', width: 80 },
  { title: '材料费', dataIndex: 'material_cost', width: 80 },
  { title: '测试化验加工费', dataIndex: 'test_process_cost', width: 80 },
  { title: '燃料动力费', dataIndex: 'fuel_power_cost', width: 80 },
  { title: '差旅会议合作交流费', dataIndex: 'travel_meet_cost', width: 80 },
  { title: '出版文献知识产权费', dataIndex: 'publish_literature_cost', width: 80 },
  { title: '劳务费', dataIndex: 'labor_services_cost', width: 80 },
  { title: '专家咨询费用', dataIndex: 'expert_consultation_cost', width: 80 },
  { title: '其他费用', dataIndex: 'other_cost', width: 80 },
  { title: '间接费用', dataIndex: 'indirect_cost', width: 80 },
])

// 根据项目ID获取名称的函数
const getProjectName = (id) => {
  const projectname = projectnames.value.find((item)=> item.value === id );
  return projectname? projectname.label : '----';
};

// 页面数据初始化
const initPage = async () => {
  const projectgetData = await commonApi.commonGet('/gx/ProjectsInfo/index')
  projectnames.value = projectgetData.data.data.map((item) => ({
    value: item.id,
    label: item.name
  }));
}

// SaTable 数据请求
const refresh = async () => {
  crudRef.value?.refresh()
}

// 页面加载完成执行
onMounted(async () => {
  initPage()
  refresh()
})
</script>
