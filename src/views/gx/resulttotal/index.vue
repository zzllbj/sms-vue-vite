<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item label="成果名称" field="name">
            <a-input v-model="searchForm.name" placeholder="请输入成果名称" />
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
import api from '../api/resulttotal'

// 引用定义
const crudRef = ref()
const editRef = ref()

// 搜索表单
const searchForm = ref({
  name: '',
})


// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  rowSelection: { showCheckedAll: true },
  add: {
    show: true,
    auth: ['/gx/ResultTotal/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/gx/ResultTotal/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/gx/ResultTotal/destroy'],
    func: async (params) => {
      const resp = await api.delete(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
    realAuth: ['/gx/ResultTotal/realDestroy'],
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
    auth: ['/gx/ResultTotal/recovery'],
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
  { title: '成果名称', dataIndex: 'name', width: 180 },
  { title: '成果类型', dataIndex: 'class', dict: 'results_type', width: 120 },
  { title: '发明人', dataIndex: 'invention_user', width: 180 },
  { title: '专利号', dataIndex: 'patent_number', width: 180 },
  { title: '登记号', dataIndex: 'registration_code', width: 180 },
  { title: '授权人', dataIndex: 'licensor_user', width: 180 },
  { title: '申请日期', dataIndex: 'apply_date', width: 180 },
  { title: '公告日期', dataIndex: 'public_date', width: 180 },
  { title: '公告号', dataIndex: 'public_number', width: 180 },
  { title: '状态', dataIndex: 'status', dict: 'project_status', width: 120 },
  { title: '附件图片', dataIndex: 'attachment', width: 180 },
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
