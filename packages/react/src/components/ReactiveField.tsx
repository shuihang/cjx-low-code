import React, { Fragment, useContext } from 'react'
// import { toJS } from '@cjx-low-code/reactive'
import { observer } from '@cjx-low-code/reactivity-react'
import { FormPath, isFunction } from '@cjx-low-code/shared'
import { SchemaComponentsContext } from '../shared'
import type { Form, GeneralField } from '@cjx-low-code/core'
import type { RenderPropsChildren } from '../types'

interface IReactiveFieldProps {
  field: GeneralField
  children?: RenderPropsChildren<GeneralField>
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

const mergeChildren = (children: RenderPropsChildren<GeneralField>, content: React.ReactNode) => {
  if (!children && !content) return
  if (isFunction(children)) return
  return (
    <Fragment>
      {children}
      {content}
    </Fragment>
  )
}

const isValidComponent = (target: any) =>
  target && (typeof target === 'object' || typeof target === 'function')

const renderChildren = (
  children: RenderPropsChildren<GeneralField>,
  field?: GeneralField,
  form?: Form
) => (isFunction(children) ? children(field, form) : children)

const ReactiveInternal: React.FC<IReactiveFieldProps> = (props) => {
  const components = useContext(SchemaComponentsContext)
  if (!props.field) {
    return <Fragment>{renderChildren(props.children)}</Fragment>
  }
  const field = props.field
  const slots = mergeChildren(
    renderChildren(props.children, field, field.form),
    field.slots ?? field.componentProps.children
  )
  if (field.state.display !== 'visible') return null

  const getComponent = (target: any) => {
    const finalComponent = FormPath.getIn(components, target) ?? target
    return isValidComponent(target) ? target : finalComponent
  }

  const renderDecorator = (children: React.ReactNode) => {
    if (!field.decorator || !field.decorator[0]) {
      return <Fragment>{children}</Fragment>
    }
    return React.createElement(
      getComponent(field.decorator[0]),
      // toJS(field.decoratorProps),
      field.decorator[1] || {},
      children
    )
  }

  const renderComponent = () => {
    if (!field.component || !field.component[0]) return slots
    const value = !isVoidField(field) ? field.value : undefined
    const onChange = !isVoidField(field)
      ? (...args: any[]) => {
          field.onInput(...args)
          field.component[1]?.onChange?.(...args)
        }
      : field.component[1]?.onChange
    const onFocus = !isVoidField(field)
      ? (...args: any[]) => {
          field.onFocus(...args)
          field.component[1]?.onFocus?.(...args)
        }
      : field.component[1]?.onFocus
    const onBlur = !isVoidField(field)
      ? (...args: any[]) => {
          field.onBlur(...args)
          field.component[1]?.onBlur?.(...args)
        }
      : field.component[1]?.onBlur

    const disabled = !isVoidField(field) ? field.state.disabled : undefined
    const readOnly = !isVoidField(field) ? field.state.readOnly : undefined
    // console.log('renderComponent', getComponent(field.component[0]), slots)
    return React.createElement(
      getComponent(field.component[0]),
      {
        disabled,
        readOnly,
        // ...toJS(field.componentProps),
        ...(field.component[1] || {}),
        value,
        onChange,
        onFocus,
        onBlur
      }
      // slots
    )
  }

  return renderDecorator(renderComponent())
}

ReactiveInternal.displayName = 'ReactiveField'

export const ReactiveField = observer(ReactiveInternal, {
  forwardRef: true
})
