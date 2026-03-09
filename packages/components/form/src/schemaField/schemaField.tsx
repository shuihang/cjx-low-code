import { computed, defineComponent, ref } from 'vue'
import { registerFieldTypes } from './fieldTypes'
import { useFormProviderKey } from './context'
import type { FieldInterface } from './context'

export const SchemaField = defineComponent({
  // 主容器组件
  name: 'SchemaField',
  setup(_, { slots }) {
    const fields = ref<FieldInterface[]>([])

    // 提供收集字段的方法
    useFormProviderKey(
      computed(() => ({
        addField: (field) => {
          fields.value.push(field)
          console.log(fields.value)
        }
      }))
    )

    return () => <>{slots.default?.()}</>
  }
})

// 注册字段类型组件
registerFieldTypes(SchemaField)
