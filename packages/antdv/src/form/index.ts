import { Form as AntForm } from 'ant-design-vue'
import { connectFormModel } from '@cjx-low-code/vue'

type FormType = typeof AntForm

export const Form: FormType = connectFormModel(AntForm)

export default Form
