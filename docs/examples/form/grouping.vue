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
  年龄: '1'
})


const option = ref<FormOption>({
  labelWidth: 120,
  column: [
    {
      label: '姓名',
      prop: 'name',
    },
    
    {
      label: '年龄',
      prop: 'age',
      type: 'inputNumber'
    }
  ],
  group: [
    {
      label: '分组水果',
      prop: 'group1',
      column: [
        {
          label: '西瓜',
          prop: 'watermelon',
          type: 'checkbox',
          dicData: [
            {
              label: '甜',
              value: '1'
            },
            {
              label: '大',
              value: '2'
            },
            {
              label: '绿',
              value: '3'
            }
          ],
        },
        {
          label: '苹果',
          prop: 'apple',
          type: 'checkbox',
          dicData: [
            {
              label: '甜',
              value: '1'
            },
            {
              label: '大',
              value: '2'
            },
            {
              label: '红',
              value: '3'
            }
          ]
        }
      ]
    },
    {
      label: '分组蔬菜',
      prop: 'group2',
      column: [
        {
          label: '胡萝卜',
          prop: 'carrot',
          type: 'checkbox',
          dicData: [
            {
              label: '甜',
              value: '1'
            },
            {
              label: '大',
              value: '2'
            },
            {
              label: '橙',
              value: '3'
            }
          ]
        },
      ]
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