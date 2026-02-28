import { createVNode, render } from 'vue'
import XDialogDirective, { type DialogDirectiveOption } from './dialogDirective'
import type {
  AllowedComponentProps,
  AppContext,
  CSSProperties,
  ComponentCustomProps,
  VNode,
  VNodeProps,
  Component,
  ExtractPropTypes
} from 'vue'
import type { DialogPropsVc } from './vc-dialog'
import { defaultOnError as onError, createError, ErrorCodes } from '../../_util/errors'

export type EmitsAddArgs<
  T extends object,
  ArgsGroups extends readonly unknown[][] = [],
  Position extends 'start' | 'end' = 'start'
> = {
  [K in keyof T]-?: T[K] extends ((...args: infer Args) => infer Return) | undefined
    ? Args extends []
      ? ((...args: [...ArgsGroups[number]]) => Return)
      : Position extends 'start'
        ? ((...args: [...ArgsGroups[number], ...Args]) => Return)
        : ((...args: [...Args, ...ArgsGroups[number]]) => Return)
    : T[K];
}

export type IsEmptyToNeverObj<T> = T extends object
  ? keyof T extends never
    ? { [key in string]: never }
    : T
  : never



type RemoveFunctions<T> = { [K in keyof T as T[K] extends Function | undefined ? never : K]-?: T[K] };

type PropsAndEmits<T> = Omit<T, keyof(VNodeProps & AllowedComponentProps & ComponentCustomProps)>

type ExtractComponentProps<T> = RemoveFunctions<PropsAndEmits<T>>

export type ExtractComponentsEmits<
    T, ArgsGroups extends readonly unknown[][] = [], Position extends 'start' | 'end' = 'start'> =
    IsEmptyToNeverObj<EmitsAddArgs<Omit<PropsAndEmits<T>, keyof ExtractComponentProps<T>>, ArgsGroups, Position>
  >

type DialogDirectiveProps<T extends object, K extends object = object> = {
  /** 弹窗的配置项以及嵌入在弹窗里面组件的props传参和$emit通信事件（emitMethods） */
  option: Omit<DialogDirectiveOption<T, K>, 'dialogCloseRemoveVNode' | 'component'>
  /** 弹窗内容区域样式 */
  contentStyle?: CSSProperties
}

type AsyncDialogDirectiveProps<T extends object | (abstract new (...args: any[]) => any), E extends object> =
  DialogDirectiveProps<T extends Promise<Component> ? Record<string, any> : T, EmitsAddArgs<E, [[close: () => void]]>>
           

export const $XDialog = (_context: AppContext) => {
  const defaultContext = _context

  /**
   * 命令式弹窗组件
   * @param component 组件（需要嵌套在`$XDialog`中的组件）
   * @param props 弹窗的配置项以及嵌入在弹窗里面组件的`props`传参和$emit通信事件`emitMethods`
   * @returns 弹窗组件的实例
   *
   * @example
   *
   * ### `props.option`配置项 详情请前往[$XDialog属性文档](https://aqqxl.top/zh-cn/attribute/dialog.html)查看
   *
   * 这是一个例子，如何在组件里面使用$XDialog命令式弹窗组件:
   *
   * #### AComponents.vue 嵌套在$XDialog中的组件可以是任何组件，这里以AComponents为例
   * ```vue
   * <script setup lang="ts">
   * const emit = defineEmits<{
   *   (e: 'close'): void
   *   (e: 'save', data: { test: string, test1: string }, done: () => void): void
   *   (e: 'change', data: { index: number, name: string }): void
   *   (e: 'remove', index: number): void
   * }>()
   *
   * const props = defineProps({
   *   / ** A组件内部的jsDoc id请求详情接口需要 * /
   *   id: {
   *     type: [String, Number],
   *     default: '',
   *     required: true,
   *   },
   * })
   * <script/>
   * ```
   *
   * #### 在组件里面使用$XDialog命令式弹窗组件
   * ```ts
   * <script setup lang="ts">
   * // 引入需要嵌套在$XDialog中的组件
   * import AComponents from 'AComponents.vue';
   * // Vue 3 提供的一个函数，用于在组件中获取当前实例的代理对象（proxy）。该对象提供了对组件数据和方法的响应式访问，避免了直接使用 this 关键字  通过proxy可以使用$XDialog组件
   * const proxy = getCurrentInstance()?.proxy
   *
   * const openXDialog = () => {
   *   proxy?.$XDialog(AComponents, {
   *     option: {
   *       title: '测试$XDialog弹窗',
   *       menu: false,
   *       props: {
   *         id: '1234567890',
   *       },
   *       emitMethods: {
   *         onClose: (close) => {
   *           console.log('onClose', close)
   *           close()
   *         },
   *         onRemove: (close, index) => {
   *           console.log('onRemove', index)
   *         },
   *         onChange: (close, data) => {
   *           console.log('onChange', data)
   *         },
   *         onSave: (close, data, done) => {
   *           console.log('onSave', data)
   *           done()
   *           close()
   *         },
   *       },
   *     },
   *   })
   *  }
   * <script/>
   * ```
   */
  return async <T extends object | (abstract new (...args: any[]) => any), K extends object = Required<DialogPropsVc>['emitMethods']>(
    component: T extends (abstract new (...args: any[]) => any) ? T : Promise<Component>,
    props?: T extends abstract new (...args: any[]) => any
      ? DialogDirectiveProps<
          ExtractComponentProps<InstanceType<T>['$props']>,
          ExtractComponentsEmits<InstanceType<T>['$props'], [[close: () => void]]>>
      : AsyncDialogDirectiveProps<T, K>,
  ) => {
    if (!component) {
      onError(createError(ErrorCodes.COMPONENT_IS_REQUIRED))
    }

    try {
      // 使用者传入的组件可能是异步组件，需要判断传入的异步组件是否为成功的Promise
      await component
    } catch (error) {
      onError(createError(ErrorCodes.ASYNCHRONOUS_COMPONENT_LOADING_FAILED, String(error)))
    }
    
    const parent = document.createElement('div')
    let instance: VNode | null = null

    if (props) {
      const { option = {}, contentStyle = {} } = props
      
      instance = createVNode(XDialogDirective, { option: {
          ...option,
          component,
          dialogCloseRemoveVNode: () => {
            render(null, parent);
            parent.remove();
          },
        },
        contentStyle
      })
      
    } else {
      instance = createVNode(XDialogDirective, {
        option: {
          component
        }
      })

    }

    defaultContext && (instance.appContext = defaultContext);

    try {
      render(instance, parent)
      document.body.appendChild(parent)
    } catch (error) {
      parent.remove()
      onError(createError(ErrorCodes.FAILED_TO_RENDER_DIALOG, String(error)))
    }
    return instance;
  }
}

export default $XDialog

export type DialogDirectiveInterface = ReturnType<typeof $XDialog>
