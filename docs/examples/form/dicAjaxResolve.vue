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
  dict: '',
  result: '1'
})

const getResultData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          label: '选项1',
          value: '1'
        },
        {
          label: '选项2',
          value: '2'
        }
      ])
    }, 200)
  })

}

const option = ref<FormOption>({
  labelWidth: 120,
  column: [
    {
      label: '字典',
      prop: 'dict',
      type: 'radio',
      dicAjaxResolve: getResultData(),
      rules: [{ required: true, message: '请选择字典' }],
      span: 24,
    },
    
    {
      label: '审核意见',
      prop: 'reviewComments',
      type: 'textarea',
      span: 24,
    }
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