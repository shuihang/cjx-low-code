import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash-unified'
import type { FormComponentProps } from '@/defaultFormTemplates'

import { FormItemsDefaultPropsType, formItemsDefaultProps } from '@/defaultProps'

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: FormComponentProps[]
  // 当前编辑的是那个元素 uuid
  currentElement: string
}

const useEditorStore = defineStore('editor', {
  state: (): EditorProps => ({
    components: [],
    currentElement: ''
  }),
  actions: {
    addComponents(props: FormComponentProps & { insertIndex?: number; insertType?: string }) {
      const { insertIndex, insertType, ...rest } = props

      const item: FormComponentProps = {
        // ...formItemsDefaultProps[component],
        ...rest,
        name: uuidv4()
      }

      // 如果指定了插入位置，在指定位置插入；否则添加到末尾
      if (insertIndex !== undefined && insertIndex >= 0) {
        // @ts-ignore
        this.components.splice(insertIndex, 0, item)
        console.log(`在位置 ${insertIndex} 插入组件 (${insertType}):`, item)
      } else {
        // @ts-ignore
        this.components.push(item)
        console.log('添加组件到末尾:', item)
      }
    },
    setActive(currentId: string) {
      this.currentElement = currentId
    },
    updateComponents(data: { key: string; value: string; id?: string }) {
      const { key, value, id } = data
      const updateComponents = this.components.find(
        (item) => item.name === (id || this.currentElement)
      )

      if (!updateComponents) return
      updateComponents[key] = value
    },
    clearComponents() {
      this.components = []
    },
    deleteComponents() {
      this.components = this.components.filter((item) => item.name !== this.currentElement)
    },
    copyComponents() {
      const currentElement = this.getCurrentElement
      if (!currentElement) return
      const copyItem = cloneDeep(currentElement)
      copyItem.name = uuidv4()
      this.components.push(copyItem)
    },
    moveComponents(fromIndex: number, toIndex: number) {
      if (fromIndex === toIndex) return
      const [movedItem] = this.components.splice(fromIndex, 1)
      this.components.splice(toIndex, 0, movedItem)
    }
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find((item) => item.name === state.currentElement)
    }
  }
})

export default useEditorStore
