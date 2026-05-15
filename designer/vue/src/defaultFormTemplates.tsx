import {
  Checkbox,
  FormItem,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  TimeSelect
} from '@cjx-low-code/element-plus'
import { createSchemaField } from '@cjx-low-code/vue'
import { dicData } from './defaultProps'
import type { FunctionalComponent } from 'vue'
import type { FormTypeProps } from 'cjx-low-code'
import {
  CheckBox,
  DropdownBox,
  DropdownMultiBox,
  MultiLineTextBox,
  RadioButton,
  RateIcon,
  SingleLineTextBox,
  SliderIcon,
  Switch as SwitchIcon,
  TimePickerIcon,
  TimeSelectIcon
} from '@/components/icon'

const components = {
  Input,
  InputNumber,
  Select,
  Radio,
  Checkbox,
  Switch,
  TimePicker,
  TimeSelect,
  Rate,
  Slider,
  FormItem
}

export type ComponentsType = typeof components

const { SchemaField, defineSchema } = createSchemaField({
  components
})

export { SchemaField }

type DefineSchemaType<Component extends (...args: any[]) => any> = Component extends (
  schema: infer Args
) => any
  ? ExtractArrayElement<Args> & {
      icon: IconType
    }
  : never

type ExtractArrayElement<T> = T extends (infer E)[] ? E : never

export { FormTypeProps }

type IconType<T = FunctionalComponent> = T extends (...args: infer Args) => infer R
  ? (...args: Partial<Args>) => R
  : never

export type FormComponentProps = DefineSchemaType<typeof defineSchema>

function getDefaultFormTemplates(color?: string): FormComponentProps[] {
  return [
    {
      title: '单行文本框',
      type: 'string',
      decorator: 'FormItem',
      component: 'Input',
      icon: SingleLineTextBox
    },
    {
      title: '多行文本框',
      type: 'string',
      decorator: 'FormItem',
      component: 'Input.Textarea',
      icon: MultiLineTextBox
    },
    {
      title: '下拉框',
      decorator: 'FormItem',
      component: 'Select',
      componentProps: {
        options: dicData
      },
      icon: DropdownBox
    },
    {
      title: '下拉多选框',
      decorator: 'FormItem',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        multiple: true
      },
      icon: DropdownMultiBox
    },
    {
      title: '单选框',
      decorator: 'FormItem',
      component: 'Radio',
      componentProps: {
        options: dicData
      },
      icon: RadioButton
    },
    {
      title: '复选框',
      decorator: 'FormItem',
      component: 'Checkbox',
      componentProps: {
        options: dicData
      },
      icon: CheckBox
    },
    {
      title: '数字输入框',
      type: 'number',
      decorator: 'FormItem',
      component: 'InputNumber',
      icon: CheckBox
    },
    {
      title: '开关',
      type: 'boolean',
      decorator: 'FormItem',
      component: 'Switch',
      icon: SwitchIcon
    },
    {
      title: '时间选择器',
      type: 'string',
      decorator: 'FormItem',
      component: 'TimePicker',
      icon: TimePickerIcon
    },
    {
      title: '时间选择',
      type: 'string',
      decorator: 'FormItem',
      component: 'TimeSelect',
      icon: TimeSelectIcon
    },
    {
      title: '评分',
      type: 'number',
      decorator: 'FormItem',
      component: 'Rate',
      icon: RateIcon
    },
    {
      title: '滑块',
      type: 'number',
      decorator: 'FormItem',
      component: 'Slider',
      icon: SliderIcon
    }
  ]
}

export default getDefaultFormTemplates
