import { h } from 'vue'
import { getFieldProps } from '../utils/getFieldProps'
import ReactiveField from './ReactiveField'
import type { DefineComponent } from 'vue'

import type { IFieldProps } from '../types'

const Field: DefineComponent<IFieldProps> = {
  name: 'Field',
  props: getFieldProps(),
  setup(props: IFieldProps, context) {
    return () => {
      const componentData = {
        fieldType: 'Field',
        fieldProps: {
          ...props
        }
      } as Record<string, unknown>
      return h(ReactiveField as DefineComponent, componentData, context.slots)
    }
  }
} as unknown as DefineComponent<IFieldProps>

export default Field
