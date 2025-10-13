<template>
  <div>
    <XCrud :form="form" :option="option" :data="data" @before-open="beforeOpen" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableOption } from 'cjx-low-code'
const option = ref<TableOption>({
  column: [ 
    {
      label: 'Name',
      prop: 'name'
    },
    {
      label: 'Age',
      prop: 'age'
    },
    {
      label: 'Address',
      prop: 'address'
    },
    {
      label: 'Sex',
      prop: 'sex'
    }
  ]
})

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
</script>