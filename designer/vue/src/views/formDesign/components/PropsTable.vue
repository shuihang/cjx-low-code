<template>
  <div class="props-table">
    <el-collapse v-model="activeKey">
      <template v-for="(item, index) of finalProps" :key="index">
        <el-collapse-item is-active :name="index + 1" :title="item.attributeName">
          <div v-for="(value, key) in item.mapPropsToForms" :key="key" class="prop-item">
            <div
              v-if="value"
              :id="`x_${key.toString()}`"
              :class="[
                'flex items-center',
                value.direction === 'vertical' ? 'vertical' : 'horizontal'
              ]"
              :style="getItemStyle(value.direction)"
            >
              <span class="label"> {{ value.text }}： </span>

              <component
                :is="value.component"
                v-model="getValueByPath(value, key, item._objName).value"
                class="prop-component"
                v-bind="value.extraProps"
                v-on="value.events"
              >
                <!-- 子组件 -->
                <template v-if="value.options">
                  <component
                    :is="value.subComponent"
                    v-for="prop in value.options"
                    :key="prop.value"
                    :value="prop.value"
                  >
                    <render-v-node v-if="prop.label" :v-node="prop.label" />
                  </component>
                </template>
              </component>
            </div>
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { reduce } from 'lodash-unified'
import type { FormComponentProps } from '@/defaultFormTemplates'
import type { CSSProperties } from 'vue'
import type { PropsToForm } from '@/propsMap'
// import { PartialTextComponentProps } from '../../hooks/useComponentCommon'
import type { ControlPropertiesProps } from '@/defaultProps'
import type { FormColumnProps } from 'cjx-low-code'
import getMapPropsToFormsList from '@/propsMap'
import RenderVNode from '@/components/common/RenderVNode'
import useTheme from '@/store/modules/theme'

const { themeColor } = storeToRefs(useTheme())

export interface FormInterface {
  component: string
  // 子组件
  subComponent?: string
  direction?: 'horizontal' | 'vertical'
  // 样式名字
  text?: string
  // // 绑定值
  value: string
  // 父组件的 v-bing
  extraProps?: { [key: string]: any }
  // 子组件的 option
  options?: { [key: string]: any }[]
  // 样式值 的转化
  initialTransform?: (v: any) => any
  // 事件名
  eventName: string
  events: { [key: string]: (e: any) => void }
}

const getItemStyle = (direction: FormInterface['direction']): CSSProperties => {
  const style: CSSProperties =
    direction === 'vertical'
      ? {
          flexDirection: 'column',
          alignItems: 'flex-start'
        }
      : {}
  return style
}

function getValueByPath(value: FormInterface, key: string, _objName?: string) {
  return computed({
    get() {
      if (!_objName) {
        return value.value
      }

      return value[_objName][key]
    },
    // setter
    set(newValue) {
      if (!_objName) {
        value.value = newValue
        return
      }

      console.log('getValueByPath', value[_objName])
      value[_objName][key] = newValue
    }
  })
}

type FormProps = {
  [p in keyof ControlPropertiesProps]: FormInterface
}

type PropsToFormsList = Array<{
  attributeName: string
  _objName?: string
  mapPropsToForms: FormProps
}>

interface Props {
  data: FormComponentProps
}

const activeKey = ref<(string | number)[]>([''])

setTimeout(() => {
  activeKey.value = [1, 2]
}, 100)

const props = defineProps<Props>()

let mapPropsToFormsList = getMapPropsToFormsList('Input')

const emit = defineEmits(['change'])

const finalProps = ref<PropsToFormsList>(getFinalProps())

function getFinalProps(): PropsToFormsList {
  // console.log(1111, props.type)
  return reduce(
    mapPropsToFormsList,
    (result, value, index) => {
      const { _objName, mapPropsToForms: objMapPropsToForms } = value

      //console.log(1111, props.data, _objName)
      const mapPropsToForms = _objName
        ? reduce(
            props.data[_objName],
            (resultArr, res, key) => {
              // console.log(2222, resultArr, key)
              const item = objMapPropsToForms[key]

              if (item) {
                const {
                  eventName = 'change',
                  initialTransform,
                  afterTransform,
                  extraProps = {}
                } = item
                // console.log(1111, item)
                const newItem: FormInterface = {
                  ...item,
                  [_objName]: {
                    [key]: initialTransform ? initialTransform(res) : res
                  },
                  extraProps,
                  eventName,
                  events: {
                    [eventName]: (e: any) => {
                      emit('change', {
                        key: _objName,
                        value: { [key]: afterTransform ? afterTransform(e) : e }
                      })
                    }
                  }
                }

                resultArr[key] = newItem
              }

              // console.log('mapPropsToForms', resultArr)
              return resultArr
            },
            {} as FormProps
          )
        : reduce(
            props.data,
            (resultArr, res, key) => {
              // console.log(2222, resultArr, key)
              const item = value.mapPropsToForms[key]

              if (item) {
                const {
                  eventName = 'change',
                  initialTransform,
                  afterTransform,
                  extraProps = {}
                } = item
                // console.log(1111, item)
                const newItem: FormInterface = {
                  ...item,
                  value: initialTransform ? initialTransform(res) : res,
                  extraProps: {
                    ...extraProps
                    // defaultColor: props.type[key] || extraProps.defaultColor
                  },
                  eventName,
                  events: {
                    [eventName]: (e: any) => {
                      emit('change', { key, value: afterTransform ? afterTransform(e) : e })
                    }
                  }
                }

                resultArr[key] = newItem
              }
              // console.log(0, resultArr)
              return resultArr
            },
            {} as FormProps
          )

      result[index] = {
        attributeName: value.attributeName,
        _objName,
        mapPropsToForms
      }
      return result
    },
    [] as PropsToFormsList
  )
}

watch(props, (value) => {
  mapPropsToFormsList = getMapPropsToFormsList(value.data.component || 'Input')
  finalProps.value = getFinalProps()
})

// watch(() => themeColor.value, (newVal) => {
//   // console.log(1111, newVal)
//   mapPropsToFormsList = getMapPropsToFormsList(newVal)
//   finalProps.value = getFinalProps()
// })
</script>

<style lang="scss">
.props-table {
  height: calc(100vh - 94px);
  overflow-y: auto;
  overflow-x: hidden;
  text-align: left;
  .el-radio-button__inner {
    padding: 8px 12px !important;
  }
  ::v-deep(.el-radio-button__inner) {
    padding: 8px 12px !important;
  }
  .prop-item {
    width: 100%;
    margin-bottom: 12px;
    text-align: left;
    .vertical {
      .label {
        width: 100%;
      }
      .prop-component {
        width: 100%;
        padding-top: 10px;
      }
    }
    .label {
      width: 30%;
    }
    .prop-component {
      width: 68%;
    }
  }
}
</style>
