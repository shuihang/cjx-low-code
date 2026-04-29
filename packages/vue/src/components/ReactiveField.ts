import { defineComponent, inject, provide, ref, shallowRef, watch } from 'vue'
import { FormPath, each, isFunction, isObject, isString } from '@cjx-low-code/shared'
import { observer } from '@cjx-low-code/reactivity-vue'
import { useAttach, useField, useForm } from '../hooks'
import { FieldSymbol, SchemaOptionsSymbol } from '../shared/context'
import { h } from '../shared/h'
import { Fragment } from '../shared/fragment'
import type { PropType, Ref, VNode } from 'vue'
import type { GeneralField, IFieldProps } from '@cjx-low-code/core'

/**
 * 判断是否为 VoidField（无值字段）
 * VoidField 是一种特殊的字段类型，用于布局等场景，不承载表单值
 */
function isVoidField(field: unknown): boolean {
  if (!field || typeof field !== 'object') return false
  const f = field as Record<string, any>
  return f.constructor?.name === 'VoidField' || (!f.setValue && !f.getValue)
}

const wrapFragment = (childNodes: VNode[] | VNode): VNode => {
  if (!Array.isArray(childNodes)) {
    return childNodes
  }
  if (childNodes.length > 1) {
    return h(Fragment, {}, { default: () => childNodes })
  }
  return childNodes[0]
}

const resolveComponent = (render: () => unknown[], extra?: any) => {
  if (extra === undefined || extra === null) {
    return render
  }
  if (isString(extra)) {
    return () => [...render(), extra]
  }

  if (isFunction(extra)) {
    return extra
  }
}

const mergeSlots = (
  field: GeneralField,
  slots: Record<string, any>,
  content: any
): Record<string, (...args: any) => any[]> => {
  const slotNames = Object.keys(slots)
  if (!slotNames.length) {
    if (!content) {
      return {}
    }
    if (isString(content)) {
      return {
        default: () => [content]
      }
    }
  }

  const patchSlot =
    (slotName: string) =>
    (...originArgs) =>
      slots[slotName]?.({ field, form: field.form, ...originArgs }) ?? []

  const patchedSlots: Record<string, (...args: any) => unknown[]> = {}
  slotNames.forEach((name) => {
    patchedSlots[name] = patchSlot(name)
  })

  if (content && isObject(content)) {
    Object.keys(content).forEach((key) => {
      const child = content[key]
      const slot = patchedSlots[key] ?? (() => [])
      // console.log(1111, child, slot)
      patchedSlots[key] = resolveComponent(slot, child)
    })
    // console.log(patchedSlots)
    return patchedSlots
  }

  return patchedSlots
}

const ReactiveField = observer(
  defineComponent({
    name: 'ReactiveField',
    inheritAttrs: false,
    props: {
      fieldType: {
        type: String as PropType<'Field' | 'ArrayField' | 'ObjectField' | 'VoidField'>,
        default: 'Field'
      },
      fieldProps: {
        type: Object as PropType<IFieldProps>,
        default: () => ({})
      }
    },
    setup(props, { slots }) {
      // console.log(props.fieldProps)
      const formRef = useForm()
      // const parentRef = useField()
      const optionsRef = inject(SchemaOptionsSymbol, ref())

      const createField = () =>
        formRef?.value?.[`create${props.fieldType}`]?.({
          ...props.fieldProps
        })

      const fieldRef = shallowRef(createField()) as Ref<GeneralField>

      watch(
        () => props.fieldProps?.name,
        (newName, oldName) => {
          if (newName !== oldName) {
            if (fieldRef.value && oldName) {
              formRef?.value?.removeField(oldName)
            }
            fieldRef.value = createField()
          }
        }
      )
      useAttach(fieldRef)

      provide(FieldSymbol, fieldRef)

      return () => {
        const field = fieldRef.value
        const options = optionsRef.value

        if (field.display == 'none') {
          return h('template', {}, {})
        }

        const mergedSlots = mergeSlots(field, slots, field.slots)

        const renderDecorator = (childNodes: any[]) => {
          if (!field.decoratorType) {
            return wrapFragment(childNodes)
          }
          const finalComponent =
            FormPath.getIn(options?.components, field.decoratorType as string) ??
            field.decoratorType

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
            attrs: { ...restAttrs, prop: field.path },
            style,
            class: { ...className },
            on: events
          }
          // console.log('finalComponent', field.name, field)
          return h(finalComponent, componentData, {
            default: () => childNodes
          })
        }

        const renderComponent = () => {
          if (!field.componentType) return wrapFragment(mergedSlots?.default?.())
          const component =
            FormPath.getIn(options?.components, field.componentType as string) ??
            field.componentType
          // console.log('componentAttrs', field.component[1])
          const events = {} as Record<string, any>
          const originData = field.component[1] || {}
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
          // console.log(1111, field.name, field.value)
          return h(component, componentData, mergedSlots)
        }

        return renderDecorator([renderComponent()])
      }
    }
  })
)

export default ReactiveField
