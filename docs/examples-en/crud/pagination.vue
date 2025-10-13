<template>
  <div>
    <XCrud :form="form" :option="option" :data="data" :page="page" @before-open="beforeOpen" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableOption, CrudPageProps } from 'cjx-low-code'
const option: TableOption = {
  addBtn: true,
  menu: true,
  viewBtn: true,
  column: [ 
    {
      label: 'Name',
      prop: 'name',
      search: true
    },
    {
      label: 'Age',
      prop: 'age',
      search: true
    },
    {
      label: 'Address',
      prop: 'address'
    },
    {
      label: 'Sex',
      prop: 'sex',
    }
  ]
}

const data = [
  {
    name: 'Zhang San',
    age: 18,
    address: 'Beijing',
    sex: 'boy'
  },
  {
    name: 'Xiao Hong',
    age: 20,
    address: 'Shanghai',
    sex: 'girl'
  }
]

const form = ref({})

const beforeOpen: (...args: any[]) => void = (type, row, done) => {
  console.log(type, row)
  done()
}

const page = ref<CrudPageProps>({
  total: 20,
  pageSize: 10,
  currentPage: 1
})
</script>