<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :span="8">
          <a-form-item label="姓名" field="name">
            <a-input v-model="searchForm.name" placeholder="请输入姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="职称" field="jobtitle">
            <sa-select v-model="searchForm.jobtitle" dict="occupation" placeholder="请选择职称" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="类型" field="type">
            <sa-select v-model="searchForm.type" dict="establishment" placeholder="请选择类型" allow-clear />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <template #department="{ record }">
        <span>{{ getDepartmentNameById(record.department) }}</span>
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
import api from '../api/usersinfo'
import commonApi from '@/api/common'

// 引用定义
const crudRef = ref()
const editRef = ref()
const departmentMap = {};

// 搜索表单
const searchForm = ref({
  name: '',
  jobtitle: '',
  type: '',
})


// SaTable 基础配置
const options = reactive({
  import: {
    // 导入url
    url: '/gx/UsersInfo/import',
    templateUrl: '/gx/UsersInfo/downloadTemplate',
    auth: ['/gx/UsersInfo/import'],
    text: '导入',
    show: true
  },
  export: {
    url: '/gx/UsersInfo/export',
    auth: ['/gx/UsersInfo/export'],
    text: '导出',
    show: true
  },

  api: api.getPageList,

  recycleApi: api.getRecyclePageList,
  rowSelection: { showCheckedAll: true },
  add: {
    show: true,
    auth: ['/gx/UsersInfo/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/gx/UsersInfo/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/gx/UsersInfo/destroy'],
    func: async (params) => {
      const resp = await api.delete(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
    realAuth: ['/gx/UsersInfo/realDestroy'],
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
    auth: ['/gx/UsersInfo/recovery'],
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
  { title: '姓名', dataIndex: 'name', width: 80, align: 'center' },
  { title: '性别', dataIndex: 'sex', dict: 'sex', width: 60, align: 'center' },
  { title: '年龄', dataIndex: 'age', width: 60, align: 'center' },
  { title: '电话', dataIndex: 'tel', width: 110, align: 'center' },
  { title: '证书', dataIndex: 'cert', width: 180, align: 'right' },
  { title: '专业', dataIndex: 'professional', dict: 'profession', width: 120, align: 'left' },
  { title: '职称', dataIndex: 'jobtitle', dict: 'occupation', width: 80, align: 'center' },
  { title: '学历', dataIndex: 'educated', dict: 'degree', width: 100, align: 'center' },
  { title: '类型', dataIndex: 'type', dict: 'establishment', width: 80, align: 'center' },
  { title: '部门', dataIndex: 'department', width: 100, align: 'center' },
])

const buildDepartmentMap = (data) => {
  data.forEach((department) => {
    departmentMap[department.id] = department;
    if (department.children) {
      buildDepartmentMap(department.children);
    }
  });
};

// 根据部门ID获取部门名称的函数
const getDepartmentNameById = (id) => {
  const department = departmentMap[id];
  return department ? department.label : '未知部门';
};

// 页面数据初始化
const initPage = async () => {
  const departmentData = await commonApi.commonGet('/core/dept/index?tree=true&filter=false')
  buildDepartmentMap(departmentData.data)
}

// SaTable 数据请求
const refresh = async () => {
  crudRef.value?.refresh()
}

// 页面加载完成执行
onMounted(async () => {
  initPage()
  refresh();
})
</script>
