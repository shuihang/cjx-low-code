<template>
  <div>
    <XCrud v-model:form="form" :option="option" :data="data" @before-open="beforeOpen" @row-save="save" >
      <template #nameSearch>
        <el-input placeholder="请输入插槽姓名" />
      </template>

      <template #headerMenu>
        <el-button type="primary">自定义按钮headerMenu</el-button>
      </template>

      <template #menu="{ row, $index }">
        <el-button type="primary" link @click="customizeMenuBtn(row, $index)">自定义按钮menu</el-button>
      </template>

      <template #name="{ row }">
        <el-tag>{{ row.name }}</el-tag>
      </template>

      <template #nameForm="{ prop, _xBoxType }">
        <div v-if="_xBoxType === 'check'">
           <el-tag>{{ form.name }}</el-tag>{{prop}}
        </div>

        <div v-else>
          <el-input v-model="form.name" placeholder="请输入姓名" /> {{ _xBoxType }}
        </div>
      </template>

      <template #otherGroupForm>
         1111
      </template>
    </XCrud>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableOption } from 'cjx-low-code'
import { ElMessage } from 'element-plus'

const option = ref<TableOption>({
  menu: true,
  menuWidth: 220,
  updateBtn: true,
  viewBtn: true,
  addBtn: true,
  span: 12,
  column: [ 
    {
      label: '姓名',
      prop: 'name',
      search: true
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
    },
    {
      label: '时间组件',
      prop: 'obj.objSon.time',
      type: 'datePicker',
      datePicker: {
        type: 'year',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  ],
  group: [
    {
      label: '详细信息',
      prop: 'info',
      column: [
        {
          label: '爱好',
          prop: 'hobby',
          type: 'checkbox',
          span: 12,
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
              label: '羽毛球',
              value: '3'
            },
            {
              label: '乒乓球',
              value: '4'
            }
          ],
          checkbox: {
            
          },
        },
        
        {
          label: '职业',
          prop: 'job',
          type: 'radio',
          dicData: [
            {
              label: '教师',
              value: '1'
            },
            {
              label: '医生',
              value: '2'
            },
            {
              label: '工程师',
              value: '3'
            },
            {
              label: '学生',
              value: '4'
            }
          ]
        }
      ]
    },
    {
      label: '其他信息',
      prop: 'other',
    }
  ]
})

const data = [
  {
    name: '张三',
    age: 18,
    address: '北京市',
    sex: '男',
    hobby: ['2', '4'],
    job: '1',
  },
  {
    name: '小红',
    age: 20,
    address: '上海市',
    sex: '女',
    hobby: ['2'],
    job: '4',
  }
]

const form = ref({
  name: ''
})

const beforeOpen: (...args: any[]) => void = (type, row, done) => {
  console.log(type, row)
  done()

}

const customizeMenuBtn = (row: any, $index: number) => {
  ElMessage.success('自定义按钮menu: row: ' + JSON.stringify(row) + ' $index: ' + $index)
}

const save = (row: any, done) => {
  console.log(form.value)
  ElMessage.success('保存成功:' + JSON.stringify(form.value))
  done()
}
</script>