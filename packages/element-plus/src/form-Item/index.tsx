import { defineComponent, h } from 'vue'
import { ElCol, ElFormItem, formEmits, formItemProps } from 'element-plus'
import { connect, connectSetup, mapProps } from '@cjx-low-code/vue'
import { extend, omit } from '@cjx-low-code/shared'
import type { FormItemProps } from 'element-plus'

const FormItemComponent = defineComponent<FormItemProps & { labelCol?: number }>({
  ...omit(ElFormItem, ['setup']),
  name: 'FormItem',
  props: extend(
    {
      labelCol: {
        type: Number,
        default: 24
      }
    },
    formItemProps
  ),
  emits: formEmits,
  setup(props, context) {
    const Component = connectSetup(ElFormItem)
    return () => (
      <ElCol span={props.labelCol}>
        {h(
          Component,
          {
            props,
            context
          },
          context.slots
        )}
      </ElCol>
    )
  }
})

export const FormItem = connect(
  FormItemComponent,
  mapProps({ title: 'label', name: 'prop' }, (props, field) => ({
    ...props
  }))
)

export default FormItem
