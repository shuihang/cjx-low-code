import type { FormPath } from '@cjx-low-code/shared'
import type {
  FieldComponent,
  FieldDecorator,
  FieldDisplayTypes,
  FieldReaction
} from '@cjx-low-code/core'
import type { PropType } from 'vue'

export const getFieldProps = () => ({
  name: {
    type: String,
    default: ''
  },
  title: {},
  description: {},
  value: {},
  initialValue: {},
  basePath: {
    type: Object as PropType<FormPath>
  },
  decorator: {
    type: [String, Array] as PropType<FieldDecorator<any>>
  },
  decoratorProps: Object,
  component: {
    type: [String, Array] as PropType<FieldComponent<any>>
  },
  componentProps: Object,
  display: {
    type: String as PropType<FieldDisplayTypes>
  },
  slots: Object,
  pattern: String,
  required: { type: Boolean, default: undefined },
  validateFirst: { type: Boolean, default: undefined },
  hidden: { type: Boolean, default: undefined },
  visible: { type: Boolean, default: undefined },
  editable: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  readOnly: { type: Boolean, default: undefined },
  readPretty: { type: Boolean, default: undefined },
  dataSource: {},
  validator: {},
  reactions: {
    type: [Array, Function] as PropType<FieldReaction[] | FieldReaction>
  }
})

export const getVoidFieldProps = () => ({
  name: {},
  title: {},
  description: {},
  basePath: {},
  decorator: Array,
  component: Array,
  display: String,
  pattern: String,
  hidden: { type: Boolean, default: undefined },
  visible: { type: Boolean, default: undefined },
  editable: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  readOnly: { type: Boolean, default: undefined },
  readPretty: { type: Boolean, default: undefined },
  reactions: [Array, Function]
})
