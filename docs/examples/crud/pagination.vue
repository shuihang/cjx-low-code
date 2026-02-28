<template>
  <div>
    <XCrud
      v-model:form="form"
      v-model:search="search"
      v-model:page="page"
      :option="option"
      :data="data"
      @before-open="beforeOpen"
      @row-del="rowDel"
      @row-save="addSave"
      @row-update="rowUpdate"
      :on-load="onLoad"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableOption, CrudPageProps } from 'cjx-low-code'
import { ElMessage } from 'element-plus'

const option = ref<TableOption>({
  addBtn: true,
  menu: true,
  viewBtn: true,
  updateBtn: true,
  delBtn: true,
  column: [ 
    {
      label: '姓名',
      prop: 'name',
      search: true,
      rules:[
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ]
    },
    {
      label: '年龄',
      prop: 'age',
      search: true,
      type: 'inputNumber',
      inputNumber: {
        min: 1,
      },
      rules:[
        { required: true, message: '请输入年龄', trigger: 'blur' }
      ]
    },
    {
      label: '地址',
      prop: 'address'
    },
    {
      label: '性别',
      prop: 'sex',
      type: 'select',
      search: true,
      dicData: [
        {
          label: '男',
          value: '1'
        },
        {
          label: '女',
          value: '2'
        }
      ]
    }
  ]
})

const data = [
  {
    name: '张三',
    age: 18,
    address: '北京市',
    sex: '1'
  },
  {
    name: '小红',
    age: 20,
    address: '上海市',
    sex: '2'
  }
]

const form = ref({})


const page = ref<CrudPageProps>({
  total: 20,
  pageSize: 10,
  currentPage: 1
})

const search = ref({})

const beforeOpen: (...args: any[]) => void = (type, row, done) => {
 ElMessage.success(type)
  done()
}

const onLoad = async () => {
  // 模拟异步请求
  await new Promise<void>(resolve => {
    ElMessage.success(JSON.stringify(search.value))
    setTimeout(() => resolve(), 500)
  })
}

const addSave = (row: any, done: Function) => {
  ElMessage.success(JSON.stringify(row))
  done()
}


const rowUpdate = (row: any, done: Function) => {
  ElMessage.success(JSON.stringify(row))
  done()
}

const rowDel = (row: any, index: number) => {
  ElMessage.success(JSON.stringify(row))
}
</script>