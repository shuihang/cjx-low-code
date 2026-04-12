import { FormProvider, createSchemaField } from '@cjx-low-code/react'
import { Form, Input } from '@cjx-low-code/antd'
import { createForm, onFieldChange } from '@cjx-low-code/core'
import HooksExamples from './hooks-examples'

const SchemaField = createSchemaField({
  components: {
    Input,
    Form
  }
})
const form = createForm({
  initialValues: {
    name: 'xiejie'
  },
  effects: () => {
    onFieldChange('name', (field, form) => {
      // console.log('用户名变化:', field, form)
      field.form.setFieldState('test', (state) => {
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
const schemas: any[] = [
  {
    title: 'Name',
    type: 'string',
    name: 'name',
    component: 'Input',
    decorator: 'Form.Item'
  },
  {
    title: 'test',
    type: 'string',
    name: 'test',
    component: 'Input',
    decorator: 'Form.Item'
  }
]
function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Form>
        <FormProvider form={form}>
          <SchemaField schema={schemas} />
        </FormProvider>
      </Form>
      {/* <HooksExamples /> */}
    </div>
  )
}

export default App
