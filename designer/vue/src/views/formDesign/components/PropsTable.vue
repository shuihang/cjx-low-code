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
                v-model="getValueByPath(value, key, item._objName, item._nestedUnder).value"
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

function getLeafFromMirror(
  value: FormInterface,
  _objName: string,
  nestedUnder: string | undefined,
  key: string
) {
  const root = (value as unknown as Record<string, unknown>)[_objName] as
    | Record<string, unknown>
    | undefined
  if (!root) return undefined
  if (!nestedUnder) return root[key]
  const nest = root[nestedUnder] as Record<string, unknown> | undefined
  return nest?.[key]
}

function setLeafOnMirror(
  value: FormInterface,
  _objName: string,
  nestedUnder: string | undefined,
  key: string,
  newValue: unknown
) {
  const v = value as unknown as Record<string, unknown>
  if (!v[_objName] || typeof v[_objName] !== 'object') v[_objName] = {}
  const root = v[_objName] as Record<string, unknown>
  if (!nestedUnder) {
    root[key] = newValue
    return
  }
  if (!root[nestedUnder] || typeof root[nestedUnder] !== 'object') root[nestedUnder] = {}
  const nest = root[nestedUnder] as Record<string, unknown>
  nest[key] = newValue
}

function getValueByPath(
  value: FormInterface,
  key: string,
  _objName?: string,
  _nestedUnder?: string
) {
  return computed({
    get() {
      if (!_objName) {
        return value.value
      }

      return getLeafFromMirror(value, _objName, _nestedUnder, key)
    },
    // setter
    set(newValue) {
      if (!_objName) {
        ;(value as { value: unknown }).value = newValue
        return
      }

      setLeafOnMirror(value, _objName, _nestedUnder, key, newValue)
    }
  })
}

type FormProps = Record<string, FormInterface>

type PropsToFormsList = Array<{
  attributeName: string
  _objName?: string
  _nestedUnder?: string
  mapPropsToForms: FormProps
}>

interface Props {
  /** 未选中时不应传入数组等非表单项对象（历史写法 getCurrentElement || [] 会触发运行时错误） */
  data?: FormComponentProps | null
}

const activeKey = ref<(string | number)[]>([''])

setTimeout(() => {
  activeKey.value = [1, 2]
}, 100)

const props = defineProps<Props>()

const emit = defineEmits(['change'])

let mapPropsToFormsList = getMapPropsToFormsList('Input')
const finalProps = ref<PropsToFormsList>([])

function getFinalProps(): PropsToFormsList {
  const raw = props.data as unknown
  if (!raw || Array.isArray(raw) || typeof raw !== 'object') {
    return []
  }

  return reduce(
    mapPropsToFormsList,
    (result, value, index) => {
      if (!value) return result

      const { _objName, _nestedUnder, mapPropsToForms: objMapPropsToForms } = value

      //console.log(1111, props.data, _objName)
      /** 必须按「配置表 mapPropsToForms」的键遍历，不能按 raw 嵌套对象现有键遍历；否则 componentProps 为空时整块面板无表单项 */
      const mapPropsToForms = _objName
        ? reduce(
            objMapPropsToForms,
            (resultArr, item, key) => {
              if (!item) return resultArr
              const rootObj = ((raw as Record<string, unknown>)[_objName] ?? {}) as Record<
                string,
                unknown
              >
              const nestedObj = _nestedUnder
                ? ((rootObj[_nestedUnder] ?? {}) as Record<string, unknown>)
                : rootObj
              let res = nestedObj[key]
              /** 历史数据写在顶层 `style`，迁移前仍可在属性面板展示 */
              if (
                res === undefined &&
                _nestedUnder === 'style' &&
                (raw as Record<string, unknown>)['style'] &&
                typeof (raw as Record<string, unknown>)['style'] === 'object' &&
                !Array.isArray((raw as Record<string, unknown>)['style'])
              ) {
                res = ((raw as Record<string, unknown>)['style'] as Record<string, unknown>)[key]
              }
              const {
                eventName = 'change',
                initialTransform,
                afterTransform,
                extraProps = {}
              } = item
              const leafVal = initialTransform ? initialTransform(res) : res
              const newItem: FormInterface = {
                ...item,
                value: '',
                [_objName]: _nestedUnder
                  ? { [_nestedUnder]: { [key]: leafVal } }
                  : { [key]: leafVal },
                extraProps,
                eventName,
                events: {
                  [eventName]: (e: any) => {
                    const out = afterTransform ? afterTransform(e) : e
                    emit('change', {
                      key: _objName,
                      value: _nestedUnder ? { [_nestedUnder]: { [key]: out } } : { [key]: out }
                    })
                  }
                }
              }

              resultArr[key] = newItem
              return resultArr
            },
            {} as FormProps
          )
        : reduce(
            value.mapPropsToForms,
            (resultArr, item, key) => {
              if (!item) return resultArr
              const res = (raw as Record<string, unknown>)[key]
              const {
                eventName = 'change',
                initialTransform,
                afterTransform,
                extraProps = {}
              } = item
              const newItem: FormInterface = {
                ...item,
                value: initialTransform ? initialTransform(res) : res,
                extraProps: {
                  ...extraProps
                },
                eventName,
                events: {
                  [eventName]: (e: any) => {
                    emit('change', { key, value: afterTransform ? afterTransform(e) : e })
                  }
                }
              }

              resultArr[key] = newItem
              return resultArr
            },
            {} as FormProps
          )

      result[index] = {
        attributeName: value.attributeName,
        _objName,
        _nestedUnder: value._nestedUnder,
        mapPropsToForms
      }
      return result
    },
    [] as PropsToFormsList
  )
}

watch(
  () => props.data,
  (data) => {
    if (!data || Array.isArray(data) || typeof data !== 'object') {
      finalProps.value = []
      return
    }
    mapPropsToFormsList = getMapPropsToFormsList(data.component || 'Input')
    finalProps.value = getFinalProps()
  },
  { deep: true, immediate: true }
)

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
