<template>
  <div>
    <XForm ref="formRef" :form="form" :option="option" :schema-field="schemaField" @submit="save" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XForm } from 'cjx-low-code'
import { ElMessage } from 'element-plus'
import type { FormOption, SchemaProvideType } from 'cjx-low-code'

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
  labelWidth: 120
})

const schemaField = ref<SchemaProvideType>({
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
        radioEvent: {
          onChange: (value, _helpers) => {
            _helpers.updateColumns(['result'], {
              label: value === '1' ? '审核结果1' : '不同意意见2'
            })
          }
        }
      }
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
