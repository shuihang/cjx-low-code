import { defineComponent, ref } from 'vue'
import { InitFormTemplate } from '../init'
import { useFormInjectKey } from '../context'
import { registerFieldTypes } from './fieldTypes'
import { collectFields } from './context'
import type { SchemaItemArray } from './interface'

const SchemaField = defineComponent({
  name: 'XSchemaField',
  ...registerFieldTypes,
  setup() {
    // 使用 ref 存储字段数组
    const schemaFields = ref<SchemaItemArray>([])

    return {
      schemaFields
    }
  },
  render() {
    const { isView, ...otherProps } = useFormInjectKey().value

    const defaultSlot = this.$slots.default?.()

    return (
      <>
        {defaultSlot}
        {InitFormTemplate({
          schemaField: collectFields(defaultSlot),
          ...otherProps,
          isView: isView.value,
          slots: this.$slots
        })}
      </>
    )
  }
})

export const XSchemaField = SchemaField as typeof SchemaField & typeof registerFieldTypes
