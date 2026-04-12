import { inject, provide, ref, shallowRef, watch } from 'vue'
import { FormPath, each } from '@cjx-low-code/shared'
import { observer } from '@cjx-low-code/reactivity-vue'
import { useAttach, useField, useForm } from '../hooks'
import { FieldSymbol, SchemaOptionsSymbol } from '../shared/context'
import { h } from '../shared/h'
import type { DefineComponent, Ref } from 'vue'
import type { GeneralField, IFieldProps } from '@cjx-low-code/core'

export interface IReactiveFieldProps {
  fieldType: 'Field' | 'ArrayField' | 'ObjectField' | 'VoidField'
  fieldProps: IFieldProps
}
/**
 * 判断是否为 VoidField（无值字段）
 * VoidField 是一种特殊的字段类型，用于布局等场景，不承载表单值
 */
function isVoidField(field: unknown): boolean {
  if (!field || typeof field !== 'object') return false
  const f = field as Record<string, any>
  return f.constructor?.name === 'VoidField' || (!f.setValue && !f.getValue)
}

export default observer({
  name: 'ReactiveField',
  props: {
    fieldType: {
      type: String,
      default: 'Field'
    },
    fieldProps: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props: IReactiveFieldProps, { slots }) {
    const formRef = useForm()
    // const parentRef = useField()
    const optionsRef = inject(SchemaOptionsSymbol, ref())

    const createField = () =>
      formRef?.value?.[`create${props.fieldType}`]?.({
        ...props.fieldProps
      })

    const fieldRef = shallowRef(createField()) as Ref<GeneralField>

    watch(
      () => props.fieldProps,
      (newProps, oldProps) => {
        if (fieldRef.value && oldProps.name) {
          formRef?.value?.removeField(oldProps.name)
        }
        fieldRef.value = createField()
      }
    )
    useAttach(fieldRef)
    provide(FieldSymbol, fieldRef)

    return () => {
      const field = fieldRef.value
      const options = optionsRef.value

      if (!field) {
        return slots.default?.()
      }

      if (field.state.display === 'none') {
        return null
      }

      const renderDecorator = (childNodes: any[]) => {
        const finalComponent =
          FormPath.getIn(options?.components, field.decoratorType as string) ?? field.decoratorType

        const componentAttrs = field.decorator[1] || {}

        const events: Record<string, any> = {}
        each(componentAttrs, (value, eventKey) => {
          const onEvent = eventKey.startsWith('on')
          const atEvent = eventKey.startsWith('@')
          if (!onEvent && !atEvent) return
          if (onEvent) {
            const eventName = `${eventKey[2].toLowerCase()}${eventKey.slice(3)}`
            events[eventName] = events[eventName] || value
          } else if (atEvent) {
            const eventName = eventKey.slice(1)
            events[eventName] = value
            delete componentAttrs[eventKey]
          }
        })

        const { style, class: className, ...restAttrs } = componentAttrs

        const componentData = {
          attrs: { ...restAttrs, prop: field.name },
          style,
          class: { ...className, [field.name]: true },
          on: events
        }
        console.log(restAttrs)
        return h(finalComponent, componentData, {
          default: () => childNodes
        })
      }

      const renderComponent = () => {
        const component =
          FormPath.getIn(options?.components, field.componentType as string) ?? field.componentType

        const events = {} as Record<string, any>
        const originData = field.componentProps || {}
        each(originData, (value, eventKey) => {
          const onEvent = eventKey.startsWith('on')
          const atEvent = eventKey.startsWith('@')
          if (!onEvent && !atEvent) return
          if (onEvent) {
            const eventName = `${eventKey[2].toLowerCase()}${eventKey.slice(3)}`
            // "@xxx" 具有更高的优先级
            events[eventName] = events[eventName] || value
          } else if (atEvent) {
            const eventName = eventKey.slice(1)
            events[eventName] = value
            delete originData[eventKey]
          }
        })
        const originChange = originData['@change'] || originData['onChange']
        const originFocus = originData['@focus'] || originData['onFocus']
        const originBlur = originData['@blur'] || originData['onBlur']
        const { style, class: className, ...restOriginData } = originData

        events.change = (...args: any[]) => {
          if (!isVoidField(field)) field.onInput(...args)
          originChange?.(...args)
        }
        events.focus = (...args: any[]) => {
          if (!isVoidField(field)) field.onFocus(...args)
          originFocus?.(...args)
        }
        events.blur = (...args: any[]) => {
          if (!isVoidField(field)) field.onBlur(...args)
          originBlur?.(...args)
        }

        const componentData = {
          attrs: {
            disabled: !isVoidField(field) ? field.state.disabled : undefined,
            readOnly: !isVoidField(field) ? field.state.readOnly : undefined,
            ...restOriginData,
            value: !isVoidField(field) ? field.value : undefined
          },
          style,
          class: className,
          on: events
        }
        // console.log(component, componentData)
        return h(component, componentData, slots)
      }

      return renderDecorator([renderComponent()])
    }
  }
}) as unknown as DefineComponent<IReactiveFieldProps>
