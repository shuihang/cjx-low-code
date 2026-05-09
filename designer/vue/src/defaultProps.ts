import { mapValues } from 'lodash-unified'
import type { FormColumnProps, FormItemType } from 'cjx-low-code'

export type CommonDefaultProps = Pick<
  FormColumnProps,
  'style' | 'span' | 'tip' | 'labelTip' | 'label' | 'prop' | 'type' | 'placeholder' | 'labelStyle'
>

export type ControlPropertiesProps = FormColumnProps &
  FormColumnProps['style'] &
  FormColumnProps['input']

export type DicDataType = Array<{ label: string; value: string }>

export type FormItemsDefaultPropsType = {
  [key in FormItemType]?: { [K in key]: FormColumnProps[K] } & {
    dicData?: DicDataType
  } & CommonDefaultProps
}

export const commonDefaultProps: CommonDefaultProps = {
  label: '',
  prop: '',
  labelStyle: {
    fontSize: '12px',
    fontFamily: '',
    color: ''
  },
  tip: '',
  labelTip: '',
  span: 24
}

export const dicData: DicDataType = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' },
  { label: '选项4', value: '4' }
]

export const formItemsDefaultProps: FormItemsDefaultPropsType = {
  input: {
    placeholder: '请输入',
    ...commonDefaultProps,
    input: {
      placeholder: '请输入',
      showWordLimit: false,
      maxlength: 50
    }
  },
  textarea: {
    ...commonDefaultProps,
    placeholder: '请输入',
    textarea: {
      maxlength: 200,
      placeholder: '请输入',
      rows: 4
    }
  },
  inputNumber: {
    ...commonDefaultProps,
    placeholder: '请输入',
    inputNumber: {
      min: undefined,
      max: undefined,
      step: undefined
    }
  },
  select: {
    ...commonDefaultProps,
    placeholder: '请选择',
    dicData,
    select: {
      placeholder: '请选择'
    }
  },
  radio: {
    ...commonDefaultProps,
    placeholder: '请选择',
    dicData,
    radio: {}
  },
  checkbox: {
    ...commonDefaultProps,
    placeholder: '请选择',
    dicData,
    checkbox: {}
  },
  switch: {
    ...commonDefaultProps,
    switch: {
      activeValue: 1,
      inactiveValue: 0,
      activeText: '',
      inactiveText: ''
    }
  }
}

export const transformToComponentProps = <T extends { [key: string]: any }>(props: T) => {
  return mapValues(props, (item) => {
    return {
      type: item.constructor,
      default: item
    }
  })
}
