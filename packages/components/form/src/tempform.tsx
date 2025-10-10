import {
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
  ElSwitch,
  ElTreeSelect,
} from 'element-plus'
// import ZtFileUpload from '@cjx-low-code/components/cjx-uploadFile/index.vue';
import XEditTable from '../../editTable'
import { useLocale } from '@cjx-low-code/hooks'
import type {
  FormColumnProps,
  FormItemType,
  FormStateProps,
  FormTypeProps,
} from './interface'
import type { Component, VNode } from 'vue'

const { t } = useLocale()

// const COMPONENT_HEAD = 'el';

export const inputPlaceholder = t('common.inputText')
export const selectPlaceholder = t('common.selectText')
export const designPlaceholder = '请添加' // t('common.pleaseAddText');
export const uploadPlaceholder = '请上传' // t('common.uploadText');

export interface SlotNodesInterface {
  tag?: () => VNode
  header?: () => VNode
}

export type SlotsValue = (keyof SlotNodesInterface)[]

export type SelectPeopleModelValue = { nickName: string; userId: string }[]

export interface PropsToForm {
  // 组件的名称
  component: Component
  // 子组件
  subComponent?: Component
  // 组件的插槽
  slots?: SlotsValue
  // 组件的类型
  type?: string
  /** 响应事件 */
  change?: (value: any, column: FormColumnProps[]) => void
  placeholder?: string
  // 是否业务组件
  isDesign?: boolean
  //
  formItemClass?: string
  // 需要的props
  props?: FormStateProps[]
  // 默认值
  defaultValue?: []
  /** 需要绑定的值 */
  componentBindKey?: string
  /** 其他的需要绑定的数据 */
  otherPropsFunc?: (column: FormColumnProps) => object
  // 样式值 的转化
  // initialTransform?: (v: any, ...args: any[]) => any,
  // // 处理数据
  // afterTransform?: (v: any, ...args: any[]) => any
}

type TempFormInterface = {
  [key in FormItemType]: PropsToForm & { [K in key]?: FormTypeProps[key] }
}
export const tempForm: TempFormInterface = {
  select: {
    component: ElSelect,
    subComponent: ElOption,
    placeholder: selectPlaceholder,
    slots: ['tag', 'header'],
    select: {
      filterable: true,
    },
  },
  input: {
    component: ElInput,
    placeholder: inputPlaceholder,
    input: {
      maxlength: 50,
      showWordLimit: true,
    },
  },
  cascader: {
    component: ElCascader,
    placeholder: selectPlaceholder,
  },
  textarea: {
    component: ElInput,
    type: 'textarea',
    placeholder: inputPlaceholder,
    textarea: {
      maxlength: 1000,
      showWordLimit: true,
      rows: 4,
    },
  },
  checkbox: {
    component: ElCheckboxGroup,
    subComponent: ElCheckbox,
  },
  datePicker: {
    component: ElDatePicker,
    placeholder: selectPlaceholder,
    datePicker: {
      // 清空选项的值 @2.7.0
      valueOnClear: '',
    },
  },
  inputNumber: {
    component: ElInputNumber,
    placeholder: inputPlaceholder,
    // initialTransform: (v: string | number) => v ? Number(v) : 0
  },
  switch: {
    component: ElSwitch,
  },
  radio: {
    component: ElRadioGroup,
    subComponent: ElRadio,
  },
  radioButton: {
    component: ElRadioGroup,
    subComponent: ElRadioButton,
  },
  treeSelect: {
    component: ElTreeSelect,
    placeholder: selectPlaceholder,
    otherPropsFunc: (column) => {
      const data = column?.treeSelect?.data || column.dicData
      return {
        data,
      }
    },
  },
  // upload: {
  //   component: ZtFileUpload,
  //   placeholder: uploadPlaceholder,
  //   upload: {
  //     validateEvent: true
  //   }
  // },
  editTable: {
    component: XEditTable,
    isDesign: true,
    props: ['prop', 'label'],
    formItemClass: 'isDesign',
  },
}
