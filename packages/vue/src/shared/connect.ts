import { defineComponent, markRaw } from 'vue'
import { observer } from '@cjx-low-code/reactivity-vue'
import { FormPath, each, isFunction, isString, isValid } from '@cjx-low-code/shared'
import { useField, useFormAdapter } from '../hooks'
import { h } from '../shared/h'
import type { PropType, SetupContext } from 'vue'
import type { Field, GeneralField } from '@cjx-low-code/core'
import type { FormModelOptions, VueComponent, VueComponentProps } from '../types'

type IConnectComponent<T extends VueComponent> = T & {
  setup?: (props: Record<string, any>, context: SetupContext) => any
}

export interface IComponentMapper<T extends VueComponent = any> {
  (target: T): T
}

export type IStateMapper<Props> =
  | {
      [key in keyof Field]?: keyof Props | boolean
    }
  | ((props: Props, field: GeneralField) => Props)

export function mapProps<T extends VueComponent = VueComponent>(
  ...args: IStateMapper<VueComponentProps<T>>[]
) {
  const transform = (input: VueComponentProps<T>, field: GeneralField) =>
    args.reduce((props, mapper) => {
      if (isFunction(mapper)) {
        props = Object.assign(props, mapper(props, field))
      } else {
        each(mapper, (to, extract) => {
          const extractValue = FormPath.getIn(field.state, extract)
          const targetValue = isString(to) ? to : extract
          const originalValue = FormPath.getIn(props, targetValue)

          if (extract === 'value') {
            if (to !== extract) {
              delete props['value']
            }
          }
          if (isValid(originalValue) && !isValid(extractValue)) return
          FormPath.setIn(props, targetValue, extractValue)
        })
      }
      return props
    }, input)

  return (target: T) => {
    const ConnectedComponent = defineComponent({
      name: `Connected${(target as any).name || 'Component'}`,
      setup(props, { attrs, slots, listeners }: Record<string, any>) {
        const fieldRef = useField()
        return () => {
          const newAttrs = fieldRef.value
            ? transform({ ...attrs } as VueComponentProps<T>, fieldRef.value)
            : { ...attrs }
          return h(
            target,
            {
              attrs: newAttrs,
              on: listeners
            },
            slots
          )
        }
      }
    })

    return observer(ConnectedComponent)
  }
}

export function connect<T extends VueComponent>(target: T, ...args: IComponentMapper[]): T {
  const Component = args.reduce((target: VueComponent, mapper) => {
    return mapper(target)
  }, target)

  // 创建带子组件的包装组件
  const functionalComponent = defineComponent({
    name: target.name,
    setup(props, { attrs, slots }) {
      return () => h(Component, { props, attrs }, slots)
    }
  })

  return markRaw(functionalComponent) as unknown as T
}

export function composeExport<T0 extends VueComponent, T1 extends VueComponent>(
  s0: T0,
  s1: T1
): T0 & T1 {
  return Object.assign(s0, s1)
}

export function connectFormModel<T extends VueComponent>(
  target: IConnectComponent<T>,
  options?: Omit<FormModelOptions, 'model'>
): T {
  const functionalComponent = defineComponent({
    ...target,
    setup(props: Record<string, any>, context) {
      const { model } = useFormAdapter({ ...options, model: props.model || {} })
      return target?.setup?.({ ...props, model }, context)
    }
  })

  return functionalComponent as unknown as T
}

export const connectSetup = <T extends VueComponent>(target: IConnectComponent<T>) => {
  return defineComponent({
    ...target,
    props: {
      props: {
        type: Object as PropType<VueComponentProps<T>>,
        default: () => ({})
      },
      context: {
        type: Object as PropType<SetupContext>,
        default: () => ({})
      }
    },
    setup(props) {
      return target?.setup?.(props.props, props.context)
    }
  })
}
