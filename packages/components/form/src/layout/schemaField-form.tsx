import { defineComponent } from 'vue'
import { useFormInjectKey } from '../context'
import { InitFormTemplate } from '../init'
import { arrayType } from '../../../_util/type'
import type { CustomSlotsType } from '../../../_util/type'
import type { SchemaItemArray } from '../interface'

export default defineComponent({
  name: 'XFormColumn',
  props: {
    schemaField: arrayType<SchemaItemArray>()
  },
  slots: Object as CustomSlotsType<object>,
  render() {
    const { isView, ...otherProps } = useFormInjectKey().value
    return InitFormTemplate({
      ...this.$props,
      ...otherProps,
      isView: isView.value,
      slots: this.$slots
    })
  }
})
