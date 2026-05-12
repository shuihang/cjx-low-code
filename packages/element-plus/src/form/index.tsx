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
    return () => (
      <Component props={props} context={context}>
        <ElRow>{context.slots.default()}</ElRow>
      </Component>
    )
  }
})

export const Form = connectFormModel(FormComponent, {
  validateFieldsKey: 'validateField'
})

export default Form
