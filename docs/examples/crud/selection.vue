<template>
  <div>
    <XCrud ref="crudRef" :form="form" :option="option" :data="data" @selection-change="selectionChange" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue'
import { XCrud } from 'cjx-low-code'
import type { TableOption } from 'cjx-low-code'
import { ElMessage } from 'element-plus'

const option = ref<TableOption>({
  selection: true,
  rowKey: 'id',
  column: [ 
    {
      label: '姓名',
      prop: 'name'
    },
    {
      label: '年龄',
      prop: 'age'
    },
    {
      label: '地址',
      prop: 'address'
    },
    {
      label: '性别',
      prop: 'sex'
    }
  ]
})

const data = [
  {
    name: '张三',
    age: 18,
    address: '北京市',
    sex: '男',
    id: '1'
  },
  {
    name: '小红',
    age: 20,
    address: '上海市',
    sex: '女',
    id: '2'
  },
  {
    name: '小王',
    age: 22,
    address: '广州市',
    sex: '男',
    id: '3'
  },
  {
    name: '小丽',
    age: 24,
    address: '深圳市',
    sex: '女',
    id: '4'
  }
]

const form = ref({})
const crudRef = ref<InstanceType<typeof XCrud>>()

onMounted(async () => {
  await nextTick()
  crudRef.value?.toggleRowSelection(data[1], true)
})

const selectionChange = (data: any) => {
  ElMessage.success(`选中了${JSON.stringify(data)}`)
}
</script>