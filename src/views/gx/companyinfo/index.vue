<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item label="单位名称" field="name">
            <a-input v-model="searchForm.name" placeholder="请输入单位名称" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="企业类型" field="enterprise_type">
            <sa-select v-model="searchForm.enterprise_type" dict="enterprise_type" placeholder="请选择企业类型" allow-clear />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import EditForm from './edit.vue'
import api from '../api/companyinfo'

// 引用定义
const crudRef = ref()
const editRef = ref()

// 搜索表单
const searchForm = ref({
  name: '',
  enterprise_type: '',
})


// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  rowSelection: { showCheckedAll: true },
  add: {
    show: true,
    auth: ['/gx/CompanyInfo/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/gx/CompanyInfo/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/gx/CompanyInfo/destroy'],
    func: async (params) => {
      const resp = await api.delete(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
    realAuth: ['/gx/CompanyInfo/realDestroy'],
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
    auth: ['/gx/CompanyInfo/recovery'],
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
  { title: '单位名称', dataIndex: 'name', width: 180 },
  { title: '统一社会信用代码', dataIndex: 'social_credit_code', width: 180 },
  { title: '注册资金', dataIndex: 'registered_capital', width: 180 },
  { title: '法人', dataIndex: 'legal_person', width: 180 },
  { title: '实缴金额', dataIndex: 'paid_amount', width: 180 },
  { title: '成立日期', dataIndex: 'create_date', width: 180 },
  { title: '企业类型', dataIndex: 'enterprise_type', dict: 'enterprise_type', width: 120 },
  { title: '主营业务', dataIndex: 'business_main', width: 180 },
])

// 页面数据初始化
const initPage = async () => {}

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
