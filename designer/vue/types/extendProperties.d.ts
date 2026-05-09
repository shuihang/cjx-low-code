import { ComponentCustomProperties } from 'vue'
import type { DialogDirectiveInterface } from 'cjx-low-code'

declare module 'vue' {
  interface ComponentCustomProperties {
    // 兼容 webStorm 的jsDoc提示
    /**
     * 命令式弹窗组件
     * @param component 组件（需要嵌套在$ZtDialog中的组件）
     * @param props 弹窗的配置项以及嵌入在弹窗里面组件的`props`传参和$emit通信事件`emitMethods`
     * @returns 弹窗组件的实例
     *
     *
     * @example
     * ...
     * ### `props.option`配置项 详情请前往[$ZtDialog属性文档](http://www.aqqxl.top/ZtDialogVc/)查看
     * ### 这是一个例子，如何在组件里面使用$ZtDialog命令式弹窗组件:
     *
     * #### AComponents.vue 嵌套在$ZtDialog中的组件可以是任何组件，这里以AComponents为例
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
     *   // A组件内部的jsDoc id请求详情接口需要
     *   id: {
     *     type: [String, Number],
     *     default: '',
     *     required: true,
     *   },
     * })
     * ```
     *
     * #### 在组件里面使用$ZtDialog命令式弹窗组件
     * ```ts
     * // 引入需要嵌套在$ZtDialog中的组件
     * import AComponents from 'AComponents.vue';
     * // Vue 3 提供的一个函数，用于在组件中获取当前实例的代理对象（proxy）。该对象提供了对组件数据和方法的响应式访问，避免了直接使用 this 关键字  通过proxy可以使用$ZtDialog组件
     * const proxy = getCurrentInstance()?.proxy
     *
     * const openZtDialog = () => {
     *   proxy?.$ZtDialog(AComponents, {
     *     option: {
     *       title: '测试$ZtDialog弹窗',
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
     * ```
     */
    $Dialog: DialogDirectiveInterface // 这里填类型
  }
}

// 必须导出，才能在其他文件中使用
export default ComponentCustomProperties
