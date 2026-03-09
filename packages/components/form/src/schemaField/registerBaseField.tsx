import { defineComponent } from 'vue'
import { useFormInjectKey } from './context'

export default function registerBaseField(props, type) {
  return defineComponent({
    name: `BaseField${type}`,
    props,
    setup(props) {
      const schemaField = useFormInjectKey()
      schemaField.value.addField({
        type,
        ...props
      })

      return () => null // 不需要渲染实际内容
    }
  })
}
