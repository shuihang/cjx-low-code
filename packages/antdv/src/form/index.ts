import { Form as AntForm } from 'ant-design-vue'
import { connectFormModel } from '@cjx-low-code/vue'
import type { Form as AntFormType } from 'ant-design-vue'

export const Form: typeof AntFormType = connectFormModel(AntForm)

export default Form
