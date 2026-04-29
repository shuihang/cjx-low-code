import { defineComponent, getCurrentInstance, h, nextTick, reactive, ref } from 'vue'
import { ElForm } from 'element-plus'
import { connectFormModel, useForm } from '@cjx-low-code/vue'

export const Form = connectFormModel(ElForm, {
  validateFieldsKey: 'validateField'
})

export default Form
