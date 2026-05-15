import { h } from 'vue'
import { dicData } from './defaultProps'
import type {
  Component,
  ExtractPropTypes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  VNode
} from 'vue'
import type { ControlPropertiesProps } from './defaultProps'
import type { ComponentsType, FormComponentProps } from '@/defaultFormTemplates'

// 字体
const fontFamilyArr = [
  { label: '宋体', value: 'SimSun,STSong' },
  { label: '黑体', value: 'SimHei,STHeiti' },
  { label: '楷体', value: 'KaiTi,STKaiti' },
  { label: '仿宋', value: 'FangSong,STFangsong' },
  { label: '微软雅黑', value: 'Microsoft YaHei,STYhei' },
  { label: '华文细黑', value: 'STXihei,STXihei' },
  { label: '新细明体', value: '"PMingLiU",serif' },

  { label: 'Arial style', value: 'Arial, sans-serif' },
  { label: 'Arial Black', value: '"Arial Black",Gadget,sans-serif' },
  { label: 'Arial Narrow', value: '"Arial Narrow",Arial,sans-serif' },
  { label: 'Arial Rounded MT Bold', value: '"Arial Rounded MT Bold",Arial,sans-serif' },
  { label: 'Book Antiqua', value: '"Book Antiqua",Palatino,serif' },
  { label: 'Comic Sans', value: 'Comic Sans MS' },
  { label: 'Courier New', value: '"Courier New",Courier,monospace' },
  { label: 'Georgia', value: 'Georgia,serif' },
  { label: 'Impact', value: 'Impact,chicago' },
  { label: 'Lucida Console', value: '"Lucida Console",Monaco,monospace' },
  { label: 'Lucida Sans Unicode', value: '"Lucida Sans Unicode",Lucida Grande,sans-serif' },
  { label: 'Palatino Linotype', value: '"Palatino Linotype",Book Antiqua,Palatino,serif' },
  { label: 'Tahoma', value: 'Tahoma,Geneva,sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman",Times,serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS",Helvetica,sans-serif' },
  { label: 'Verdana', value: 'Verdana,Geneva,sans-serif' }
]

const fontFamilyOption = fontFamilyArr.map((item) => {
  return {
    value: item.value,
    label: h('span', { style: { fontFamily: item.value } }, item.label)
  }
})

interface SliderMarks {
  [key: number]: {
    style: {
      color: string
      fontSize: string
      left?: string
    }
    label: string
  }
}
// 处理进度条样式
function getSliderMarks(data: {
  min: number
  max: number
  unit: string
  color: string
  left?: string
}): SliderMarks {
  const { min, max, unit, color, left } = data
  return {
    [min]: {
      style: {
        color: 'rgba(0, 0, 0, 0.45)',
        fontSize: '12px',
        left: left ? left : '8px'
      },
      label: `${min + unit}`
    },
    [max]: {
      style: {
        color,
        fontSize: '12px'
      },
      label: `${max + unit}`
    }
  }
}

export interface PropsToForm {
  component: string
  // 子组件
  subComponent?: string
  direction?: 'horizontal' | 'vertical'
  // 样式名字
  text?: string
  // // 绑定值
  // value?: string
  // 父组件的 v-bing
  extraProps?: { [key: string]: any }
  // 子组件的 option
  options?: { label: string | VNode; value: string | number }[]
  // 样式值 的转化
  initialTransform?: (v: any) => any
  valueProp?: string
  // 事件名
  eventName?: string
  // 处理数据
  afterTransform?: (v: any) => any
}

export type PropsToForms = {
  [p in keyof ControlPropertiesProps]?: PropsToForm
}

export type PropsToFormsList = Array<{
  attributeName: string
  _objName?: PropsMapNestedTarget | string
  /** 嵌套在 _objName 下的子路径，如 `style` 表示读写 `componentProps.style` / `decoratorProps.style` */
  _nestedUnder?: string
  mapPropsToForms: Record<string, PropsToForm>
}>

/** 嵌套在表单项上的对象路径，与 PropsTable 里从 raw[_objName] 取值一致 */
export type PropsMapNestedTarget = 'componentProps' | 'decoratorProps' | 'style'

export type PropsMapEntry = {
  attributeName: string
  _objName?: PropsMapNestedTarget
  _nestedUnder?: string
  mapPropsToForms: Record<string, PropsToForm>
}

export type ComponentClass = abstract new (...args: unknown[]) => any

export type ComponentProps<T extends ComponentClass> = InstanceType<T>['$props']

const propsToFormsListMap: {
  [key in keyof ComponentsType]: {
    attributeName: string
    _objName?: PropsMapNestedTarget
    _nestedUnder?: string
    mapPropsToForms: {
      [k in keyof ComponentProps<ComponentsType[key]>]: PropsToForm
    }
  }
} = {
  Input: {
    attributeName: '单行输入框',
    _objName: 'componentProps',
    mapPropsToForms: {
      maxlength: {
        text: '最大长度',
        component: 'el-input-number',
        extraProps: {}
      }
    }
  },
  'Input.Textarea': {
    attributeName: '多行输入框',
    _objName: 'componentProps',
    mapPropsToForms: {
      rows: {
        text: '行数',
        component: 'el-input-number',
        // initialTransform: (v: string) => parseInt(v),
        // afterTransform: (e: number) => e ? `${e}px` : '',
        extraProps: {}
      },
      maxlength: {
        text: '最大长度',
        component: 'el-input-number',
        extraProps: {}
      }
    }
  },
  InputNumber: {
    attributeName: '数字输入框',
    _objName: 'componentProps',
    mapPropsToForms: {
      min: {
        text: '最小值',
        component: 'el-input-number',
        extraProps: {}
      },
      max: {
        text: '最大值',
        component: 'el-input-number',
        extraProps: {}
      },
      step: {
        text: '步长',
        component: 'el-input-number',
        extraProps: {
          min: 1,
          max: 100
        }
      },
      stepStrictly: {
        text: '是否严格步长',
        component: 'el-switch',
        extraProps: {
          activeText: '是',
          inactiveText: '否'
        }
      }
    }
  },
  Select: {
    attributeName: '下拉选择框',
    _objName: 'componentProps',
    mapPropsToForms: {
      options: {
        text: '字典数据',
        component: 'el-select',
        subComponent: 'el-option',
        options: [...dicData],
        extraProps: {
          vModel: 'dicData'
        }
      }
    }
  },
  Checkbox: {
    attributeName: '多选框',
    _objName: 'componentProps',
    mapPropsToForms: {
      options: {
        text: '字典数据',
        component: 'el-select',
        subComponent: 'el-option',
        options: [...dicData],
        extraProps: {
          vModel: 'dicData'
        }
      }
    }
  },
  Radio: {
    attributeName: '单选框',
    _objName: 'componentProps',
    mapPropsToForms: {
      options: {
        text: '字典数据',
        component: 'el-select',
        subComponent: 'el-option',
        options: [...dicData],
        extraProps: {
          vModel: 'dicData'
        }
      }
    }
  },
  RadioButton: {
    attributeName: '按钮单选框',
    _objName: 'componentProps',
    mapPropsToForms: {
      dicData: {
        text: '字典数据',
        component: 'el-select',
        subComponent: 'el-option',
        options: [...dicData],
        extraProps: {
          vModel: 'dicData'
        }
      }
    }
  },
  Cascader: {
    attributeName: '级联选择器',
    _objName: 'componentProps',
    mapPropsToForms: {
      dicData: {
        text: '字典数据',
        component: 'el-select',
        subComponent: 'el-option',
        options: [...dicData],
        extraProps: {
          vModel: 'dicData'
        }
      }
    }
  },
  DatePicker: {
    attributeName: '日期选择器',
    _objName: 'componentProps',
    mapPropsToForms: {
      type: {
        text: '类型',
        component: 'el-select',
        subComponent: 'el-option',
        options: [
          { value: 'date', label: '日' },
          { value: 'week', label: '周' },
          { value: 'month', label: '月' },
          { value: 'year', label: '年' }
        ],
        extraProps: {}
      }
    }
  },
  TreeSelect: {
    attributeName: '树选择器',
    _objName: 'componentProps',
    mapPropsToForms: {
      // dicData: {
      //   text: '字典数据',
      //   component: 'el-select',
      //   subComponent: 'el-option',
      // }
    }
  },
  Switch: {
    attributeName: '开关',
    _objName: 'componentProps',
    mapPropsToForms: {
      activeText: {
        text: '开启时文字',
        component: 'el-input',
        eventName: 'input',
        extraProps: {}
      },
      inactiveText: {
        text: '关闭时文字',
        component: 'el-input',
        eventName: 'input',
        extraProps: {}
      },
      activeValue: {
        text: '开启时值',
        component: 'el-input',
        eventName: 'input',
        extraProps: {}
      },
      inactiveValue: {
        text: '关闭时值',
        component: 'el-input',
        eventName: 'input',
        extraProps: {}
      }
    }
  },
  ColorPicker: {
    attributeName: '颜色选择器',
    _objName: 'componentProps',
    mapPropsToForms: {}
  },
  Rate: {
    attributeName: '评分',
    _objName: 'componentProps',
    mapPropsToForms: {
      max: {
        text: '最大值',
        component: 'el-input-number',
        extraProps: {}
      },
      allowHalf: {
        text: '是否允许半选',
        component: 'el-switch',
        extraProps: {
          activeText: '是',
          inactiveText: '否'
        }
      }
    }
  },
  Slider: {
    attributeName: '滑块',
    _objName: 'componentProps',
    mapPropsToForms: {
      min: {
        text: '最小值',
        component: 'el-input-number',
        extraProps: {}
      },
      max: {
        text: '最大值',
        component: 'el-input-number',
        extraProps: {}
      },
      step: {
        text: '步长',
        component: 'el-input-number',
        extraProps: {}
      }
    }
  },
  TimePicker: {
    attributeName: '时间选择器',
    _objName: 'componentProps',
    mapPropsToForms: {}
  },
  TimeSelect: {
    attributeName: '时间选择',
    _objName: 'componentProps',
    mapPropsToForms: {}
  }
}

export default function getMapPropsToFormsList(
  component: FormComponentProps['component']
): PropsToFormsList {
  const s = component ? String(component).trim() || 'Input' : 'Input'
  const item = propsToFormsListMap[s] ?? propsToFormsListMap.Input
  return [
    {
      attributeName: '字段属性',
      mapPropsToForms: {
        title: {
          text: '字段名',
          component: 'el-input',
          eventName: 'input',
          extraProps: {},
          afterTransform: (e: any) => e
        },
        placeholder: {
          text: '占位符',
          component: 'el-input',
          direction: 'vertical',
          eventName: 'input',
          extraProps: {
            type: 'textarea'
          },
          afterTransform: (e: any) => e
        },
        labelTip: {
          text: '标题提示语',
          component: 'el-input',
          direction: 'vertical',
          eventName: 'input',
          extraProps: {
            type: 'textarea'
          },
          afterTransform: (e: any) => e
        }
      }
    },
    item,
    {
      attributeName: `${item.attributeName}组件样式`,
      _objName: 'componentProps',
      _nestedUnder: 'style',
      mapPropsToForms: {
        fontFamily: {
          text: '标题字体',
          component: 'el-select',
          subComponent: 'el-option',
          extraProps: {},
          options: [{ label: '无', value: '' }, ...fontFamilyOption]
        },
        fontSize: {
          text: '标题字号',
          component: 'el-input-number',
          extraProps: {},
          initialTransform: (v: string) => Number.parseInt(v),
          afterTransform: (e: number) => (e ? `${e}px` : '')
        },
        color: {
          text: '标题颜色',
          component: 'x-color-picker',
          extraProps: {}
        }
        // borderColor: {
        //   text: '标题颜色',
        //   component: 'b-color-picker',
        //   extraProps: {
        //     defaultColor: 'transparent',
        //   }
        // },
      }
    },
    {
      attributeName: '容器组件',
      _objName: 'decoratorProps',
      mapPropsToForms: {
        labelCol: {
          component: 'el-radio-group',
          text: '控件宽度',
          direction: 'vertical',
          subComponent: 'el-radio-button',
          extraProps: { buttonStyle: 'solid' },
          options: [
            { label: '1/4', value: 6 },
            { label: '1/3', value: 8 },
            { label: '1/2', value: 12 },
            { label: '2/3', value: 16 },
            { label: '3/4', value: 18 },
            { label: '1', value: 24 }
          ],
          afterTransform: (e: any) => e
        },
        required: {
          text: '是否必填',
          component: 'el-switch',
          extraProps: {
            activeText: '是',
            inactiveText: '否'
          }
        }
      }
    },
    {
      attributeName: '容器样式',
      _objName: 'decoratorProps',
      _nestedUnder: 'style',
      mapPropsToForms: {
        fontFamily: {
          text: '标题字体',
          component: 'el-select',
          subComponent: 'el-option',
          extraProps: {},
          options: [{ label: '无', value: '' }, ...fontFamilyOption]
        },
        fontSize: {
          text: '标题字号',
          component: 'el-input-number',
          extraProps: {},
          initialTransform: (v: string) => Number.parseInt(v),
          afterTransform: (e: number) => (e ? `${e}px` : '')
        },
        color: {
          text: '标题颜色',
          component: 'x-color-picker',
          extraProps: {}
        }
      }
    }

    // {
    //   attributeName: '事件功能',
    //   mapPropsToForms: {
    //     actionType: {
    //       text: '点击',
    //       component: 'el-select',
    //       subComponent: 'el-select-option',
    //       extraProps: {
    //         // open: true
    //       },
    //       options: [
    //         { label: '无', value: '' },
    //         { label: '打开新窗口', value: 'url'}
    //       ],

    //     },
    //     url: {
    //       text: '链接地址',
    //       component: 'el-input',
    //       extraProps: {},
    //       // initialTransform: (v: string) => parseInt(v),
    //       afterTransform: (e: any) => e.target.value
    //     }
    //   }
    // }
  ]
}
