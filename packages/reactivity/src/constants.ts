// using literal strings instead of numbers so that it's easier to inspect
// debugger events

export enum TrackOpTypes {
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate'
}

export enum TriggerOpTypes {
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear'
}

export enum ObservableFlags {
  /**
   * 跳过标记。如果一个对象上有这个标记，并且值为 `true`，那么 `Vue` 的响应式系统会完全跳过它，永远不会尝试将其转换为响应式代理。
   * #### 应用场景:
   * 性能优化：对于一些确定永远不会需要响应式的大型、静态数据结构，可以手动标记它，避免 `Vue` 在递归转换时浪费性能。
   * 避免重复代理：在某些内部逻辑中，`Vue` 可能用它来标记一个已经被处理过或明确不应被处理的对象。
   */
  SKIP = '__v_skip',
  /**
   * 是否为响应式标记。如果一个对象是响应式代理，那么这个代理对象上会有这个标记，并且值为 `true`。
   * #### 应用场景:
   * 身份识别：这是 `isObservable()` 工具函数的核心实现原理。当你调用 `isObservable(obj)` 时，它内部就是检查 `obj[ObservableFlags.IS_OBSERVABLE]` 是否为 `true`。
   */
  IS_OBSERVABLE = '__v_isObservable',
  /**
   * 含义：是否为只读标记。与 `IS_OBSERVABLE` 类似，如果一个对象是只读代理，那么这个代理对象上会有这个标记，并且值为 `true`。
   * ### 应用场景:
   * 身份识别：这是 `isReadonly()` 工具函数的核心实现原理。
   */
  IS_READONLY = '__v_isReadonly',
  /**
   * 是否为浅层标记。如果一个对象是浅层响应式代理（由 ` shallowReactive` 或 `shallowReadonly` 创建），那么这个代理对象上会有这个标记，并且值为 `true`。
   * ### 应用场景:
   * `Vue` 内部在执行依赖收集和触发时，可能会检查这个标记，以决定是否需要递归地处理嵌套对象。例如，在 `get` 陷阱中，如果发现当前代理是浅层的，就不会对获取到的嵌套对象进行 `reactive()` 转换。
   */
  IS_SHALLOW = '__v_isShallow',
  /**
   * 原始对象引用。这是 `toRaw()` 函数能够工作的关键。在一个响应式代理对象上，这个属性会持有它所代理的那个原始对象的引用。
   * ### 应用场景:
   * 获取原始对象：`toRaw()` 函数就是通过读取代理对象上的 `ReactiveFlags.RAW` 属性来获取原始对象的。
   * 避免重复代理：当你尝试对一个已经是响应式代理的对象再次调用 `reactive()` 时，`Vue` 内部会检查这个代理上是否有 `ReactiveFlags.RAW` 属性。如果有，就直接返回这个代理本身，而不是创建一个新的代理。
   */
  RAW = '__v_raw'
}

export enum DirtyLevels {
  NotDirty = 0,
  QueryingDirty = 1,
  MaybeDirty_ComputedSideEffect = 2,
  MaybeDirty = 3,
  Dirty = 4
}
