import React from 'react'
import UseStateExample from './UseStateExample'
import UseEffectExample from './UseEffectExample'
import UseContextExample from './UseContextExample'
import UseReducerExample from './UseReducerExample'
import UseCallbackUseMemoExample from './UseCallbackUseMemoExample'
import UseRefExample from './UseRefExample'
import CustomHooksExample from './CustomHooksExample'

/**
 * React Hooks 教学示例集合
 *
 * 本文件包含了常用 React Hooks 的示例：
 * 1. useState - 状态管理
 * 2. useEffect - 副作用处理
 * 3. useContext - 上下文共享
 * 4. useReducer - 复杂状态管理
 * 5. useCallback & useMemo - 性能优化
 * 6. useRef - DOM 访问和值存储
 * 7. 自定义 Hook - 逻辑重用
 *
 * 每个示例都包含了详细的注释和使用场景说明
 */

function HooksExamples() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>React Hooks 教学示例</h1>

      <UseStateExample />
      <UseEffectExample />
      <UseContextExample />
      <UseReducerExample />
      <UseCallbackUseMemoExample />
      <UseRefExample />
      <CustomHooksExample />

      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      >
        <h2>总结</h2>
        <p>
          React Hooks 是 React 16.8 引入的新特性，它允许你在函数组件中使用状态和其他 React 特性。
        </p>
        <p>常用的 Hooks 包括：</p>
        <ul>
          <li>
            <strong>useState</strong>: 管理组件状态
          </li>
          <li>
            <strong>useEffect</strong>: 处理副作用
          </li>
          <li>
            <strong>useContext</strong>: 共享状态
          </li>
          <li>
            <strong>useReducer</strong>: 复杂状态管理
          </li>
          <li>
            <strong>useCallback</strong>: 缓存函数
          </li>
          <li>
            <strong>useMemo</strong>: 缓存计算结果
          </li>
          <li>
            <strong>useRef</strong>: 访问 DOM 和存储值
          </li>
          <li>
            <strong>自定义 Hook</strong>: 重用逻辑
          </li>
        </ul>
        <p>通过这些示例，你可以了解如何在实际项目中使用这些 Hooks 来编写更简洁、更可维护的代码。</p>
      </div>
    </div>
  )
}

export default HooksExamples
