import { computed, createVNode, ref } from 'vue'
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
import { cloneDeep } from 'lodash-es'
import { useLocale } from '@cjx-low-code/hooks'
import form_config from '../config'
import type { Column, TableColumnCtx } from 'element-plus'
import type {
  FormColumnProps,
  FormItemType,
  FormTypeProps,
} from '../interface'
import type {
  ColumnProps,
  DialogFormType,
} from '../interface'
import type { CSSProperties, Component, Ref, VNode } from 'vue'
import type { SlotsValue } from '../tempform'

const { check_column_span } = form_config

export interface TemplateProps {
  column?: FormColumnProps[]
  formSpan?: number
  labelWidth: number
  newForm: Ref<object>
  slotSuffix: string
  readonly slots: any
  onUpdateModelValue: (prop: string, value: string) => void
  onSubmit?: () => void
  ztBoxType?: Ref<DialogFormType>
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
  onUpdateModelValue: (prop: string, value: string) => void
}

interface RenderInterface {
  init(ctx?: any): VNode[] | VNode | undefined
}

export interface RenderContext {
  __ztBoxType: string
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
    this.formSpan = data.formSpan || 12
    this.labelWidth = data.labelWidth || 90
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
   * 表单排序并过滤不显示的表单项
   * @returns
   */
  public _arraySortFilterDisPlay(ztBoxType?: DialogFormType) {
    return this._arraySort()?.filter((item, index) => {
      const column = cloneDeep(this.column) as FormColumnProps[]

      if (typeof item.display !== 'function') return item.display !== false

      return item?.display({
        form: { ...this.newForm.value },
        column,
        index,
        _ztBoxType: ztBoxType,
      })
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

      const { otherPropsFunc } = tempForm[itemType]
      if (otherPropsFunc) {
        componentProps = { ...componentProps, ...otherPropsFunc(item) }
      }
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
                    modelValue: this._getValueByPath(item.prop).value, // this.newForm.value[item.prop],
                    // onChange: (val: any) => {
                    //   const { change: tempFormChange } = tempForm[itemType]
                    //   item?.change
                    //     ? item.change(val, this.column)
                    //     : tempFormChange &&
                    //       tempFormChange(val, this.column)
                    // },
                    onKeyup: (e: KeyboardEvent) => {
                      // 执行需要的操作
                      e.keyCode === 13 && this.onSubmit()
                    },
                    'onUpdate:modelValue': (value: string) =>
                      this.onUpdateModelValue(item.prop, value),
                    ...this._getBindValue(item, itemType),
                  },
                  {
                    default: tempForm[itemType]?.subComponent
                      ? () => {
                          return (
                            item.dicData &&
                            item.dicData.map((temp) => {
                              // element-plus 组件库得select组件的label属性 不支持VNode节点 得特殊处理
                              const label =
                                typeof temp[item.props?.label || 'label'] ===
                                'string'
                                  ? temp[item.props?.label || 'label']
                                  : temp[item.props?.label || 'label']?.el
                                      ?.parentNode.innerText
                              const value = temp[item.props?.value || 'value']

                              return createVNode(
                                tempForm[itemType]?.subComponent as Component,
                                {
                                  ...temp,
                                  value,
                                  label:
                                    item.type === 'checkbox' ||
                                    item.type === 'radioButton' ||
                                    item.type === 'radio'
                                      ? value
                                      : label,
                                  key: value,
                                },
                                {
                                  default: () =>
                                    temp[item.props?.label || 'label'],
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
  ztBoxType?: Ref<DialogFormType>
  isFullscreen: Ref<boolean>
}

/**
 * 渲染表单
 */
export class RenderFormVNode extends Common implements RenderInterface {
  slotSuffix: string
  ztBoxType?: Ref<DialogFormType>
  isFullscreen: Ref<boolean>

  constructor(data: TemplateCommonProps & RenderFormVNodeProps) {
    super(data)
    this.slotSuffix = data.slotSuffix
    this.ztBoxType = data.ztBoxType
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

    if (
      !this.slots[col.prop + this.slotSuffix] &&
      ['input', 'textarea'].includes(col.type || 'input')
    ) {
      col.rules.map((item) => {
        if ((item as any).required) {
          // 解决空字符串校验通过
          ;(item as any).pattern = '[^ \u0020]+'
        }
      })
    }

    return [...col.rules]
  }

  init() {
    if (!this.column || this.column?.length === 0) return

    return super
      ._arraySortFilterDisPlay(this.ztBoxType?.value)
      .map((item, index): VNode => {
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

        const { otherPropsFunc } = tempForm[itemType]
        if (otherPropsFunc) {
          componentProps = { ...componentProps, ...otherPropsFunc(item) }
        }

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
                    modelValue: this._getValueByPath(item.prop).value, // this.newForm.value[item.prop],

                    ...item?.on,
                    onChange: (val: any) => {
                      const { change: tempFormChange } = tempForm[itemType]
                      item?.change
                        ? item.change(val, this.column as FormColumnProps[])
                        : tempFormChange &&
                          tempFormChange(val, this.column as FormColumnProps[])
                    },
                    'onUpdate:modelValue': (value: string) =>
                      this.onUpdateModelValue(item.prop, value),
                    ...this._getBindValue(item, itemType),
                    disabled:
                      typeof item.disabled === 'function'
                        ? item.disabled({
                            form: { ...this.newForm.value },
                            column: this.column,
                            index,
                            _ztBoxType: this.ztBoxType?.value,
                          })
                        : item.disabled,
                  },
                  {
                    default: tempForm[itemType]?.subComponent
                      ? () => {
                          return (
                            item.dicData &&
                            item.dicData.map((temp) => {
                              // element-plus 组件库得select组件的label属性 不支持VNode节点 得特殊处理
                              const label =
                                typeof temp[item.props?.label || 'label'] ===
                                'string'
                                  ? temp[item.props?.label || 'label']
                                  : temp[item.props?.label || 'label']?.el
                                      ?.parentNode.innerText
                              const value = temp[item.props?.value || 'value']

                              return createVNode(
                                tempForm[itemType]?.subComponent as Component,
                                {
                                  ...temp,
                                  value,
                                  label:
                                    item.type === 'checkbox' ||
                                    item.type === 'radioButton' ||
                                    item.type === 'radio'
                                      ? value
                                      : label,
                                  key: value,
                                },
                                {
                                  default: () =>
                                    temp[item.props?.label || 'label'],
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
                    _ztBoxType: this.ztBoxType?.value,
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
  checkColumnSpan: number
  /** 数据为数组时才有 */
  $index?: number
}

/**
 *  用于表单查看模式的表单渲染
 */
export class RenderViewFormVNode extends Common implements RenderInterface {
  slotSuffix: string
  collapseStatus: Ref<boolean>
  checkColumnSpan: number
  $index?: number
  constructor(data: TemplateCommonProps & RenderViewFormVNodeProps) {
    super(data)
    this.slotSuffix = data.slotSuffix
    this.collapseStatus = data.collapseStatus || ref(false)
    this.checkColumnSpan = data.checkColumnSpan || check_column_span
    this.$index = data.$index
  }

  public valueMap: Record<string, any> = {
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
  //   ztBoxType: 'check'
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
    const columns = super._arraySortFilterDisPlay('check')
    if (!columns || columns?.length === 0) return
    return (
      <ElDescriptions
        class={'w-100% p-l-10px p-t-15px m-b-20px'}
        border
        column={this.checkColumnSpan}
      >
        {columns.map((item, index) => {
          const descriptionsItemName =
            !this.collapseStatus.value ||
            item?.collapseShow === true ||
            (typeof item?.collapseShow == 'function' &&
              item?.collapseShow!({
                form: { ...this._getValueByPath(item.prop).value },
                column: cloneDeep(this.column) as FormColumnProps[],
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
                      this._getValueByPath(item.prop).value, // this.newForm.value[item.prop],
                      index
                    )
                  : this._handleCheckValue(
                      this._getValueByPath(item.prop).value,
                      item
                    )
                : this.slots[item.prop + this.slotSuffix]?.({
                    ...item,
                    _ztBoxType: 'check',
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
