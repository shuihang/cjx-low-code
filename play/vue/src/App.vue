<template>
  <div class="play-container">
    <h1>CJX Low Code Play</h1>

    <!-- :schema="schemaJson" -->
    <FormProvider :form="form">
      <Form>
        <SchemaField>
          <SchemaField.String
            title="姓名"
            name="userName"
            component="Input"
            :component-props="{
              placeholder: '请输入姓名',
              onChange: (e) => {
                console.log(e)
              }
            }"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请输入姓名' }]
            }"
            :slots="{
              suffix: '😋'
            }"
          />

          <SchemaField.Object
            title="测试"
            name="test"
            component="ATestComp"
            :component-props="{
              type: 'text'
            }"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请输入测试内容' }]
            }"
            :slots="{
              testCompSlot: (props) => {
                return '------'
              }
            }"
          />

          <!-- 评分 -->
          <SchemaField.Number
            title="评分"
            name="rate"
            component="Rate"
            :component-props="{}"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请选择评分' }]
            }"
          />

          <SchemaField.Markup
            title="单选框"
            name="radio"
            component="RadioGroup"
            :component-props="{
              options: [
                {
                  label: '选项1',
                  value: '1'
                },
                {
                  label: '选项2',
                  value: '2'
                }
              ]
            }"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请选择单选框' }]
            }"
          />

          <SchemaField.Markup
            title="复选框"
            name="checkbox"
            component="CheckboxGroup"
            :component-props="{
              options: [
                {
                  label: '选项1',
                  value: '1'
                },
                {
                  label: '选项2',
                  value: '2'
                }
              ]
            }"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请选择复选框' }]
            }"
          />

          <SchemaField.Markup
            title="选择"
            name="select"
            component="Select"
            :component-props="{
              options: [
                {
                  label: '选项1',
                  value: '1'
                },
                {
                  label: '选项2',
                  value: '2'
                }
              ],
              clearable: true
            }"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请选择' }]
            }"
          />

          <SchemaField.String
            title="Element Plus Input"
            name="email"
            component="ElInput"
            :component-props="{
              type: 'email'
            }"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请输入邮箱' }]
            }"
            :slots="{
              suffix: '😋'
            }"
          />

          <SchemaFieldMarkup />

          <SchemaFieldMarkup
            name="11"
            component="ElInput"
            :component-props="{ type: 'email' }"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请输入邮箱' }]
            }"
            :slots="{
              suffix: '😋'
            }"
          />
        </SchemaField>

        <!-- <Test /> -->
      </Form>
    </FormProvider>

    <!-- <form-item name="f" class="--f" :rules="[{ required: true, message: '请输入11' }]">
        <Input placeholder="请输入11" />
      </form-item> -->
    <MyComponent />

    <!-- <Button type="primary" @click="submitForm">Submit</Button> -->
    <Button type="primary" @click="submitForm">提交</Button>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue'
import { Button, Input } from '@cjx-low-code/antdv'
import { FormProvider, connect, createSchemaField } from '@cjx-low-code/vue'
import { createForm, onFieldChange } from '@cjx-low-code/core'
import {
  CheckboxGroup,
  Input as ElInput,
  Form,
  FormItem,
  RadioGroup,
  Rate,
  Select
} from '@cjx-low-code/element-plus'
import ATestComp from './testComp.vue'
import { Df, MyComponent } from './testGen'
import type { ISchema } from '@cjx-low-code/vue'
import '../../../packages/element-plus/dist/element-plus.css'

const { SchemaField, SchemaFieldMarkup } = createSchemaField({
  components: {
    Input,
    // AInput: Input,
    // BInput: Input,
    // CInput: Input,
    // DInput: Input,
    Select,
    ElInput,
    Rate,
    RadioGroup,
    CheckboxGroup,
    FormItem,
    ATestComp: connect(ATestComp)
  }
})

const form = createForm({
  initialValues: {
    userName: '张三',
    email: '123@qq.com'
  },
  effects: () => {
    onFieldChange('userName', (field, form) => {
      console.log('用户名变化:', field, form)
      // model.value.userName = form.values.userName || ''
      // model.value.f = form.values.userName || ''
      // console.log(form.values)
      field.form.setFieldState('email', (state) => {
        // console.log('state', state)
        state.disabled = field.state.value === '11'
        // state.title = '邮箱'
        // state.display = field.state.value === '11' ? 'none' : 'visible'
        // console.log(state)
        // state.setTitle('none')
        // console.log(field.state.value, state)
        // state.display = field.state.value === '11' ? 'none' : 'visible'
      })
    })
  }
})

const schemaJson: ISchema<typeof SchemaField> = [
  {
    title: '姓名',
    name: 'name',
    type: 'string',
    decorator: 'FormItem',
    decoratorProps: {},
    component: 'ATestComp',
    componentProps: {
      type: 'text'
    },
    slots: {
      testCompSlot: () => {
        return '------'
      }
    }
    // decoratorProps: {
    //   labelAlign: 'left'
    // }
    // componentProps: {
    //   enterButton: true
    // }
    // on: {
    //   onChange: (e) => {
    //     console.log(e)
    //   }
    //   // onSearch: (e) => {
    //   //   console.log(e)
    //   // }
    // },
    // slots: {
    //   testCompSlot: '🤔️'
    // },
  },
  {
    title: '测试',
    name: 'test',
    type: 'string',
    component: 'Input',
    componentProps: {
      type: 'text',
      onChange: (e) => {
        console.log(e)
      }
    },
    // slots: {
    //   testCompSlot: '555'
    // },
    decorator: 'FormItem',
    decoratorProps: {}
  }
]

// const submitForm = async () => {
//   console.log(formRef.value)
//   await formRef.value?.validate()
// }

const submitForm = async () => {
  await form.validate()
  console.log(form.state.values)
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
