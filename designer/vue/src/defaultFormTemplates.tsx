import {
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Select,
  Switch
} from '@cjx-low-code/element-plus'
import { createSchemaField } from '@cjx-low-code/vue'
import type { FunctionalComponent } from 'vue'
import type { FormTypeProps } from 'cjx-low-code'
import {
  CheckBox,
  DropdownBox,
  DropdownMultiBox,
  MultiLineTextBox,
  RadioButton,
  SingleLineTextBox,
  Switch as SwitchIcon
} from '@/components/icon'

const { SchemaField, SchemaFieldMarkup, defineSchema } = createSchemaField({
  components: {
    Input,
    InputNumber,
    Select,
    Radio,
    RadioGroup,
    Checkbox,
    CheckboxGroup,
    Switch,
    FormItem
  }
})

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
      decorator: 'FormItem',
      component: 'Input',
      icon: SingleLineTextBox
    },
    {
      title: '多行文本框',
      decorator: 'FormItem',
      component: 'Input.Textarea',
      icon: MultiLineTextBox
    },
    {
      title: '下拉框',
      decorator: 'FormItem',
      component: 'Select',
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
      icon: RadioButton
    },
    {
      title: '复选框',
      decorator: 'FormItem',
      component: 'Checkbox',
      icon: CheckBox
    },
    {
      title: '数字输入框',
      decorator: 'FormItem',
      component: 'InputNumber',
      icon: CheckBox
    },
    {
      title: '开关',
      decorator: 'FormItem',
      component: 'Switch',
      icon: SwitchIcon
    }
  ]
}

export default getDefaultFormTemplates
