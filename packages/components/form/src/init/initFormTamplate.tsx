import { computed, ref } from 'vue'
import type { Ref, VNode } from 'vue'
import { clone, cloneDeep } from 'lodash-es'
import {
  ElDescriptions,
  ElDescriptionsItem,
} from 'element-plus'
import type { Column, TableColumnCtx } from 'element-plus'
import { useLocale } from '@cjx-low-code/hooks'
import XEditTable from '../../../editTable'
import { FORM_ON_EVENT_SUFFIX } from '../../../_util/env'
import { isFunction } from '../../../_util/shared'
import {
  arraySort,
  translateCheckFormStr,
} from '../../../_util/tool'
import { defaultOnError as onError, createError, ErrorCodes } from '../../../_util/errors'
import type { PickRequiredOptional } from '../../../_util/type'
import { MeasurePerformance } from '../../../_util/decorator/PerformanceDecorator'
import type {
  FormColumnProps,
  FormItemType,
  FormTypeProps,
  ColumnProps,
  DialogFormType,
} from '../interface'
import { FormRender } from './FormRenderDecorator'
import { tempForm } from '../tempform'
import helpers from '../helpers'
import form_config from '../config'

const {
  check_column_span, span, label_width, tipPlacement, labelTipPlacement, getColumnFormType,
  EMPTY_STRINGFORM_ITEMS, FULLSCREEN_COL_SPAN_24_FORM_ITEMS, VIEW_FORM_COL_SPAN_24_FORM_ITEMS, CHECK_LABEL_ALIGN
} = form_config

export interface TemplateProps {
  column?: FormColumnProps[]
  formSpan?: number
  labelWidth: number
  newForm: Ref<object>
  slotSuffix: string
  readonly slots: any
  onUpdateModelValue: (prop: string, value: any) => void
  onSubmit?: () => void
  xBoxType?: Ref<DialogFormType>
  isView: boolean
  isFullscreen: Ref<boolean>
  collapseStatus?: Ref<boolean>
  checkColumnSpan?: number
  /** 数据（newForm）为数组才有 */
  $index?: number
}

export type TemplateCommonProps = PickRequiredOptional<TemplateProps, 'column' | 'formSpan' | 'labelWidth' | 'newForm' | 'slotSuffix' | 'slots' | 'onUpdateModelValue', 'xBoxType'>

interface RenderInterface {
  init(ctx?: any): (VNode | undefined)[] | VNode | undefined
}

export interface RenderContext {
  __xBoxType: string
  fun: () => void
}

export class Common implements TemplateCommonProps {
  column: TemplateCommonProps['column']
  formSpan: TemplateCommonProps['formSpan']
  labelWidth: TemplateCommonProps['labelWidth']
  newForm: TemplateCommonProps['newForm']
  slotSuffix: TemplateCommonProps['slotSuffix']
  public readonly slots: TemplateCommonProps['slots']

  onUpdateModelValue: TemplateCommonProps['onUpdateModelValue']
  public readonly labelTipPlacement = labelTipPlacement
  public readonly tipPlacement = tipPlacement

  constructor(data: TemplateCommonProps) {
    this.column = data.column || []
    this.formSpan = data.formSpan || span
    this.labelWidth = data.labelWidth || label_width
    this.newForm = data.newForm
    this.slotSuffix = data.slotSuffix
    this.slots = data.slots
    this.onUpdateModelValue = data.onUpdateModelValue
  }

  /**
   * 表单排序
   */
  @MeasurePerformance({ threshold: 100 })
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
  @MeasurePerformance({ threshold: 50, log: false })
  public _getValueByPath(path: string) {
    const { newForm } = this
    
    if (!this._computedCache) {
      this._computedCache = {}
    }
    
    if (!this._computedCache[path]) {
      this._computedCache[path] = computed({
        get() {
          if (!path) return
          
          let value = newForm.value
          if (path?.indexOf('.') === -1) return value[path]
  
          const pathArray = path.split('.')
          pathArray.forEach((prop, index) => {
            if (!value[prop] && value[prop] !== 0 ) {
              value[prop] = index === pathArray.length - 1 ? '' : {}
            }
            value = value[prop]
          })
          return value
        },
        set(newValue) {
          if (!path) return
          
          if (path.indexOf('.') === -1) {
            newForm.value[path] = newValue
            return
          }
  
          const pathArray = path.split('.')
          const lastProp = pathArray.pop()
          if (!lastProp) return
          
          let current = newForm.value
          for (let i = 0; i < pathArray.length; i++) {
            const prop = pathArray[i]
            if (current[prop] === undefined || current[prop] === null) {
              current[prop] = {}
            }
            current = current[prop]
          }
          current[lastProp] = newValue
        },
      })
    }
    
    return this._computedCache[path]
  }
  
  private _computedCache: Record<string, any> = {}

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
    } catch (error) {
      onError(createError(ErrorCodes.FORM_ITEM_RENDER_GETBIND_VALUE_ERROR, String(error)))
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
    form: object,
    column: FormColumnProps[],
    xBoxType?: DialogFormType
  }) {
    const { col, column, xBoxType } = data
    
    const display = col.display as ColumnProps['display']
      
    if (!isFunction(display)) return display !== false
   
    return display && display({
        form: { ...this.newForm.value },
        column,
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
    // 搜索表单的label宽度设为0
    this.labelWidth = 0
    this.onSubmit = data.onSubmit
  }

  @MeasurePerformance({ threshold: 100, prefix: "Search Form Render Performance" })
  @FormRender({ isSearch: true })
  init() {
    if (!this.column || this.column?.length === 0) return
    return this._arraySort()
  }
}

interface RenderFormVNodeProps {
  xBoxType?: Ref<DialogFormType>
  isView: boolean
  isFullscreen: Ref<boolean>
}

/**
 * 渲染表单
 */
export class RenderFormVNode extends Common implements RenderInterface {
  xBoxType?: Ref<DialogFormType>
  isFullscreen: Ref<boolean>
  isView: boolean

  constructor(data: TemplateCommonProps & RenderFormVNodeProps) {
    super(data)
    this.xBoxType = data.xBoxType
    this.isView = data.isView
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
        FULLSCREEN_COL_SPAN_24_FORM_ITEMS.includes(getColumnFormType(col)) ||
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
      EMPTY_STRINGFORM_ITEMS.includes(getColumnFormType(col))
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

  @MeasurePerformance({ threshold: 100, prefix: "Form Render Performance" })
  @FormRender({ useComponentPropsValues: true })
  init(): (VNode | undefined)[] | VNode | undefined {
    if (!this.column || this.column?.length === 0) return
    return super._arraySort() as unknown as (VNode | undefined)[] | VNode | undefined
  }
}

interface RenderViewFormVNodeProps {
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
  collapseStatus: Ref<boolean>
  checkColumnSpan?: number
  xBoxType?: Ref<DialogFormType>
  $index?: number
  constructor(data: TemplateCommonProps & RenderViewFormVNodeProps) {
    super(data)
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
    //   return <XPreviewOffice {...props} />
    // },
  }

  // @SETParameter({
  //   xBoxType: 'check'
  // })
  // 处理查看模式下的特殊情况
  public _handleCheckValue(
    value: string | number | any[],
    column: ColumnProps
  ) {
    if (this.valueMap[getColumnFormType(column)])
      return this.valueMap[getColumnFormType(column)](column)

    return column.dicData
      ? translateCheckFormStr(
          this._getValueByPath(column.prop).value,
          column.dicData,
          column.props
        )?.toString()
      : this._getValueByPath(column.prop).value
  }

  public _judgeViewFormSpan(col: FormColumnProps): number {
    if (VIEW_FORM_COL_SPAN_24_FORM_ITEMS.includes(getColumnFormType(col)))
      return col?.checkSpan || col?.span || 2
    return col?.checkSpan || col?.span || 1
  }

  @MeasurePerformance({ threshold: 150, prefix: "Check Form Render Performance" })
  init() {
    if (!this.column || this.column?.length === 0) return
    const columns = clone(super._arraySort())
    const column = clone(columns)
    const form = clone(this.newForm.value)

    return (
      <ElDescriptions
        class={'w-100% p-l-10px p-t-15px m-b-20px'}
        border
        column={this.checkColumnSpan}
      >
        {columns.map((item, index) => {
          if (!this._handelColumnDisPlay({ col: item, column, form, xBoxType: 'check'})) return
          
          const descriptionsItemName =
            !this.collapseStatus.value ||
            item?.collapseShow === true ||
            (isFunction(item?.collapseShow) &&
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
              label-align={CHECK_LABEL_ALIGN}
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
