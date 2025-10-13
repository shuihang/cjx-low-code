<template>
  <div>
    <XForm ref="formRef" :form="form" :option="option" @submit="save" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XForm } from 'cjx-low-code'
import type { FormOption } from 'cjx-low-code'
import { ElMessage } from 'element-plus'

const form = ref({
  name: '',
  age: '',
  sex: '1'
})

const option = ref<FormOption>({
  column: [
    {
      label: 'Name',
      prop: 'name',
      rules: [{ required: true, message: 'Please enter your name' }]
    },
    {
      label: 'Age',
      prop: 'age',
      type: 'inputNumber',
      inputNumber: {
        min: 0,
      }
    },
    {
      label: 'Sex',
      prop: 'sex',
      type: 'select',
      dicData: [
        {
          label: 'boy',
          value: '1'
        },
        {
          label: 'girl',
          value: '2'
        }
      ]
    }
  ]
})

const formRef = ref<InstanceType<typeof XForm>>()

const save = async (data: any, done) => {
  const valid = await formRef.value?.validate()
  if (!valid) return
  setTimeout(() => {
    ElMessage.success(`Submission successful${JSON.stringify(data)}`)
    done()
  }, 500)
}

</script>