<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item label="课题名称" field="name">
            <a-input v-model="searchForm.name" placeholder="请输入课题名称" />
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
import api from '../api/projectsinfo'

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
    auth: ['/gx/ProjectsInfo/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/gx/ProjectsInfo/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/gx/ProjectsInfo/destroy'],
    func: async (params) => {
      const resp = await api.delete(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
    realAuth: ['/gx/ProjectsInfo/realDestroy'],
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
    auth: ['/gx/ProjectsInfo/recovery'],
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
  { title: '课题名称', dataIndex: 'name', width: 220 },
  { title: '录入人员', dataIndex: 'input_user', width: 90, align: 'center'  },
  { title: '开始时间', dataIndex: 'start_date', width: 100, align: 'center' },
  { title: '结束时间', dataIndex: 'end_date', width: 100, align: 'center' },
  { title: '项目级别', dataIndex: 'project_level', dict: 'project_level', width: 80 },
  { title: '研究领域', dataIndex: 'project_domain', dict: 'scientific_domain', width: 100 },
  { title: '合作单位', dataIndex: 'cooperate_company', width: 180 },
  { title: '合作模式', dataIndex: 'cooperate_mode', dict: 'cooperate', width: 80 },
  { title: '步骤节点', dataIndex: 'step', dict: 'lifecycle', width: 100 },
  { title: '单位信息', dataIndex: 'company', width: 180 },
  { title: '预算金额', dataIndex: 'amount', width: 80, align: 'right' },
  { title: '附件', dataIndex: 'attachment', width: 180 },
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
