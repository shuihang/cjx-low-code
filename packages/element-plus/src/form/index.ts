import { ElForm } from 'element-plus'
import { connectFormModel } from '@cjx-low-code/vue'

export const Form = connectFormModel(ElForm, {
  validateFieldsKey: 'validateField'
})

export default Form
