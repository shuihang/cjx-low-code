import { computed, createVNode, ref } from 'vue'
import { clone, cloneDeep } from 'lodash-es'
import {
  componentPropsValues,
  formColumnValues,
} from '../interface'
import {
  arraySort,
  translateCheckFormStr,
} from '../../../_util/tool'
import pick from '../../../_util/pick'
import { tempForm } from '../tempform'
import {
  ElCol,
  ElDescriptions,
  ElDescriptionsItem,
  ElFormItem,
  ElIcon,
  ElTooltip,
} from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import omit from '../../../_util/omit'
import { TipOutlined } from '../../../crud/src/icon'
// import ZtPreviewOffice from '@cjx-low-code/components/cjx-previewOffice/index.vue'
import { useLocale } from '@cjx-low-code/hooks'
import form_config from '../config'
import type { Column, TableColumnCtx } from 'element-plus'
import type {
  FormColumnProps,
  FormItemType,
  FormTypeProps,
  ColumnProps,
  DialogFormType,
} from '../interface'
import type { CSSProperties, Ref, VNode } from 'vue'
import type { SlotsValue } from '../tempform'
import XEditTable from '../../../editTable'
import { FORM_ON_EVENT_SUFFIX } from '../../../_util/env'
import { isFunction, isString } from '../../../_util/shared'
import helpers from '../helpers'

const { check_column_span, span, label_width } = form_config

export interface TemplateProps {
  column?: FormColumnProps[]
  formSpan?: number
  labelWidth: number
  newForm: Ref<object>
  slotSuffix: string
  readonly slots: any
  onUpdateModelValue: (prop: string, value: string) => void
  onSubmit?: () => void
  xBoxType?: Ref<DialogFormType>
  isView: boolean
  isFullscreen: Ref<boolean>
  collapseStatus?: Ref<boolean>
  checkColumnSpan?: number
  /** 数据（newForm）为数组才有 */
  $index?: number
}

export interface TemplateCommonProps {
  column: FormColumnProps[]
  formSpan: number
  labelWidth: number
  newForm: Ref<object>
  readonly slots: any
  onUpdateModelValue: (prop: string, value: any) => void
}

interface RenderInterface {
  init(ctx?: any): (VNode | undefined)[] | VNode | undefined
}

export interface RenderContext {
  __xBoxType: string
  fun: () => void
}

class Common implements TemplateCommonProps {
  column: TemplateCommonProps['column']
  formSpan: TemplateCommonProps['formSpan']
  labelWidth: TemplateCommonProps['labelWidth']
  newForm: TemplateCommonProps['newForm']
  public readonly slots: TemplateCommonProps['slots']
  onUpdateModelValue: TemplateCommonProps['onUpdateModelValue']
  public readonly labelTipPlacement = 'top'
  public readonly tipPlacement = 'right-start'

  constructor(data: TemplateCommonProps) {
    this.column = data.column || []
    this.formSpan = data.formSpan || span
    this.labelWidth = data.labelWidth || label_width
    this.newForm = data.newForm
    this.slots = data.slots
    this.onUpdateModelValue = data.onUpdateModelValue
  }

  /**
   * 表单排序
   */
  public _arraySort() {
    return arraySort(
      this.column as FormColumnProps[],
      'order',
      async (item) => {
        if (item.dicAjaxResolve) {
          item.dicData = await item.dicAjaxResolve
        }
      }
    )
  }

  /**
   * 获取表单项的值并进行双向绑定
   * @param path 路径，例如：a.b.c
   * @returns
   */
  public _getValueByPath(path: string) {
    const { newForm } = this
    return computed({
      get() {
        let value = newForm.value
        if (!path) return

        if (path?.indexOf('.') === -1)
          return (value as Record<string, any>)[path]

        const pathArray = path.split('.')
        pathArray.forEach((prop, index) => {
          if (
            !(value as Record<string, any>)[prop] &&
            (value as Record<string, any>)[prop] !== 0
          ) {
            ;(value as Record<string, any>)[prop] =
              index === pathArray.length - 1 ? '' : {}
          }
          value = (value as Record<string, any>)[prop]
        })
        return value
      },
      set(newValue) {
        if (!path.includes('.')) {
          ;(newForm.value as Record<string, any>)[path] = newValue
          return
        }

        const pathArray = path.split('.')
        const lastProp = pathArray.pop()
        const obj = pathArray.reduce(
          (accumulator: Record<string, any>, currentValue) => {
            return accumulator[currentValue] || { [currentValue]: '' }
          },
          newForm.value as Record<string, any>
        )
        lastProp && (obj[lastProp] = newValue)
      },
    })
  }

  /**
   * 获取表单项的除modeValue之外的值并进行双向绑定
   */
  public _getBindValue(col: FormColumnProps, itemType: FormItemType) {
    const componentBindValues: any = {}
    try {
      const componentBindKey = tempForm[itemType]?.componentBindKey || ''
      const componentBindValue = col.componentBind

      if (componentBindKey && !componentBindValue) {
        throw new Error(
          `type等于${itemType}的componentBind属性配置错误，type等于${itemType}的componentBind属性是必传的！`
        )
      }

      if (componentBindKey && componentBindValue) {
        componentBindValues[componentBindKey] =
          this.newForm.value[componentBindValue]
        componentBindValues[`onUpdate:${componentBindKey}`] = (value: string) =>
          this.onUpdateModelValue(componentBindValue, value)
      }
    } catch (e) {
      console.error(e)
    }

    return componentBindValues
  }

  /**
   * 判断表单项是否显示
   * @param col 表单项的配置
   * @param index 表单项的索引
   * @param xBoxType 弹窗类型
   * @returns Boolean
   */
  public _handelColumnDisPlay(data: {
    col: FormColumnProps,
    index: number,
    form: object,
    column: FormColumnProps[],
    xBoxType?: DialogFormType
  }) {
    const { col, index, column, xBoxType } = data
    
     const display = col.display as ColumnProps['display']
      
    if (typeof display !== 'function') return display !== false
   
    return display && display({
        form: { ...this.newForm.value },
        column,
        index,
        _xBoxType: xBoxType,
      })
  }

  /**
   * 通过表单项的类型获取国际化占位符文本
   * @param key
   * @returns
   */
  public _getI18nPlaceholder(type: FormItemType) {
    const { t } = useLocale()
    const inputPlaceholder = t('common.inputText')
    const selectPlaceholder = t('common.selectText')
    const designPlaceholder = t('common.pleaseAddText')
    const formTypeI18nMap: { [key in keyof FormTypeProps]-?: string } = {
      input: inputPlaceholder,
      textarea: inputPlaceholder,
      inputNumber: inputPlaceholder,
      select: selectPlaceholder,
      radio: selectPlaceholder,
      radioButton: selectPlaceholder,
      checkbox: selectPlaceholder,
      switch: selectPlaceholder,
      cascader: selectPlaceholder,
      datePicker: selectPlaceholder,
      treeSelect: selectPlaceholder,
      // upload: uploadPlaceholder,
      editTable: designPlaceholder,
      colorPicker: selectPlaceholder,
    }
    return formTypeI18nMap[type] || ''
  }
}

export type SearchFormProps = TemplateCommonProps & {
  onSubmit: () => void
}

/**
 * 渲染搜索表单栏
 */
export class RenderSearchFormVNode extends Common implements SearchFormProps {
  onSubmit: () => void

  constructor(data: SearchFormProps) {
    super(data)
    this.onSubmit = data.onSubmit
  }

  init() {
    if (!this.column || this.column?.length === 0) return

    return this._arraySort().map((item, index): VNode => {
      const itemType = item.type || ('input' as FormItemType)

      let componentProps: any = {}
      const pickProps = pick(item, componentPropsValues)
      componentPropsValues.map((typeValue) => {
        componentProps = { ...componentProps, ...pickProps[typeValue] }
      })

      const componentSlotNodes = item.formSlotNodes
        ? pick(item.formSlotNodes, tempForm[itemType]?.slots as SlotsValue)
        : {}

      const isDesign = tempForm[itemType]?.isDesign || false

      const { otherPropsFn } = tempForm[itemType]
      if (otherPropsFn) {
        componentProps = { ...componentProps, ...otherPropsFn(item) }
      }

      const subComponent = tempForm[itemType]?.subComponent
      return (
        <ElCol
          class={'p-b-5px'}
          key={index}
          lg={item.span || this.formSpan}
          md={item.span || this.formSpan}
          xs={item.span || this.formSpan || 24}
        >
          <ElFormItem
            label-width={item.labelWidth}
            prop={item.prop}
            class={[tempForm[itemType]?.formItemClass, `_${item.prop}`]}
            v-slots={{
              label: () => (
                <div class={'flex flex-items-center'}>
                  {item.label}
                  {item.labelTip && (
                    <ElTooltip
                      v-slots={{
                        content: () => item.labelTip,
                      }}
                      placement={
                        item?.labelTipPlacement || this.labelTipPlacement
                      }
                    >
                      <ElIcon>
                        <QuestionFilled />
                      </ElIcon>
                    </ElTooltip>
                  )}
                </div>
              ),
            }}
          >
            {!this.slots[`${`${item.prop}Search`}`]
              ? createVNode(
                  tempForm[itemType]?.component,
                  {
                    ...omit(item, formColumnValues),
                    ...pick(item, tempForm[itemType]?.props || []),
                    ...tempForm[itemType]?.[itemType],
                    showWordLimit: false,
                    ...(() =>
                      !isDesign
                        ? {
                            ...pick(tempForm[itemType], ['type']),
                            ...componentProps,
                            style: {
                              width: item.tip ? 'calc(100% - 14px)' : '100%',
                              ...item.style,
                            } as CSSProperties,
                            clearable: item.clearable,
                            placeholder:
                              item.placeholder ||
                              super._getI18nPlaceholder(itemType) + item.label,
                          }
                        : componentProps)(),
                    modelValue: this._getValueByPath(item.prop).value,
                    onKeyup: (e: KeyboardEvent) => {
                      // 执行需要的操作
                      e.key === 'Enter' && this.onSubmit()
                    },
                    'onUpdate:modelValue': (value: string) =>
                      this.onUpdateModelValue(item.prop, value),
                    ...this._getBindValue(item, itemType),
                  },
                  {
                    default: subComponent
                      ? () => {
                          return (
                            item.dicData &&
                            item.dicData.map((temp) => {
                              // element-plus 组件库得select组件的label属性 不支持VNode节点 得特殊处理
                              const labelKey = item.props?.label || 'label'
                              const label = isString(temp[labelKey]) ? temp[labelKey]
                                  : temp[labelKey]?.el?.parentNode.innerText
                              const value = temp[item.props?.value || 'value']

                              return createVNode(
                                subComponent,
                                {
                                  ...temp,
                                  value,
                                  label:
                                    item.type === 'checkbox' ||
                                    item.type === 'radioButton' ||
                                    item.type === 'radio'
                                      ? value
                                      : label,
                                  key: value
                                },
                                {
                                  default: () => temp[labelKey]
                                }
                              )
                            })
                          )
                        }
                      : undefined,
                    ...componentSlotNodes,
                  }
                )
              : this.slots[`${`${item.prop}Search`}`]?.(item)}
            {item.tip && (
              <ElTooltip
                v-slots={{
                  content: () => item.tip,
                }}
                placement={item?.tipPlacement || this.tipPlacement}
              >
                <TipOutlined />
              </ElTooltip>
            )}
          </ElFormItem>
        </ElCol>
      )
    })
  }
}

interface RenderFormVNodeProps {
  slotSuffix: string
  xBoxType?: Ref<DialogFormType>
  isFullscreen: Ref<boolean>
}

/**
 * 渲染表单
 */
export class RenderFormVNode extends Common implements RenderInterface {
  slotSuffix: string
  xBoxType?: Ref<DialogFormType>
  isFullscreen: Ref<boolean>

  constructor(data: TemplateCommonProps & RenderFormVNodeProps) {
    super(data)
    this.slotSuffix = data.slotSuffix
    this.xBoxType = data.xBoxType
    this.isFullscreen = data.isFullscreen || ref(false)
  }

  /**
   * 按照产品要求 设置栅格的span
   * @param col 表单列配置
   * @param span 栅格的默认span
   * @returns
   */
  public _getColSpan(col: FormColumnProps, span: number): number {
    if (this.isFullscreen.value) {
      if (
        ['textarea', 'sign'].includes(col.type || 'input') ||
        (col.type === 'select' && col?.select?.multiple)
      )
        return 24
      return 12
    }
    return span
  }

  /**
   * 格式化输入框和文本域组件 空字符校验通过的问题
   * @param col 表单列配置
   * @returns 
   */
  public _formatRules(col: FormColumnProps) {
    if (!col?.rules) return []
    const rules = JSON.parse(JSON.stringify(col.rules))
    if (
      !this.slots[col.prop + this.slotSuffix] &&
      ['input', 'textarea'].includes(col.type || 'input')
    ) {
      rules.map((item) => {
        if (item.required) {
          // 解决空字符串校验通过
          item.pattern = '[^ \x20]+'
        }
      })
    }

    return rules
  }

  public _handleOnEvent(row: FormColumnProps, type: FormItemType) {
    const { on } = row
    const onType = type + FORM_ON_EVENT_SUFFIX
    if (!on || !on![onType]) {
      return {}
    }
    const onObj: FormColumnProps['on'] = {}
    Object.keys(on[onType]).forEach((key) => {
      if (isFunction(on[onType][key])) {
        onObj[key] = (...args: any[]) => {
          on[onType][key](...args, helpers({
            columns: this.column,
            onUpdateModelValue: this.onUpdateModelValue,
            currentColumn:{...row}}
          ))
        }
      }
    })
    return onObj
  }

  init() {
    if (!this.column || this.column?.length === 0) return
    const columns = clone(super._arraySort())
    const form = clone(this.newForm.value)

    return columns.map((item, index): VNode | undefined => {
         if (
          !this._handelColumnDisPlay({ 
            col: item,
            index,
            column: columns,
            form,
            xBoxType: this.xBoxType?.value
          })) return

        const disabled = item.disabled as ColumnProps['disabled']
        
        const itemType = item.type || ('input' as FormItemType)

        let componentProps: any = {}
        const pickProps = pick(item, componentPropsValues)
        componentPropsValues.map((typeValue) => {
          componentProps = { ...componentProps, ...pickProps[typeValue] }
        })

        const componentSlotNodes = item.formSlotNodes
          ? pick(item.formSlotNodes, tempForm[itemType]?.slots as SlotsValue)
          : {}

        const isDesign = tempForm[itemType]?.isDesign || false

        const { otherPropsFn } = tempForm[itemType]
        if (otherPropsFn) {
          componentProps = { ...componentProps, ...otherPropsFn(item) }
        }

        const subComponent = tempForm[itemType]?.subComponent
        return (
          <ElCol
            class={'p-b-5px'}
            key={index}
            lg={this._getColSpan(item, item.span || this.formSpan)}
            md={this._getColSpan(item, item.span || this.formSpan)}
            xs={this._getColSpan(item, item.span || this.formSpan || 24)}
          >
            <ElFormItem
              label-width={item.labelWidth || this.labelWidth}
              prop={item.prop}
              rules={this._formatRules(item)}
              class={[tempForm[itemType]?.formItemClass, `_${item.prop}`]}
              v-slots={{
                label: () => (
                  <div class={'flex flex-items-center'} style={item.labelStyle}>
                    {item.label}
                    {item.labelTip && (
                      <ElTooltip
                        v-slots={{
                          content: () => item.labelTip,
                        }}
                        placement={
                          item?.labelTipPlacement || this.labelTipPlacement
                        }
                      >
                        <ElIcon>
                          <QuestionFilled />
                        </ElIcon>
                      </ElTooltip>
                    )}
                  </div>
                ),
              }}
            >
              {!this.slots[item.prop + this.slotSuffix] ? (
                createVNode(
                  tempForm[itemType]?.component,
                  {
                    ...omit(item, formColumnValues),
                    ...pick(item, tempForm[itemType]?.props || []),
                    ...tempForm[itemType]?.[itemType],
                    ...(() =>
                      !isDesign
                        ? {
                            ...pick(tempForm[itemType], ['type']),
                            ...componentProps,
                            style: {
                              width: item.tip ? 'calc(100% - 14px)' : '100%',
                              ...item.style,
                            } as CSSProperties,
                            clearable: item.clearable,
                            placeholder:
                              item.placeholder ||
                              super._getI18nPlaceholder(itemType) + item.label,
                          }
                        : componentProps)(),
                    modelValue: this._getValueByPath(item.prop).value,
                    ...this._handleOnEvent(item, itemType),
                    'onUpdate:modelValue': (value: string) =>
                      this.onUpdateModelValue(item.prop, value),
                    ...this._getBindValue(item, itemType),
                    disabled: isFunction(disabled) ? disabled({
                      form: { ...this.newForm.value },
                      column: this.column,
                      index,
                      _xBoxType: this.xBoxType?.value,
                    }) as ColumnProps['disabled'] : item.disabled,
                  },
                  {
                    default: subComponent
                      ? () => {
                          return (
                            item.dicData &&
                            item.dicData.map((temp) => {
                              // element-plus 组件库得select组件的label属性 不支持VNode节点 得特殊处理
                              const labelKey = item.props?.label || 'label'
                              const vlaueKey = item.props?.value || 'value'
                              const label = isString(temp[labelKey]) ? temp[labelKey]
                                  : temp[labelKey]?.el?.parentNode.innerText
                              const value = temp[vlaueKey]

                              return createVNode(
                                subComponent,
                                {
                                  ...temp,
                                  value,
                                  label:
                                    item.type === 'checkbox' ||
                                    item.type === 'radioButton' ||
                                    item.type === 'radio'
                                      ? value
                                      : label,
                                  key: value
                                },
                                {
                                  default: () => temp[labelKey]                   
                                }
                              )
                            })
                          )
                        }
                      : undefined,
                    ...componentSlotNodes,
                  }
                )
              ) : (
                <div class="w-100%">
                  {this.slots[item.prop + this.slotSuffix]?.({
                    ...item,
                    _xBoxType: this.xBoxType?.value,
                  })}
                </div>
              )}
              {item.tip && (
                <ElTooltip
                  v-slots={{
                    content: () => item.tip,
                  }}
                  placement={item?.tipPlacement || this.tipPlacement}
                >
                  <TipOutlined />
                </ElTooltip>
              )}
            </ElFormItem>
          </ElCol>
        )
      })
  }
}

interface RenderViewFormVNodeProps {
  slotSuffix: string
  /** 折叠状态 */
  collapseStatus: Ref<boolean>
  /** 表单查看模式的 一行 Descriptions Item 的数量 */
  checkColumnSpan?: number
  /** 数据为数组时才有 */
  $index?: number
}

/**
 *  用于表单查看模式的表单渲染
 */
export class RenderViewFormVNode extends Common implements RenderInterface {
  slotSuffix: string
  collapseStatus: Ref<boolean>
  checkColumnSpan?: number
  xBoxType?: Ref<DialogFormType>
  $index?: number
  constructor(data: TemplateCommonProps & RenderViewFormVNodeProps) {
    super(data)
    this.slotSuffix = data.slotSuffix
    this.collapseStatus = data.collapseStatus || ref(false)
    this.checkColumnSpan = data.checkColumnSpan || check_column_span
    this.$index = data.$index
  }

  public valueMap: Record<string, any> = {
    editTable: (column: ColumnProps) => {
      const value = this.newForm.value[column.prop] || []
      // @ts-ignore
      const option = column.editTable?.option || {}
      return <XEditTable modelValue={value} option={option} isView />
    }
    // upload: (column: ColumnProps) => {
    //   const value = this.newForm.value[column.prop]
    //   const props = column.upload?.isFiles
    //     ? {
    //         files: value
    //       }
    //     : { images: value }
    //   return <ZtPreviewOffice {...props} />
    // },
  }

  /**
   * ts 装饰器写法 注入ztBoxType参数
   */
  // @SETParameter({
  //   xBoxType: 'check'
  // })
  // 处理
  public _handleCheckValue(
    value: string | number | any[],
    column: ColumnProps
  ) {
    if (this.valueMap[column.type || 'input'])
      return this.valueMap[column.type || 'input'](column)

    return column.dicData
      ? translateCheckFormStr(
          this._getValueByPath(column.prop).value,
          column.dicData,
          column.props
        )?.toString()
      : this._getValueByPath(column.prop).value
  }

  public _judgeViewFormSpan(col: FormColumnProps): number {
    if (['textarea', 'sign', 'upload'].includes(col.type || 'input'))
      return col?.checkSpan || col?.span || 2
    return col?.checkSpan || col?.span || 1
  }

  init() {
    if (!this.column || this.column?.length === 0) return
   const columns = clone(super._arraySort())
    const form = clone(this.newForm.value)

    return (
      <ElDescriptions
        class={'w-100% p-l-10px p-t-15px m-b-20px'}
        border
        column={this.checkColumnSpan}
      >
        {columns.map((item, index) => {
          if (!this._handelColumnDisPlay({ col: item, index, column: columns, form, xBoxType: this.xBoxType?.value })) {
            return <></>
          }
          
          const descriptionsItemName =
            !this.collapseStatus.value ||
            item?.collapseShow === true ||
            (typeof item?.collapseShow == 'function' &&
              item?.collapseShow!({
                form: { ...this._getValueByPath(item.prop).value },
                column: columns,
              }))
              ? 'cjx-view-descriptions-item'
              : 'cjx-view-descriptions-item-none'

          return (
            <ElDescriptionsItem
              width={this.labelWidth}
              span={this._judgeViewFormSpan(item)}
              label-align="right"
              v-slots={{ label: () => <>{item.label}</> }}
              key={index}
              class-name={descriptionsItemName}
              label-class-name={descriptionsItemName}
            >
              {!this.slots[item.prop + this.slotSuffix]
                ? item.formatter
                  ? item.formatter(
                      this.newForm.value,
                      item as unknown as TableColumnCtx<Column>,
                      this._getValueByPath(item.prop).value,
                      index
                    )
                  : this._handleCheckValue(
                      this._getValueByPath(item.prop).value,
                      item
                    )
                : this.slots[item.prop + this.slotSuffix]?.({
                    ...item,
                    _xBoxType: 'check',
                    $value: this._getValueByPath(item.prop).value,
                    $index: this.$index,
                  })}
            </ElDescriptionsItem>
          )
        })}
      </ElDescriptions>
    )
  }
}
