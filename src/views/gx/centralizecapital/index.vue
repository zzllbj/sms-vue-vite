<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item label="课题名称" field="name_id">
            <a-select v-model="searchForm.name_id" :options="[]" placeholder="请选择课题名称" allow-clear />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <template #name_id="{ record }">
        <span>{{ getProjectName(record.name_id) }}</span>
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
import api from '../api/centralizecapital'
import commonApi from '@/api/common'

// 引用定义
const crudRef = ref()
const editRef = ref()
const projectnames = ref([])

// 搜索表单
const searchForm = ref({
  name_id: '',
})


// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  recycleApi: api.getRecyclePageList,
  rowSelection: { showCheckedAll: true },
  add: {
    show: true,
    auth: ['/gx/CentralizeCapital/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/gx/CentralizeCapital/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/gx/CentralizeCapital/destroy'],
    func: async (params) => {
      const resp = await api.delete(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
    realAuth: ['/gx/CentralizeCapital/realDestroy'],
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
    auth: ['/gx/CentralizeCapital/recovery'],
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
  { title: '课题名称', dataIndex: 'name_id', width: 220 },
  { title: '归集时间', dataIndex: 'centralize_date', width: 80, align: 'center' },
  { title: '人员费/元', dataIndex: 'user_fee', width: 90, align: 'right' },
  { title: '材料费/元', dataIndex: 'material_fee', width: 90, align: 'right' },
  { title: '其它费/元', dataIndex: 'other_fee', width: 90, align: 'right' },
  { title: '审核状态', dataIndex: 'audit_status', dict: 'audit_status', width: 60, align: 'center' },
  { title: '记录人', dataIndex: 'record_user', width: 80, align: 'center' },
])


// 根据项目ID获取名称的函数
const getProjectName = (id) => {
  const projectname = projectnames.value.find((item) => item.value === id);
  return projectname ? projectname.label : '未知项目';
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
