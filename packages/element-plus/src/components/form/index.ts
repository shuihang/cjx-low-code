import { ElForm } from 'element-plus'
import { connectFormModel } from '@cjx-low-code/vue'
import 'element-plus/es/components/form/style/index'

export const Form = connectFormModel(ElForm, {
  validateFieldsKey: 'validateField'
})

export default Form
