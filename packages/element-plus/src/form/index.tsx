import { defineComponent, h } from 'vue'
import { ElForm, ElRow, formEmits, formProps } from 'element-plus'
import { connectFormModel, connectSetup } from '@cjx-low-code/vue'
import { extend, omit } from '@cjx-low-code/shared'

const FormComponent = defineComponent({
  ...omit(ElForm, []),
  props: extend({}, formProps),
  emits: formEmits,
  setup(props, context) {
    const Component = connectSetup(ElForm)
    return () =>
      h(
        Component,
        {
          props,
          context
        },
        h(ElRow, {}, context.slots)
      )
  }
})

export const Form = connectFormModel(FormComponent, {
  validateFieldsKey: 'validateField'
})

export default Form
