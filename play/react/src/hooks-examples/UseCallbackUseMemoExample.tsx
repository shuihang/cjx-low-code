import React, { useCallback, useMemo, useState } from 'react'

/**
 * useCallback 和 useMemo Hook 示例
 *
 * useCallback: 缓存函数引用，避免不必要的重新渲染
 * 语法：const memoizedCallback = useCallback(() => { ... }, [dependencies]);
 *
 * useMemo: 缓存计算结果，避免不必要的重复计算
 * 语法：const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
 *
 * 应用场景：
 * 1. 传递给子组件的回调函数
 * 2. 计算密集型操作
 * 3. 依赖于 props 或 state 的复杂计算
 */

// 子组件：接收一个回调函数作为 prop
const ChildComponent = React.memo(
  ({ onClick, items }: { onClick: () => void; items: number[] }) => {
    console.log('子组件渲染了')

    return (
      <div style={{ padding: '15px', border: '1px solid #ddd', margin: '10px 0' }}>
        <h4>子组件</h4>
        <p>项目数量: {items.length}</p>
        <button onClick={onClick}>点击我</button>
      </div>
    )
  }
)

// 计算密集型函数
function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

function UseCallbackUseMemoExample() {
  const [count, setCount] = useState(0)
  const [number, setNumber] = useState(30)
  const [items, setItems] = useState<number[]>([1, 2, 3])

  // 1. 使用 useCallback 缓存回调函数
  // 这样即使父组件重新渲染，只要依赖项不变，回调函数的引用就不会改变
  const handleClick = useCallback(() => {
    console.log('按钮被点击了!')
    setItems((prev) => [...prev, prev.length + 1])
  }, []) // 空依赖数组，函数只会创建一次

  // 2. 使用 useMemo 缓存计算结果
  // 这样只有当 number 变化时，才会重新计算 fibonacci
  const fibResult = useMemo(() => {
    console.log('计算 fibonacci...')
    return fibonacci(number)
  }, [number]) // 依赖于 number

  // 3. 使用 useMemo 缓存派生状态
  const total = useMemo(() => {
    console.log('计算总和...')
    return items.reduce((sum, item) => sum + item, 0)
  }, [items]) // 依赖于 items

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px 0' }}>
      <h2>useCallback & useMemo 示例</h2>

      {/* 测试 useCallback */}
      <div style={{ marginBottom: '20px' }}>
        <h3>useCallback 测试</h3>
        <p>计数: {count}</p>
        <button onClick={() => setCount((prev) => prev + 1)}>增加计数 (父组件渲染)</button>
        <ChildComponent onClick={handleClick} items={items} />
        <p>注意: 查看控制台，观察子组件何时渲染</p>
      </div>

      {/* 测试 useMemo 计算密集型操作 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>useMemo 用于密集计算</h3>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(Number(e.target.value))}
          min="0"
          max="40"
          style={{ padding: '8px', width: '100px' }}
        />
        <p>
          斐波那契({number}): {fibResult}
        </p>
        <p>注意: 查看控制台，观察何时计算 fibonacci</p>
      </div>

      {/* 测试 useMemo 派生状态 */}
      <div>
        <h3>useMemo 用于派生状态</h3>
        <p>项目: {items.join(', ')}</p>
        <p>总和: {total}</p>
        <button onClick={handleClick}>添加项目</button>
        <p>注意: 查看控制台，观察何时计算总和</p>
      </div>
    </div>
  )
}

export default UseCallbackUseMemoExample
