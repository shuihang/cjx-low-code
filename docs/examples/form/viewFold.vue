<template>
  <div>
    <XForm ref="formRef" :form="form" :option="option" @submit="save"  is-view/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XForm } from 'cjx-low-code'
import type { FormOption } from 'cjx-low-code'
import { ElMessage } from 'element-plus'

const form = ref({
  name: '小明',
  age: '18',
  sex: '1',
  address: '北京市/朝阳区',
  hobby: ['2', '4'],
  favoriteMusic: ['1', '4'],
})

const option = ref<FormOption>({
  menuBtn: false,
  labelWidth: 170,
  group: [
    {
      label: '基本信息',
      prop: 'group1',
      collapse: true,
      column: [
        {
        label: '姓名',
        prop: 'name',
        checkSpan: 12,
        collapseShow: true
      },
      {
        label: '年龄',
        prop: 'age',
        collapseShow: true,
        checkSpan: 12,
      },
      {
          label: '性别',
          prop: 'sex',
          type: 'select',
          checkSpan: 12,
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
        },
        {
          label: '住址',
          prop: 'address',
          type: 'input',
        },
        {
          label: '个人介绍',
          prop: 'introduce',
          type: 'textarea',

        },
        {
          label: '爱好的运动',
          prop: 'hobby',
          type: 'checkbox',
          dicData: [
            {
              label: '篮球',
              value: '1'
            },
            {
              label: '足球',
              value: '2'
            },
            {
              label: '乒乓球',
              value: '3'
            },
            {
              label: '羽毛球',
              value: '4'
            }
          ]
        },
        {
          label: '喜欢的音乐',
          prop: 'favoriteMusic',
          type: 'checkbox',
          dicData: [
            {
              label: '古典',
              value: '1'
            },
            {
              label: '流行',
              value: '2'
            },
            {
              label: '摇滚',
              value: '3'
            },
            {
              label: '民谣',
              value: '4'
            }
          ]
        },
        
        {
          label: '备注',
          prop: 'remark',
          type: 'textarea',
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
    ElMessage.success(`提交成功${JSON.stringify(data)}`)
    done()
  }, 500)
}

</script>