import { defineComponent, ref, watchEffect } from 'vue'
import omit from '../../_util/omit'
import { objectType } from '../../_util/type'
import XDialog from './index'
import type { CSSProperties, Component } from 'vue'
import type { DialogProps } from './index'

export { DialogProps }

const dialogDirectiveProps = {
  option: objectType<DialogDirectiveOption>(),
  contentStyle: objectType<CSSProperties>(),
}

type OmitUpdateModelValue<T extends object> = {
  [K in keyof T as K extends `onUpdate${string}` ? never : K]: T[K]
}

type IsEmptyToIsOptionalEmptyObj<
  T extends string,
  K extends object | never
> = K extends Record<keyof K extends string ? string : keyof K, never>
  ? { [P in T]?: { [key in string]: never } }
  : { [P in T]: K }

export type DialogDirectiveOption<
  T extends object = object,
  K extends object = object
> = Omit<DialogProps, 'visible'> & {
  /** 弹窗里面加载的组件 */
  component: abstract new (...args: any[]) => any
  /** 弹窗被关闭时触发 删除该弹窗 */
  dialogCloseRemoveVNode: () => void
  /** 嵌套在弹窗中组件的`props`传参 */
  // props?: IsEmptyToIsOptionalEmptyObj<'props', T>['props']
  /**
   * 该集合里面的方法会被封装成事件，弹窗里面的组件可以直接通过`$emit`进行通信 如果弹窗里面的组件没有进行`$emit`通信则为空对象`{}`
   * @param Function close 关闭弹窗的方法 `emitMethods`里面的函数的第一位参数是关闭弹窗的方法，从第二位开始是组件里面对应$`emit`通信传的参数
   */
  // emitMethods?: IsEmptyToIsOptionalEmptyObj<'emitMethods', OmitUpdateModelValue<K>>['emitMethods']
} & IsEmptyToIsOptionalEmptyObj<'props', T> &
  IsEmptyToIsOptionalEmptyObj<'emitMethods', OmitUpdateModelValue<K>>

const XDialogDirective = defineComponent({
  name: 'XDialogDirective',
  props: dialogDirectiveProps,
  setup(props) {
    const {
      showSaveBtn = false,
      menu = true,
      props: componentProps = {},
      emitMethods = {},
      dialogCloseRemoveVNode,
    } = props.option

    const visible = ref<boolean>(true)
    const handleEmitMethods: DialogDirectiveOption['emitMethods'] = {}

    emitMethods &&
      Object.keys(emitMethods).forEach((key) => {
        handleEmitMethods[key] = (...args: any[]) => {
          ;(emitMethods as Record<string, any>)[key](
            () => (visible.value = false),
            ...args
          )
        }
      })

    const option = ref<DialogProps>({
      ...omit(props.option, ['component', 'props', 'emitMethods']),
      title: props.option.title || '',
      showSaveBtn,
      menu,
      visible: visible.value,
    })

    let Component: Component | any = 'div'

    watchEffect(() => {
      option.value = {
        ...omit(props.option, ['component', 'props', 'emitMethods']),
        showSaveBtn,
        menu,
        visible: visible.value,
      }

      if (visible.value) {
        Component = props.option.component
      } else {
        setTimeout(() => {
          Component = 'div'
          // 延迟执行，确保组件已经卸载
          dialogCloseRemoveVNode!()
        })
      }
    })

    return () => (
      <XDialog
        option={option.value}
        onClose={() => {
          option.value.visible = false
        }}
        contentStyle={props.contentStyle}
      >
        {<Component {...componentProps} {...handleEmitMethods} />}
      </XDialog>
    )
  },
})

export default XDialogDirective
