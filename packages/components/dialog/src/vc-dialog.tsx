import {
  createVNode,
  defineAsyncComponent,
  defineComponent,
  ref,
  watchEffect,
} from 'vue'
import omit from '../../_util/omit'
import { booleanType, objectType } from '../../_util/type'
import XDialog from './index'
import type { CustomSlotsType } from '../../_util/type'
import type { DialogProps } from './index'
import type { CSSProperties, Component } from 'vue'

export { DialogProps }

const dialogPropsVcProps = {
  option: objectType<DialogPropsVc>(),
  modelValue: booleanType(false),
  contentStyle: objectType<CSSProperties>(),
}

export type DialogPropsVc<T extends object = object> = Omit<
  DialogProps,
  'visible'
> & {
  /**
   * 加载的组件component 里面是否emit了change（emit('change', data)）事件 默认true 只有当为true时 onSave(点击确定按钮响应的事件)里的第二个参数data才有值
   */
  isEmitChange?: boolean
  /** 弹窗里面加载的组件 */
  component: Promise<Component>
  /** 弹窗里面加载组件的props */
  props?: T
  /** 必须是on开头的 驼峰命名的函数 */
  emitMethods?: { [key in `on${Capitalize<string>}`]: (...args: any[]) => void }
}

export default defineComponent({
  name: 'XDialogVc',
  props: dialogPropsVcProps,
  emits: ['update:modelValue'],
  slots: Object as CustomSlotsType<{
    default?: any
    /* 操作区域插槽 */
    menu?: any
  }>,
  setup(props, { slots, emit }) {
    const {
      showSaveBtn = true,
      menu = true,
      props: componentProps = {},
      emitMethods = {},
    } = props.option

    const option = ref<DialogProps>({
      ...omit(props.option, ['component', 'props', 'emitMethods']),
      title: props.option.title || '',
      showSaveBtn,
      menu,
      visible: props.modelValue,
    })
    let component: Component | any = 'div'

    // console.log(props.option.title, componentProps)

    watchEffect(async () => {
      option.value = {
        ...omit(props.option, ['component', 'props', 'emitMethods']),
        showSaveBtn,
        menu,
        visible: props.modelValue,
      }

      if (props.modelValue) {
        component = defineAsyncComponent(() => props.option.component)
      } else {
        setTimeout(() => {
          component = 'div'
        })
      }
    })

    return () => (
      <XDialog
        option={option.value}
        onClose={() => {
          option.value.visible = false
          emit('update:modelValue', false)
        }}
        contentStyle={props.contentStyle}
        v-slots={slots}
      >
        {createVNode(
          component,
          menu && showSaveBtn
            ? {
                ...componentProps,
                ...emitMethods,
                onChange: (data: any) => (option.value.data = data),
              }
            : {
                ...componentProps,
                ...emitMethods,
              }
        )}

        {/*<Component*/}
        {/*  {...componentProps}*/}
        {/*  {...emitMethods}*/}
        {/*  v-once*/}
        {/*  onChange={(data: any) => (showSaveBtn && menu) && (option.value.data = data)}*/}
        {/*/>*/}
      </XDialog>
    )
  },
})
