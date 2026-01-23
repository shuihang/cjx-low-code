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
  reviewComments: '同意',
  result: '1'
})


const option = ref<FormOption>({
  labelWidth: 120,
  column: [
    {
      label: '审核结果',
      prop: 'result',
      type: 'radio',
      dicData: [
        {
          label: '通过',
          value: '1'
        },
        {
          label: '不通过',
          value: '2'
        }
      ],
      on: {
      },
      change: (value, column) => {
        console.log(value, column)
        column[0].label = value === '1' ? '审核结果1' : '不同意意见2'
      },
      rules: [{ required: true, message: '请选择审核结果' }],
      span: 24,
    },
    {
      label: '审核意见',
      prop: 'reviewComments',
      type: 'textarea',
      display: ({ form }) => form.result === '1',
      disabled: ({ form }) => form.result === '1',
      span: 24,
      
    },
    {
      label: '不同意意见',
      prop: 'reviewComments',
      type: 'textarea',
      display: ({ form }) => form.result === '2',
      rules: [{ required: true, message: '请输入审核意见' }],
      span: 24
    },
  ]
})

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