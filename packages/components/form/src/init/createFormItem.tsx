import { createVNode } from 'vue'
import { ElCol, ElFormItem, ElIcon, ElTooltip } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import type { CSSProperties, VNode, Slot } from 'vue'
import type { FormColumnProps, FormItemType, FormTypeProps } from '../interface'
import type { FormRenderContext, FormRenderOptions } from './FormRenderDecorator'
import { componentPropsValues, formColumnValues } from '../interface'
import pick from '../../../_util/pick'
import omit from '../../../_util/omit'
import { isString, isFunction } from '../../../_util/shared'
import { tempForm } from '../tempform'
import type { SlotsValue } from '../tempform'
import { TipOutlined } from '../../../crud/src/icon'

const needHandelLabelComponentArr = [ 'checkbox', 'radioButton', 'radio' ]

function createFormItemComponent(
  item: FormColumnProps,
  itemType: FormItemType,
  context: FormRenderContext,
  options: FormRenderOptions
): VNode | VNode[] {
  let componentProps: FormTypeProps[keyof FormTypeProps] | {} = {}
  const componentSlotNodes = item.formSlotNodes ? pick(item.formSlotNodes, tempForm[itemType]?.slots as SlotsValue) : {}
  const isDesign = tempForm[itemType]?.isDesign || false

  if (options.useComponentPropsValues) {
    const pickProps = pick(item, componentPropsValues)
    componentPropsValues.map((typeValue) => {
      componentProps = { ...componentProps, ...pickProps[typeValue] }
    })
  }

  const { otherPropsFn } = tempForm[itemType]
  if (otherPropsFn) {
    componentProps = { ...componentProps, ...otherPropsFn(item) }
  }

  const baseProps = {
    ...omit(item, formColumnValues),
    ...pick(item, tempForm[itemType]?.props || []),
    ...tempForm[itemType]?.[itemType],
    showWordLimit: false,
    modelValue: context._getValueByPath(item.prop).value,
    'onUpdate:modelValue': (value: string) => context.onUpdateModelValue(item.prop, value),
    ...context._getBindValue(item, itemType),
  }

  if (!isDesign) {
    Object.assign(baseProps, {
      ...pick(tempForm[itemType], ['type']),
      ...componentProps,
      style: {
        width: item.tip ? 'calc(100% - 14px)' : '100%',
        ...item.style
      } as CSSProperties,
      clearable: item.clearable,
      placeholder: item.placeholder || context._getI18nPlaceholder(itemType) + item.label
    })
  } else {
    Object.assign(baseProps, componentProps)
  }

  if (context._handleOnEvent) {
    Object.assign(baseProps, context._handleOnEvent(item, itemType))
  }

  if (options.isSearch) {
    baseProps.onKeyup = (e: KeyboardEvent) => {
      e.key === 'Enter' && options.onSubmit?.()
    }
  }

  if (context._formatRules && !options.isSearch && (item.disabled as any)) {
    baseProps.disabled = isFunction(item.disabled) ? item.disabled({
      form: { ...context.newForm.value },
      column: context.column,
      xBoxType: context.xBoxType?.value,
    } as any) : item.disabled
  }

  const children: any = {
    ...componentSlotNodes
  }

  const subComponent = tempForm[itemType]?.subComponent
  if (subComponent) {
    children.default = () => {
      if (!item.dicData) return null
      return item.dicData.map((temp) => {
        const labelKey = item.props?.label || 'label'
        const valueKey = item.props?.value || 'value'
        const label = isString(temp[labelKey]) ? temp[labelKey] : temp[labelKey]?.el?.parentNode.innerText
        const value = temp[valueKey]

        return createVNode(
          subComponent,
          {
            ...temp,
            value,
            label: needHandelLabelComponentArr.includes(item.type || '') ? value : label,
            key: value
          },
          {
            default: () => temp[labelKey]
          }
        )
      })
    }
  }

  return createVNode(tempForm[itemType]?.component, baseProps, children)
}

export default function createFormItem(
  item: FormColumnProps,
  index: number,
  context: FormRenderContext,
  options: FormRenderOptions
): VNode | undefined {
  const itemType = item.type || 'input'
  const slotSuffix = options.slotSuffix || ''

  if (context._handelColumnDisPlay && !context._handelColumnDisPlay({
    col: item,
    column: context.column,
    form: context.newForm.value,
    xBoxType: context.xBoxType?.value
  })) {
    return undefined
  }

  const colSpan = context._getColSpan ? context._getColSpan(item, item.span || context.formSpan) : item.span || context.formSpan
  
  const formItemChildren: {
    label: () => VNode | VNode[],
    default: () => VNode | VNode[] | Slot | undefined
  } = {
    label: () => <div class="flex flex-items-center">
      {item.label}
      {item.labelTip && <ElTooltip
        placement={item?.labelTipPlacement || context.labelTipPlacement}
        v-slots={{
          content: () => item.labelTip
        }}
      >
        <ElIcon><QuestionFilled /></ElIcon>
      </ElTooltip>}
    </div>,
    default: () => <></>
  }

  if (!context.slots[item.prop + slotSuffix]) {
    formItemChildren.default = () => createFormItemComponent(item, itemType, context, options)
  } else {
    const slotData = {
      ...item,
      xBoxType: context.xBoxType?.value ?? (options.isView ? 'check' : undefined)
    }
    formItemChildren.default = () => context.slots[item.prop + slotSuffix]?.(slotData)
  }

  if (item.tip) {
    const originalDefault = formItemChildren.default
    formItemChildren.default = () => <>
      {originalDefault?.()}
      <ElTooltip
        placement={item?.tipPlacement || context.tipPlacement}
        v-slots={{
          content: () => item.tip
        }}
      >
        <ElIcon><TipOutlined /></ElIcon>
      </ElTooltip>
    </>
  }

  return <ElCol
    class="p-b-5px"
    key={index}
    lg={colSpan}
    md={colSpan}
    xs={colSpan}
  >
    <ElFormItem
      class={[tempForm[itemType]?.formItemClass, `_${item.prop}`]}
      labelWidth={!options.isSearch ? (item.labelWidth || context.labelWidth) : undefined}
      prop={item.prop}
      labelPosition="right"
      rules={context._formatRules ? context._formatRules(item) : undefined}
      v-slots={formItemChildren}
    />
  </ElCol>
}