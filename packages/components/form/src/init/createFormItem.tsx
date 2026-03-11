import { createVNode } from 'vue'
import { ElCol, ElFormItem, ElIcon, ElTooltip } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import pick from '../../../_util/pick'
import omit from '../../../_util/omit'
import { isFunction, isString } from '../../../_util/shared'
import { tempForm } from '../tempform'
import { componentPropsValues, formColumnValues } from '../interface'
import { TipOutlined } from '../../../crud/src/icon'
import formConfig from '../config'
import type { ColumnProps } from '../../../crud'
import type { SlotsValue } from '../tempform'
import type { FormItemType, FormTypeProps, SchemaProvide } from '../interface'
import type { FormRenderContext, FormRenderOptions } from './FormRenderDecorator'
import type { CSSProperties, Slot, VNode } from 'vue'

const { LABEL_POSITION, getColumnFormType } = formConfig

const needHandelLabelComponentArr = ['checkbox', 'radioButton', 'radio']

function createFormItemComponent(
  item: SchemaProvide,
  itemType: FormItemType,
  context: FormRenderContext,
  options: FormRenderOptions
): VNode | VNode[] {
  let componentProps: FormTypeProps[keyof FormTypeProps] | object = {}
  const componentSlotNodes = item.formSlotNodes
    ? pick(item.formSlotNodes, tempForm[itemType]?.slots as SlotsValue)
    : {}
  const isDesign = tempForm[itemType]?.isDesign || false

  if (options.useComponentPropsValues) {
    const pickProps = pick(item, componentPropsValues)
    componentPropsValues.forEach((typeValue) => {
      // @ts-ignore
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
    ...context._getBindValue(item, itemType)
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

  if (context._formatRules && !options.isSearch && item.disabled) {
    const disabled = item.disabled as ColumnProps['disabled']
    baseProps.disabled = isFunction(disabled)
      ? disabled({
          form: { ...context.newForm.value },
          schemaField: context.schemaField,
          _xBoxType: context.xBoxType?.value
        })
      : item.disabled
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
        const label = isString(temp[labelKey])
          ? temp[labelKey]
          : temp[labelKey]?.el?.parentNode.innerText
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
  item: SchemaProvide,
  index: number,
  context: FormRenderContext,
  options: FormRenderOptions
): VNode | undefined {
  const itemType = getColumnFormType(item)
  const slotSuffix = options.slotSuffix || ''

  if (
    context._handelColumnDisPlay &&
    !context._handelColumnDisPlay({
      col: item,
      schemaField: context.schemaField,
      form: context.newForm.value,
      xBoxType: context.xBoxType?.value
    })
  )
    return

  const colSpan = context._getColSpan
    ? context._getColSpan(item, item.span || context.formSpan)
    : item.span || context.formSpan

  const formItemChildren: {
    label: () => VNode | VNode[]
    default: () => VNode | VNode[] | Slot | undefined
  } = {
    label: () => (
      <div class="flex flex-items-center">
        {item.label}
        {item.labelTip && (
          <ElTooltip
            placement={item?.labelTipPlacement || context.labelTipPlacement}
            v-slots={{
              content: () => item.labelTip
            }}
          >
            <ElIcon>
              <QuestionFilled />
            </ElIcon>
          </ElTooltip>
        )}
      </div>
    ),
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
    formItemChildren.default = () => (
      <>
        {originalDefault?.()}
        <ElTooltip
          placement={item?.tipPlacement || context.tipPlacement}
          v-slots={{
            content: () => item.tip
          }}
        >
          <ElIcon>
            <TipOutlined />
          </ElIcon>
        </ElTooltip>
      </>
    )
  }

  return (
    <ElCol class="p-b-5px" key={index} lg={colSpan} md={colSpan} xs={colSpan}>
      <ElFormItem
        class={[tempForm[itemType]?.formItemClass, `_${item.prop}`]}
        labelWidth={!options.isSearch ? item.labelWidth || context.labelWidth : undefined}
        prop={item.prop}
        labelPosition={LABEL_POSITION}
        rules={context._formatRules ? context._formatRules(item) : undefined}
        v-slots={formItemChildren}
      />
    </ElCol>
  )
}
