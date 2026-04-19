import { defineComponent, h } from 'vue'

import { getFieldProps } from '../utils/getFieldProps'
import ReactiveField from './ReactiveField'

const ObjectField = defineComponent({
  name: 'ObjectField',
  props: getFieldProps(),
  setup(props, context) {
    return () => {
      return h(
        ReactiveField,
        {
          fieldType: 'ObjectField',
          fieldProps: {
            ...props
          }
        },
        context.slots
      )
    }
  }
})

export default ObjectField
