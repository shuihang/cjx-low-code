/*
 ** 工具函数
 */
import { h } from 'vue'
import { clone } from 'lodash-es'
import XDicTag from '../dicTag'
import type {
  ColorTypeInterface,
  DicDataInterface,
} from '../dicTag'

export type { DicDataInterface, ColorTypeInterface }

export interface PropsInterface {
  /**  选项标签为选项对象的某个属性值 默认label */
  label?: string
  /** 选项的值为选项对象的某个属性值 默认value */
  value?: string
  /** 选项的禁用为选项对象的某个属性值 */
  disabled?: boolean
  /**  选项的子选项为选项对象的某个属性值 默认children */
  children?: string
  /** 选项返回结构的层级(例如data.data) */
  res?: string
}

/**
 * 排序函数
 * @param arr 需要排序的数组  数组类型Array<object>
 * @param key 需要排序的数组里对象的key
 * @param customFunc 自定义需要处理数据的函数
 */
export const arraySort = <T extends object, K extends keyof T>(
  arr: T[],
  key: K,
  customFunc?: (a: T) => void
): T[] => {
  const cloneArr = clone(arr)

  return cloneArr.sort((a, b) => {
    if (customFunc) {
      customFunc(a)
      customFunc(b)
    }
    return ((b[key] || 1) as number) - ((a[key] || 1) as number)
  })
}

/**
 * 字典值翻译函数
 * @param str 需要翻译的字段
 * @param dicData 字典数据
 * @param props
 */
export const translateStr = (
  str: string | number,
  dicData: DicDataInterface | undefined,
  props?: PropsInterface
) => {
  const strArr: string[] = []

  if (!`${str}` || !dicData) return str

  const arr = `${str}`.split(',')

  if (arr.length === 1) {
    let vNode: any = str
    dicData?.forEach((item) => {
      if (item[props?.value || 'value'] == str) {
        vNode = item.colorType ?  h(XDicTag, {
          colorType: item.colorType,
          label: item[props?.label || 'label']
        }) : (
          item[props?.label || 'label']
        )
      }
    })
    return vNode
  }
  dicData.forEach((item) => {
    arr.includes(`${item[props?.value || 'value']}`) &&
      strArr.push(item[props?.label || 'label'])
  })
  return strArr.join(',')
}

export const translateCheckFormStr = (
  str: string | number,
  dicData: DicDataInterface | undefined,
  props?: PropsInterface
) => {
  const strArr: string[] = []

  if (!`${str}` || !dicData) return str

  dicData.forEach((item) => {
    ;`${str}`.split(',').includes(`${item[props?.value || 'value']}`) &&
      strArr.push(item[props?.label || 'label'])
  })

  return strArr.join(',')
}
