import React from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import { FormPath, each, isFunction, isString, isValid } from '@cjx-low-code/shared'
import { observer } from '@cjx-low-code/reactivity-react'
import { useField } from '../hooks'
import type { IComponentMapper, IStateMapper, JSXComponent } from '../types'

export function mapProps<T extends JSXComponent>(...args: IStateMapper<React.ComponentProps<T>>[]) {
  return (target: T) => {
    return observer(
      (props: any) => {
        const field = useField()
        const results = args.reduce(
          (props, mapper) => {
            if (isFunction(mapper)) {
              props = Object.assign(props, mapper(props, field))
            } else {
              each(mapper, (to, extract) => {
                const extractValue = FormPath.getIn(field, extract)
                const targetValue = isString(to) ? to : (extract as any)
                const originalValue = FormPath.getIn(props, targetValue)
                if (extract === 'value') {
                  if (to !== extract) {
                    delete props.value
                  }
                }
                if (isValid(originalValue) && !isValid(extractValue)) return
                FormPath.setIn(props, targetValue, extractValue)
              })
            }
            return props
          },
          { ...props }
        )
        return React.createElement(target, results)
      },
      {
        forwardRef: true
      }
    )
  }
}

export function connect<T extends JSXComponent>(target: T, ...args: IComponentMapper<T>[]) {
  const Target = args.reduce((target, mapper) => {
    return mapper(target)
  }, target)

  // Partial<React.ComponentProps<T>>
  const Destination = React.forwardRef((props, ref) => {
    return React.createElement(Target, { ...props, ref })
  })

  if (target) hoistNonReactStatics(Destination, target as any)
  Destination.displayName = (target as any).displayName

  return Destination
}

export { observer }
