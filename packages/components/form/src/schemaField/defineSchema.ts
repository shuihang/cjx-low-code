import { reactive, ref } from 'vue'
import type { SchemaItem } from './interface'

// 类型工具：提取 [{ label:'a', prop:'a' }, {label:'b', prop:'b'} ] 中的 所有 prop 比如提取成这样 [{ prop:'a' }, {prop:'b'} ]
export type SchemaItemArrayProps<T extends readonly { prop: string }[]> = {
  [K in keyof T]: { prop: T[K]['prop'] }
}

// 类型工具：提取数组中所有 prop 的类型
export type ExtractProps<T> = T extends readonly { prop: infer P }[] ? P : never

export function defineSchema<T extends readonly SchemaItem<SchemaItemArrayProps<T>>[]>(
  schema: T,
  proxy: 'ref' | 'reactive'
) {
  return proxy === 'ref' ? ref<T>(schema) : reactive(schema)
}

const _A: SchemaItemArrayProps<[{ label: 'a'; prop: 'a' }, { label: 'b'; prop: 'b' }]> = [
  {
    prop: 'a'
  },
  {
    prop: 'b'
  }
]

const a = defineSchema(
  [
    {
      label: '性别',
      prop: 'sex',
      type: 'select',
      on: {
        selectEvent: {
          onChange: (val, _helpers) => {
            _helpers.updateSchemaField(['sex'], {
              label: '年龄'
            })
          }
        }
      }
    }
  ],
  'reactive'
)
