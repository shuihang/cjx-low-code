import { h } from 'vue'
import { formatVue3VNodeData } from '../utils/formatVNodeData'
import { Fragment, FragmentComponent } from './fragment'

type RenderChildren = {
  [key in string]?: (...args: any[]) => (VNode | string)[]
}

type Tag = any
type VNodeData = Record<string, any>
type VNode = any

const compatibleCreateElement = (tag: Tag, data: VNodeData, components: RenderChildren): any => {
  if (tag === Fragment) {
    tag = FragmentComponent
  }
  const hInVue3 = h as (tag: Tag, data?: VNodeData, components?: RenderChildren) => VNode
  return hInVue3(tag, formatVue3VNodeData(data), components)
}

export default compatibleCreateElement

export { compatibleCreateElement as h }
