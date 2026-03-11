// 基础定义
export interface BaseField {
  label: string
  prop: string
  type?: string
}

export interface GroupField extends BaseField {
  type: 'group'
  column: SchemaItem[] | readonly SchemaItem[]
}

export type InputType =
  | 'input'
  | 'inputNumber'
  | 'select'
  | 'checkbox'
  | 'datePicker'
  | 'radio'
  | 'radioButton'
  | 'cascader'
  | 'switch'
  | 'treeSelect'
  | 'colorPicker'
  | 'editTable'

export interface InputField extends BaseField {
  type: InputType
  column?: never
}

export type SchemaItem = GroupField | InputField

// 提取 prop 类型
type Prop<T> = T extends { prop: infer P extends string } ? P : never

// 检查 group 内的字段
type CheckUniqueGroup<T extends readonly SchemaItem[], Seen extends string> = T extends readonly [
  infer First extends SchemaItem,
  ...infer Rest extends readonly SchemaItem[]
]
  ? First extends GroupField
    ? CheckUniqueGroup<First['column'], Seen | Prop<First>> extends infer GroupError
      ? GroupError extends { error: string }
        ? GroupError
        : CheckUniqueGroup<Rest, Seen | Prop<First>>
      : CheckUniqueGroup<Rest, Seen | Prop<First>>
    : Prop<First> extends Seen
    ? { error: `重复的 prop: ${Prop<First>}` }
    : CheckUniqueGroup<Rest, Seen | Prop<First>>
  : true

// 检查整个 Schema
export type CheckUnique<T extends readonly SchemaItem[]> = CheckUniqueGroup<T, never>

// 辅助函数：提供友好的错误提示
export function defineSchema<T extends readonly SchemaItem[]>(
  schema: T & (CheckUnique<T> extends true ? T : CheckUnique<T>)
): T {
  return schema
}

// 简化版函数：自动处理类型，使用者不需要写 as const
export function dp<T extends SchemaItem[]>(schema: T): T {
  return schema
}

// 类型工具：提取数组中所有 prop 的类型
type ExtractProps<T> = T extends readonly { prop: infer P }[] ? P : never

// 类型工具：检查联合类型中是否有重复类型
type IsUnion<T> = [T] extends [never]
  ? false
  : T extends infer U
  ? [U] extends [T]
    ? false
    : true
  : false

// 类型工具：检查是否有重复 prop
type HasDuplicateProps<T extends readonly SchemaItem[]> = IsUnion<ExtractProps<T>> extends true
  ? { error: 'Schema 中存在重复的 prop' }
  : true

// 增强版 dp 函数，支持编译时检查
export function dpWithCheck<T extends readonly SchemaItem[]>(
  schema: T & (HasDuplicateProps<T> extends true ? T : HasDuplicateProps<T>)
): T {
  return schema
}

type A = ExtractProps<[{ prop: 'a' }, { prop: 'b' }]>

// 测试用例
const validSchema = defineSchema([
  { label: '姓名', prop: 'name', type: 'input' },
  { label: '年龄', prop: 'age', type: 'inputNumber' },
  { label: '姓名', prop: 'name', type: 'input' }
] as const)

// 编译时会报错
// const invalidSchema = dp([
//   { label: '姓名', prop: 'name', type: 'input' },
//   { label: '年龄', prop: 'name', type: 'inputNumber' } // 重复的 prop
// ])

// 测试用例

// ❌ 重复 prop（同一级别）
const invalidSchema1 = dp([
  { label: '姓名', prop: 'name', type: 'input' },
  { label: '年龄', prop: 'age', type: 'inputNumber' },
  { label: '重复', prop: 'name', type: 'input' },
  { label: '性别', prop: 'gender', type: 'radio' },
  { label: '联系电话', prop: 'phone', type: 'input' },
  { label: '邮箱', prop: 'email', type: 'input' },
  { label: '地址', prop: 'address', type: 'input' },
  { label: '备注', prop: 'remark', type: 'input' },
  { label: '提交时间', prop: 'submitTime', type: 'datePicker' },
  { label: '提交人', prop: 'submitter', type: 'input' },
  { label: '提交状态', prop: 'submitStatus', type: 'radioButton' },
  { label: 'a', prop: 'a', type: 'input' },
  { label: 'b', prop: 'b', type: 'input' },
  { label: 'c', prop: 'c', type: 'input' },
  { label: 'd', prop: 'd', type: 'input' },
  { label: 'e', prop: 'e', type: 'input' },
  { label: 'f', prop: 'f', type: 'input' },
  { label: 'g', prop: 'g', type: 'input' },
  { label: 'h', prop: 'h', type: 'input' },
  { label: 'i', prop: 'i', type: 'input' },
  { label: 'j', prop: 'j', type: 'input' },
  { label: 'k', prop: 'k', type: 'input' },
  { label: 'l', prop: 'l', type: 'input' },
  { label: 'm', prop: 'm', type: 'input' },
  { label: 'n', prop: 'n', type: 'input' },
  { label: 'o', prop: 'o', type: 'input' },
  { label: 'p', prop: 'p', type: 'input' },
  { label: 'q', prop: 'q', type: 'input' },
  { label: 'r', prop: 'r', type: 'input' },
  { label: 's', prop: 's', type: 'input' },
  { label: 't', prop: 't', type: 'input' },
  { label: 'u', prop: 'u', type: 'input' },
  { label: 'v', prop: 'v', type: 'input' },
  { label: 'w', prop: 'w', type: 'input' },
  { label: 'x', prop: 'x', type: 'input' },
  { label: 'y', prop: 'y', type: 'input' },
  { label: 'z', prop: 'z', type: 'input' }
])

// ❌ 重复 prop（嵌套 group）
const invalidSchema2 = defineSchema([
  { label: '姓名', prop: 'name', type: 'input' },
  {
    label: '联系方式',
    prop: 'contact',
    type: 'group',
    column: [
      { label: '电话', prop: 'phone', type: 'input' },
      { label: '姓名', prop: 'name', type: 'input' },
      { label: '电话', prop: 'phone', type: 'input' }
    ]
  }
])
