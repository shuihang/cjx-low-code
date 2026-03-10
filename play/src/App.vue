<template>
  <div class="play-container">
    <h1>CJX Low Code Play</h1>
    <XForm v-model:form="form" :schema-field="schemaField">
      <!-- <XSchemaField>
        <XSchemaField.Input
          label="姓名"
          prop="name"
          :rules="[{ required: true, message: '请输入姓名' }]"
          :input="{
            rows: 2
          }"
          :input-event="{
            onChange: (val: string) => console.log(val)
          }"
        />
        <XSchemaField.Select
          label="性别"
          prop="sex"
          :dic-data="[
            { label: '男', value: 'male' },
            { label: '女', value: 'female' }
          ]"
          :select-event="{
            onBlur: (event) => console.log(event)
          }"
        />
      </XSchemaField>

      <XSchemaField.Group label="分组" prop="group">
        <XSchemaField.Input
          label="年龄"
          prop="age"
          :rules="[{ required: true, message: '请输入年龄' }]"
        />
        <XSchemaField.Input
          label="地址"
          prop="address"
          :rules="[{ required: true, message: '请输入地址' }]"
        />
      </XSchemaField.Group> -->
    </XForm>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { XForm, XSchemaField } from '@cjx-low-code/components'
import type { SchemaProvideType } from '@cjx-low-code/components'

const schemaField = ref<SchemaProvideType>({
  column: [
    {
      label: '姓名',
      prop: 'name'
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
    }
  ]
})

const form = ref({})
</script>

<style scoped>
.play-container {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #409eff;
}
</style>
