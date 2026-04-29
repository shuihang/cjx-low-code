import { FormPath, isNaN, toArr } from '@cjx-low-code/shared'
import { batch, observable } from '@cjx-low-code/reactivity'
import { createStateSetter, getValuesFromEvent, isHTMLInputEvent } from '../shared'
import { BaseField } from './BaseField'
import type { FormPathPattern } from '@cjx-low-code/shared'
import type { Form } from './Form'
import type { IFieldProps, IFieldState, IModelSetter, JSXComponent } from '../types'

export class Field<
  Decorator extends JSXComponent = any,
  Component extends JSXComponent = any,
  TextType = any,
  ValueType = any
> extends BaseField<Decorator, Component, TextType> {
  displayName = 'Field'

  // 响应式状态
  state!: IFieldState

  // 父表单/字段引用
  form: Form

  // 字段路径（支持嵌套，如 'user.name'）
  name: string

  // 字段地址（用于路径匹配）
  address: FormPath

  // 字段路径（用于路径匹配）
  path: string

  // 子字段（用于对象/数组字段）
  fields: Map<string, Field> = new Map()

  // 父字段
  parent: Field | null = null

  // 自定义属性存储
  props: IFieldProps<Decorator, Component, TextType, ValueType>

  // 反应列表（用于组件订阅）
  reactions: Set<() => void> = new Set()

  // 验证控制器（用于取消异步验证）
  validateController: AbortController | null = null

  initialized = false
  mounted = false
  unmounted = false

  constructor(
    address: FormPathPattern,
    props: IFieldProps<Decorator, Component, TextType, ValueType>,
    form: Form
  ) {
    super()

    this.name = props.name
    this.form = form
    // 手动拼接完整路径（FormPath.parse 的 base 参数在当前实现中未生效）
    const basePath = (address as any)?.entire || ''
    const fullPath = basePath ? `${basePath}.${props.name}` : props.name
    this.address = FormPath.parse(fullPath)
    this.path = fullPath
    console.log('Field initialized with path:', basePath, fullPath, `naem--: ${props.name}`)
    this.props = props
    this.slots = props.slots || {}

    this.initialize()

    this.setValue = this.setValue.bind(this)
    this.getValue = this.getValue.bind(this)
    // this.validate = this.validate.bind(this)
    this.setDisplay = this.setDisplay.bind(this)
    this.reset = this.reset.bind(this)
  }

  protected initialize() {
    this.state = observable<IFieldState>({
      name: this.props.name,
      value: this.props.value,
      title: this.props.title || '',
      description: this.props.description || '',
      disabled: this.props.disabled ?? false,
      readOnly: this.props.readOnly ?? false,
      display: this.props.display ?? 'visible',
      visible: this.props.display !== 'none' && this.props.display !== 'hidden',
      hidden: this.props.display === 'hidden',
      valid: true,
      invalid: false,
      validating: false,
      errors: [],
      // selfErrors: [],
      // rules: this.props.rules || [],
      // required: this.props.rules?.some((r) => r.required) ?? false,
      initialized: false,
      mounted: false,
      unmounted: false
    })

    this.name = this.props.name
    this.description = this.props.description
    this.disabled = this.props.disabled ?? false
    this.readOnly = this.props.readOnly ?? false
    this.decorator = [this.props.decorator, this.props.decoratorProps || {}]
    this.component = [this.props.component, this.props.componentProps || {}]
    // 标记为已初始化
    this.state.initialized = true
  }

  setState: IModelSetter<IFieldState> = createStateSetter(this)

  /**
   * 设置字段值
   */
  setValue(value: unknown): void {
    batch(() => {
      this.state.value = value
      // 值变化时清除错误（可选行为）
      // this.state.selfErrors = []
      // this.state.errors = []
      // this.updateValidState()
    })
  }

  /**
   * 获取字段值
   */
  getValue(): unknown {
    return this.state.value
  }

  /**
   * 获取字段值（别名）
   */
  get value(): unknown {
    return this.state.value
  }

  /**
   * 设置字段值（属性访问器）
   */
  set value(val: unknown) {
    this.setValue(val)
  }

  /**
   * 是否有效
   */
  get valid(): boolean {
    return this.state.valid
  }

  /**
   * 是否无效
   */
  get invalid(): boolean {
    return this.state.invalid
  }

  /**
   * 是否正在验证
   */
  get validating(): boolean {
    return this.state.validating
  }

  /**
   * 错误信息列表
   */
  get errors(): string[] {
    return this.state.errors
  }

  /**
   * 执行验证
   */
  validate: () => Promise<string[]>
  // async validate(): Promise<string[]> {
  // 取消之前的验证
  // this.validateController?.abort()
  // this.validateController = new AbortController()
  // this.state.validating = true
  // const errors: string[] = []
  // try {
  //   const value = this.state.value
  //   const rules = this.state.rules
  //   for (const rule of rules) {
  //     // 检查是否已取消
  //     if (this.validateController.signal.aborted) {
  //       break
  //     }
  //     // 必填验证
  //     if (rule.required) {
  //       if (value === undefined || value === null || value === '') {
  //         errors.push(rule.message || `${this.state.title || this.name} 不能为空`)
  //         continue
  //       }
  //     }
  //     // 跳过空值的其他验证（非必填时）
  //     if (value === undefined || value === null || value === '') {
  //       continue
  //     }
  //     // 最小长度验证
  //     if (rule.minLength !== undefined) {
  //       const str = String(value)
  //       if (str.length < rule.minLength) {
  //         errors.push(rule.message || `长度不能少于 ${rule.minLength} 个字符`)
  //         continue
  //       }
  //     }
  //     // 最大长度验证
  //     if (rule.maxLength !== undefined) {
  //       const str = String(value)
  //       if (str.length > rule.maxLength) {
  //         errors.push(rule.message || `长度不能超过 ${rule.maxLength} 个字符`)
  //         continue
  //       }
  //     }
  //     // 最小值验证
  //     if (rule.min !== undefined) {
  //       const num = Number(value)
  //       if (!isNaN(num) && num < rule.min) {
  //         errors.push(rule.message || `不能小于 ${rule.min}`)
  //         continue
  //       }
  //     }
  //     // 最大值验证
  //     if (rule.max !== undefined) {
  //       const num = Number(value)
  //       if (!isNaN(num) && num > rule.max) {
  //         errors.push(rule.message || `不能大于 ${rule.max}`)
  //         continue
  //       }
  //     }
  //     // 正则验证
  //     if (rule.pattern) {
  //       if (!rule.pattern.test(String(value))) {
  //         errors.push(rule.message || '格式不正确')
  //         continue
  //       }
  //     }
  //     // 自定义验证器
  //     if (rule.validator) {
  //       const result = await rule.validator(value)
  //       if (result) {
  //         errors.push(result)
  //       }
  //     }
  //   }
  //   batch(() => {
  //     this.state.selfErrors = errors
  //     this.state.errors = errors
  //     this.updateValidState()
  //   })
  //   return errors
  // } finally {
  //   this.state.validating = false
  // }
  // }

  /**
   * 更新有效状态
   */
  private updateValidState(): void {
    // const hasError = this.state.errors.length > 0
    // this.state.valid = !hasError
    // this.state.invalid = hasError
  }

  /**
   * 字段挂载
   */
  onMount(): void {
    this.state.mounted = true
    this.state.unmounted = false
  }

  /**
   * 字段卸载
   */
  onUnmount(): void {
    this.state.mounted = false
    this.state.unmounted = true
    // 清理反应
    this.reactions.clear()
  }

  /**
   * 输入事件处理
   */
  onInput(...args: any[]): void {
    const isHTMLInputEventFromSelf = (args: any[]) =>
      isHTMLInputEvent(args[0]) && 'currentTarget' in args[0]
        ? args[0]?.target === args[0]?.currentTarget
        : true
    const getValues = (args: any[]) => {
      if (args[0]?.target) {
        if (!isHTMLInputEvent(args[0])) return args
      }
      return getValuesFromEvent(args)
    }
    if (!isHTMLInputEventFromSelf(args)) return
    const values = getValues(args)
    const value = values[0]
    // this.value = value
    this.setValue(value)
  }

  /**
   * 聚焦事件处理
   */
  onFocus(...args: any[]): void {
    console.log('onFocus')
    // 可扩展：设置 focused 状态等
  }

  /**
   * 失焦事件处理
   */
  onBlur(...args: any[]): void {
    console.log('onBlur')
    // 可扩展：触发验证等
    this.validate()
  }

  /**
   * 重置字段
   */
  reset(): void {
    batch(() => {
      this.state.value = this.props.value
      // this.state.errors = []
      // this.state.selfErrors = []
      // this.updateValidState()
    })
  }

  /**
   * 订阅状态变化
   */
  subscribe(callback: () => void): () => void {
    this.reactions.add(callback)
    return () => {
      this.reactions.delete(callback)
    }
  }

  /**
   * 获取字段路径（用于嵌套字段）
   */
  getPath(): string {
    if (this.parent) {
      return `${this.parent.getPath()}.${this.name}`
    }
    return this.name
  }

  /**
   * 设置显示状态
   */
  setDisplay(display: 'visible' | 'hidden' | 'none'): void {
    this.state.display = display
    this.state.visible = display === 'visible'
    this.state.hidden = display === 'hidden'
  }

  /**
   * 禁用字段
   */
  disable(): void {
    this.state.disabled = true
  }

  /**
   * 启用字段
   */
  enable(): void {
    this.state.disabled = false
  }

  /**
   * 设置只读
   */
  setReadOnly(readOnly: boolean): void {
    this.state.readOnly = readOnly
  }

  /**
   * 设置标题
   */
  setTitle(title: string): void {
    this.state.title = title
  }

  /**
   * 设置描述
   */
  setDescription(desc: string): void {
    this.state.description = desc
  }
}
