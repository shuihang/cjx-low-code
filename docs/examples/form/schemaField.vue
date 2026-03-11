<template>
  <XForm v-model:form="form" @submit="submit">
    <XSchemaField>
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

      <XSchemaField.Group label="分组" prop="group">
        <XSchemaField.Input
          label="年龄"
          prop="age"
          :rules="[{ required: true, message: '请输入年龄' }]"
          :input-event="{
            onBlur: (evt) => console.log(evt)
          }"
        />
        <XSchemaField.Input
          label="地址"
          prop="address"
          :rules="[{ required: true, message: '请输入地址' }]"
        />
      </XSchemaField.Group>
    </XSchemaField>
  </XForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { XForm, XSchemaField } from 'cjx-low-code'
import type { SchemaItem } from 'cjx-low-code'

const form = ref({})

const submit = (_: any, done: any) => {
  done(false)
  console.log('save', form)
}
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
