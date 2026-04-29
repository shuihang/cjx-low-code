import { autorun, batch, observable } from '@cjx-low-code/reactivity'
import { FormPath } from '@cjx-low-code/shared'
import { createBatchStateSetter } from '../shared/internals'
import { runEffects } from '../shared'
import { Field } from './Field'
import { ObjectField } from './ObjectField'
import type { IFieldProps, IFieldStateSetter, JSXComponent } from '../types'

export interface IFormProps<T extends object = any> {
  // 初始值
  initialValues?: T
  // 是否禁用
  disabled?: boolean
  // 是否只读
  readOnly?: boolean
  // 模式：create/edit/view
  mode?: 'create' | 'edit' | 'view'
  // 副作用函数
  effects?: (form: Form<T>) => void
}

export interface IFormState {
  // 表单值（聚合所有字段的值）
  values: Record<string, unknown>
  // 初始值
  initialValues: Record<string, unknown>
  // 是否禁用
  disabled: boolean
  // 是否只读
  readOnly: boolean
  // 是否有效
  valid: boolean
  // 是否无效
  invalid: boolean
  // 是否正在验证
  validating: boolean
  // 是否已提交
  submitting: boolean
  // 是否已初始化
  initialized: boolean
  // 是否已挂载
  mounted: boolean
  // 模式
  mode: 'create' | 'edit' | 'view'
  // 错误信息
  errors: Record<string, string[]>
}

export class Form<ValueType extends object = any> {
  // 响应式状态
  public state: IFormState

  // // 表单值（聚合所有字段的值）
  // public values: Record<string, unknown> = {}

  // 字段 Map
  public fields: Map<string, Field> = new Map()

  // 字段数组（保持顺序）
  public fieldList: Field[] = []

  // 配置
  props: IFormProps<ValueType>

  // 响应式清理函数
  private disposers: (() => void)[] = []

  // Effects 清理函数
  public effectDisposers: (() => void)[] = []
  // 卸载回调
  public onUnmountCallbacks: (() => void)[] = []
  // 生命周期钩子
  private lifecycles: any[] = []

  constructor(props: IFormProps<ValueType> = {}) {
    this.props = props

    this.state = observable<IFormState>({
      values: { ...(props.initialValues || {}) },
      initialValues: { ...(props.initialValues || {}) },
      disabled: props.disabled ?? false,
      readOnly: props.readOnly ?? false,
      valid: true,
      invalid: false,
      validating: false,
      submitting: false,
      initialized: false,
      mounted: false,
      mode: props.mode || 'create',
      errors: {}
    })

    this.setValues = this.setValues.bind(this)
    this.getValues = this.getValues.bind(this)
    this.setValue = this.setValue.bind(this)
    this.getValue = this.getValue.bind(this)
    this.reset = this.reset.bind(this)
    this.validate = this.validate.bind(this)
    this.submit = this.submit.bind(this)
    this.createField = this.createField.bind(this)
    this.removeField = this.removeField.bind(this)
    this.query = this.query.bind(this)

    // 执行 effect 函数
    if (props.effects) {
      const lifecycles = runEffects(this, props.effects)
      this.lifecycles = lifecycles
    }

    // 标记为已初始化
    this.state.initialized = true
  }

  createField = <Decorator extends JSXComponent, Component extends JSXComponent>(
    props: IFieldProps<Decorator, Component>
  ): Field<Decorator, Component> => {
    const address = FormPath.parse(props.basePath)
    const basePath = (address as any)?.entire || ''
    const fullPath = basePath ? `${basePath}.${props.name}` : props.name
    const field = new Field(
      address,
      {
        ...props,
        // 从表单初始值中按完整路径获取字段值
        value: props.value ?? FormPath.getIn(this.state.initialValues, fullPath)
      },
      this
    )

    // 建立双向引用
    field.form = this
    this.fields.set(props.name, field)
    this.fieldList.push(field)

    // 同步表单状态到字段
    field.state.disabled = field.state.disabled || this.state.disabled
    field.state.readOnly = field.state.readOnly || this.state.readOnly

    // 监听字段值变化，同步到表单 values
    const disposer = autorun(() => {
      const value = field.state.value
      // 按完整路径设置值，如 'test.gg'
      FormPath.setIn(this.state.values, field.path, value)
      // 触发 watchValuse 回调函数
      if (this.watchValuse) {
        this.watchValuse(this, field)
      }
    })
    this.disposers.push(disposer)
    ;(field as any)._valueDisposer = disposer

    // 触发字段初始化生命周期钩子
    this.lifecycles.forEach((lifecycle) => {
      if (lifecycle.type === 'onFieldInit') {
        lifecycle.callback(field, this)
      }
    })

    return field
  }

  createObjectField = <Decorator extends JSXComponent, Component extends JSXComponent>(
    props: IFieldProps<Decorator, Component>
  ): ObjectField<Decorator, Component> => {
    const address = FormPath.parse(props.basePath)
    const basePath = (address as any)?.entire || ''
    const fullPath = basePath ? `${basePath}.${props.name}` : props.name
    const field = new ObjectField(
      address,
      {
        ...props,
        // 从表单初始值中按完整路径获取字段值
        value: (props.value ?? FormPath.getIn(this.state.initialValues, fullPath)) || {}
      },
      this
    )
    // 建立双向引用
    field.form = this
    this.fields.set(props.name, field)
    this.fieldList.push(field)

    // 同步表单状态到字段
    field.state.disabled = field.state.disabled || this.state.disabled
    field.state.readOnly = field.state.readOnly || this.state.readOnly

    // 监听字段值变化，同步到表单 values
    const disposer = autorun(() => {
      const value = field.state.value
      // 按完整路径设置值，如 'test'
      FormPath.setIn(this.state.values, field.path, value)
      // 触发 watchValuse 回调函数
      if (this.watchValuse) {
        this.watchValuse(this, field)
      }
    })
    this.disposers.push(disposer)
    ;(field as any)._valueDisposer = disposer

    // 触发字段初始化生命周期钩子
    this.lifecycles.forEach((lifecycle) => {
      if (lifecycle.type === 'onFieldInit') {
        lifecycle.callback(field, this)
      }
    })

    return field
  }

  // 回调函数
  watchValuse?: (form: Form<ValueType>, field: Field) => void

  setFieldState: IFieldStateSetter = createBatchStateSetter(this)

  removeField(name: string): void {
    const field = this.fields.get(name)
    if (field) {
      // 清理字段值同步的 autorun
      const disposer = (field as any)._valueDisposer
      if (disposer) {
        disposer()
        const idx = this.disposers.indexOf(disposer)
        if (idx > -1) this.disposers.splice(idx, 1)
      }

      field.onUnmount()
      this.fields.delete(name)
      const index = this.fieldList.indexOf(field)
      if (index > -1) {
        this.fieldList.splice(index, 1)
      }
      // 从 values 中按完整路径移除
      const segments = FormPath.parse(field.path).segments
      let source = this.state.values
      for (let i = 0; i < segments.length - 1; i++) {
        if (!source || typeof source !== 'object') break
        source = source[segments[i]]
      }
      if (source && typeof source === 'object') {
        delete source[segments[segments.length - 1]]
      }
      delete this.state.errors[name]
    }
  }

  query(pattern: string): Field[] {
    // 支持简单的通配符查询，如 "user.*"
    if (pattern.includes('*')) {
      const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`)
      return this.fieldList.filter((f) => regex.test(f.name))
    }
    const field = this.fields.get(pattern)
    return field ? [field] : []
  }

  setValue(name: string, value: unknown): void {
    const field = this.fields.get(name)
    if (field) {
      field.setValue(value)
    } else {
      // 字段不存在时，直接设置到 values
      batch(() => {
        this.state.values[name] = value
      })
    }
  }

  getValue(name: string): unknown {
    const field = this.fields.get(name)
    if (field) {
      return field.getValue()
    }
    return this.state.values[name]
  }

  /**
   * 设置多个字段值
   */
  setValues(values: Record<string, unknown>): void {
    batch(() => {
      Object.entries(values).forEach(([key, value]) => {
        this.setValue(key, value)
      })
    })
  }

  /**
   * 获取所有表单值
   */
  getValues(): Record<string, unknown> {
    // 从所有字段中收集值
    const values: Record<string, unknown> = {}
    this.fields.forEach((field, name) => {
      values[name] = field.getValue()
    })
    return values
  }

  /**
   * 验证整个表单
   */
  async validate(): Promise<Record<string, string[]>> {
    this.state.validating = true

    try {
      const errors: Record<string, string[]> = {}

      // 并行验证所有字段
      const results = await Promise.all(
        Array.from(this.fields.values()).map(async (field) => {
          const fieldErrors = await field.validate()
          return { name: field.name, errors: fieldErrors }
        })
      )

      results.forEach(({ name, errors: fieldErrors }) => {
        if (fieldErrors.length > 0) {
          errors[name] = fieldErrors
        }
      })

      batch(() => {
        this.state.errors = errors
        this.updateValidState()
      })

      return errors
    } finally {
      this.state.validating = false
    }
  }

  /**
   * 验证指定字段
   */
  validateFields?: (names: string[]) => Promise<Record<string, string[]>>

  /**
   * 更新表单有效状态
   */
  private updateValidState(): void {
    const hasErrors = Object.keys(this.state.errors).length > 0
    this.state.valid = !hasErrors
    this.state.invalid = hasErrors
  }

  /**
   * 提交表单
   */
  async submit<T = Record<string, unknown>>(): Promise<T> {
    this.state.submitting = true

    try {
      // 先验证
      const errors = await this.validate()

      if (Object.keys(errors).length > 0) {
        throw new Error('表单验证失败')
      }

      return this.getValues() as T
    } finally {
      this.state.submitting = false
    }
  }

  /**
   * 重置表单
   */
  reset(): void {
    batch(() => {
      // 重置所有字段
      this.fields.forEach((field) => field.reset())
      // 重置表单状态
      this.state.errors = {}
      this.updateValidState()
    })
  }

  /**
   * 表单挂载
   */
  onMount(): void {
    this.state.mounted = true
    this.fields.forEach((field) => field.onMount())
  }

  /**
   * 表单卸载
   */
  onUnmount(): void {
    this.state.mounted = false
    // 清理所有响应式订阅
    this.disposers.forEach((dispose) => dispose())
    this.disposers = []
    // 卸载所有字段
    this.fields.forEach((field) => field.onUnmount())
  }

  /**
   * 禁用表单
   */
  disable(): void {
    batch(() => {
      this.state.disabled = true
      this.fields.forEach((field) => {
        field.state.disabled = true
      })
    })
  }

  /**
   * 启用表单
   */
  enable(): void {
    batch(() => {
      this.state.disabled = false
      this.fields.forEach((field) => {
        field.state.disabled = false
      })
    })
  }

  /**
   * 设置表单模式
   */
  setMode(mode: 'create' | 'edit' | 'view'): void {
    this.state.mode = mode
    if (mode === 'view') {
      this.fields.forEach((field) => field.setReadOnly(true))
    }
  }
}

export function createForm(props?: IFormProps): Form {
  return new Form(props)
}
