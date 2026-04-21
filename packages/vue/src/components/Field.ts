import { defineComponent, h } from 'vue'
import { getFieldProps } from '../utils/getFieldProps'
import { getRawComponent } from '../utils/getRawComponent'
import ReactiveField from './ReactiveField'

const Field = defineComponent({
  name: 'Field',
  props: getFieldProps(),
  setup(props, context) {
    return () => {
      return h(
        ReactiveField,
        {
          fieldType: 'Field',
          fieldProps: {
            ...props
          }
        },
        context.slots
      )
    }
  }
})

export default Field
