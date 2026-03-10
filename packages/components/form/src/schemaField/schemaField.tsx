import { computed, defineComponent, onBeforeUpdate, ref } from 'vue'
import { registerFieldTypes } from './fieldTypes'
import { useFormProviderKey } from './context'
import type { FieldInterface } from './context'

const SchemaField = defineComponent({
  name: 'XSchemaField',
  ...registerFieldTypes,
  setup(_, { slots }) {
    const fields = ref<FieldInterface<any>[]>([])

    // 组件更新前清空字段数组
    onBeforeUpdate(() => {
      fields.value = []
    })

    // 提供收集字段的方法
    useFormProviderKey(
      computed(() => ({
        addField: (field) => {
          fields.value.push(field)
          console.log('addField', field, fields.value)
        },
        addGroupField: (field) => {
          fields.value.push(field)
          console.log('addGroupField', field, fields.value)
        }
      }))
    )

    return () => <>{slots.default?.()}</>
  }
})

export const XSchemaField = SchemaField as typeof SchemaField & typeof registerFieldTypes
