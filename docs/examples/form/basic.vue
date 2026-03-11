<template>
  <div>
    <XForm ref="formRef" :form="form" :schema-field="schemaField" @submit="save" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XForm } from 'cjx-low-code'
import { ElMessage } from 'element-plus'
import type { SchemaItemArray } from 'cjx-low-code'

const form = ref({
  name: '',
  age: '',
  sex: '1'
})

const schemaField = ref<SchemaItemArray>([
  {
    label: '姓名',
    prop: 'name',
    type: 'input',
    rules: [{ required: true, message: '请输入姓名' }]
  },
  {
    label: '年龄',
    prop: 'age',
    type: 'inputNumber'
  },
  {
    label: '性别',
    prop: 'sex',
    type: 'select',
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
])

const formRef = ref<InstanceType<typeof XForm>>()

const save = async (data: any, done) => {
  const valid = await formRef.value?.validate()
  if (!valid) return
  setTimeout(() => {
    ElMessage.success(`提交成功${JSON.stringify(data)}`)
    done()
  }, 500)
}
</script>
