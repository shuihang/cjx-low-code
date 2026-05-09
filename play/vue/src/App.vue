<template>
  <div class="play-container">
    <h1>CJX Low Code Play</h1>

    <!-- :schema="schemaJson" -->
    <FormProvider :form="form">
      <Form>
        <SchemaField>
          <SchemaField.String
            title="andtv-input 姓名"
            name="userName"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请输入姓名' }]
            }"
            component="Input"
            :component-props="{
              placeholder: '请输入姓名',
              onChange: (e) => {
                console.log(e)
              }
            }"
            :slots="{
              suffix: '😋'
            }"
          />

          <SchemaField.Object
            name="test"
            title="测试组件"
            component="ATestComp"
            :component-props="{
              type: 'text'
            }"
            :slots="{
              testCompSlot: (props) => {
                return h('div', { style: { color: 'pink' } }, '测试组件' + props.test)
              }
            }"
          >
            <SchemaField.Markup
              name="gg"
              title="gg"
              decorator="FormItem"
              :decorator-props="{
                rules: [{ required: true, message: '请输入测试内容' }]
              }"
              component="AInput"
            />
          </SchemaField.Object>

          <!-- 评分 -->
          <SchemaField.Number
            title="评分"
            name="rate"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请选择评分' }]
            }"
            component="Rate"
            :component-props="{}"
          />

          <SchemaField.Markup
            title="单选框"
            name="radio"
            decorator="FormItem"
            :decorator-props="{
              labelCol: 12,
              rules: [{ required: true, message: '请选择单选框' }]
            }"
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
          />

          <SchemaField.Markup
            title="复选框"
            name="checkbox"
            decorator="FormItem"
            :decorator-props="{
              labelCol: 12,
              rules: [{ required: true, message: '请选择复选框' }]
            }"
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
          />

          <SchemaField.Markup
            title="选择"
            name="select"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请选择' }]
            }"
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
          />

          <SchemaField.String
            title="Element Plus Input"
            name="email"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请输入邮箱' }]
            }"
            component="ElInput"
            :component-props="{
              type: 'email'
            }"
            :slots="{
              suffix: '😋'
            }"
          />

          <SchemaFieldMarkup />

          <SchemaFieldMarkup
            title="11"
            name="a"
            decorator="FormItem"
            :decorator-props="{
              rules: [{ required: true, message: '请输入邮箱' }]
            }"
            component="ElInput"
            :component-props="{ type: 'email' }"
            :slots="{
              suffix: '😋'
            }"
          />
        </SchemaField>
      </Form>
    </FormProvider>

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
import '../../../packages/element-plus/dist/element-plus.css'

const { SchemaField, SchemaFieldMarkup, defineSchema } = createSchemaField({
  components: {
    Input,
    AInput: Input,
    BInput: Input,
    CInput: Input,
    DInput: Input,
    EInput: Input,
    FInput: Input,
    GInput: Input,
    HInput: Input,
    IInput: Input,
    JInput: Input,
    // XInput: Input,
    // KInput: Input,
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
    // test: {
    //   gg: '11'
    // }
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

const schemaJson = defineSchema([
  {
    title: 'obj',
    name: 'obj',
    type: 'object',
    decorator: null,
    decoratorProps: {},
    component: 'ATestComp',
    slots: {
      testCompSlot: () => {
        return '------'
      }
    },
    children: [
      {
        title: 'F',
        name: 'f',
        type: 'string',
        decoratorProps: {
          rules: [{ required: true, message: '请输入F' }]
        },
        decorator: 'FormItem',
        component: 'Input',
        componentProps: {
          type: 'text'
        }
      },
      {
        title: 'objSon',
        name: 'objSon',
        type: 'object',
        decorator: null,
        decoratorProps: {},
        component: 'ATestComp',
        slots: {
          testCompSlot: () => {
            return 'objSon'
          }
        },
        children: [
          {
            title: 'children-level',
            name: 'childrenLevel',
            type: 'string',
            decoratorProps: {
              rules: [{ required: true, message: '请输入children-level' }]
            },
            decorator: 'FormItem',
            component: 'Input',
            componentProps: {
              type: 'text'
            }
          }
        ]
      }
    ]
  },
  {
    title: '姓名',
    name: 'name',
    type: 'string',
    decoratorProps: {
      rules: [{ required: true, message: '请输入姓名' }]
    },
    decorator: 'FormItem',
    component: 'Input',
    componentProps: {
      type: 'text'
    },
    slots: {
      testCompSlot: () => {
        return '------'
      }
    }
  }
])

// const submitForm = async () => {
//   console.log(formRef.value)
//   await formRef.value?.validate()
// }

const submitForm = async () => {
  console.log(form.state.values)
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
