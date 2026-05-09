import { createVNode, defineComponent } from 'vue'
import {
  ElCheckbox,
  ElCheckboxGroup,
  ElCol,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElRow,
  ElSelect,
  ElSwitch,
  ElTooltip
} from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
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
import { createForm } from '@cjx-low-code/core'
import { createSchemaField } from '@cjx-low-code/vue'
import type { Component } from 'vue'
import type { FormItemsDefaultPropsType } from '@/defaultProps'
import type { FormColumnProps, FormItemType, FormTypeProps } from 'cjx-low-code'
import useEditorStore from '@/store/modules/editor'
import { objectType } from '@/utils/type'

type ComponentsMapType = {
  [key in FormItemType]?: {
    component: Component
    subComponent?: Component
  } & FormTypeProps[key]
}

const componentsMap: ComponentsMapType = {
  input: {
    component: ElInput
  },
  textarea: {
    component: ElInput
  },
  inputNumber: {
    component: ElInputNumber
  },
  select: {
    component: ElSelect,
    subComponent: ElOption
  },
  // radio: {
  //   component: ElRadioGroup,
  //   subComponent: ElRadio
  // },
  checkbox: {
    component: ElCheckboxGroup,
    subComponent: ElCheckbox
  },
  switch: {
    component: ElSwitch
  }
  // cascader: {
  //   component: ElSelect,
  // },
  // datePicker: {
  //   component: ElInput,
  // },
}

export default defineComponent({
  name: 'FormCanvas',
  props: {
    option: objectType<FormColumnProps>()
  },
  setup(props) {
    // 因为是个方法，所以我们得调用一下
    // const { components } = storeToRefs(useEditorStore())

    return () => {
      // console.log('components', components)

      const { option } = props
      const { type = 'input', dicData } = option

      const currentProps = option[type]

      const Components = componentsMap[type]?.component
      const SubComponents = componentsMap[type]?.subComponent

      return (
        <>
          <ElFormItem
            labelWidth={110}
            v-slots={{
              label: () => (
                <div class={'flex flex-items-center'} style={option.labelStyle}>
                  {option.label}
                  {option.labelTip && (
                    <ElTooltip
                      v-slots={{
                        content: () => option.labelTip
                      }}
                    >
                      <ElIcon>
                        <QuestionFilled />
                      </ElIcon>
                    </ElTooltip>
                  )}
                </div>
              )
            }}
          >
            {Components &&
              createVNode(
                Components,
                {
                  ...currentProps,
                  type: option.type,
                  placeholder: option.placeholder,
                  style: {
                    width: '100%'
                  }
                },
                SubComponents && dicData
                  ? dicData.map((item) => {
                      return createVNode(
                        SubComponents,
                        {
                          ...item
                        },
                        null
                      )
                    })
                  : null
              )}
          </ElFormItem>
        </>
      )
    }
  }
})
