import { ref } from 'vue'
import canUseDom from '../../_util/canUseDom'

let uuid = 0

/** 是客户端而不是jsdom */
export const isBrowserClient = process.env.NODE_ENV !== 'test' && canUseDom()

/** 获取可访问性使用的唯一id */
export function getUUID(): number | string {
  let retId: string | number

  // 测试永远无法到达
  /* istanbul ignore if */
  if (isBrowserClient) {
    retId = uuid
    uuid += 1
  } else {
    retId = 'TEST_OR_SSR'
  }

  return retId
}

export default function useId(id = ref('')) {
  // 可访问性使用的内部id。仅在客户端工作
  const innerId = `x_crud_${getUUID()}`

  return id.value || innerId
}
