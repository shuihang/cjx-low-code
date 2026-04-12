import { useEffect, useRef, useState } from 'react'

/**
 * useRef Hook 示例
 *
 * useRef 有两个主要用途：
 * 1. 访问 DOM 元素
 * 2. 存储可变值，不触发重新渲染
 *
 * 语法：const ref = useRef(initialValue);
 *
 * 应用场景：
 * 1. 访问 DOM 元素（如输入框焦点）
 * 2. 存储定时器 ID
 * 3. 存储前一个状态值
 * 4. 跨渲染周期保存数据
 */

function UseRefExample() {
  const [count, setCount] = useState(0)
  const [inputValue, setInputValue] = useState('')

  // 1. 用于访问 DOM 元素
  const inputRef = useRef<HTMLInputElement>(null)

  // 2. 用于存储定时器 ID
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // 3. 用于存储前一个状态值
  const prevCountRef = useRef<number>(count)

  // 4. 用于存储任意值
  const randomValueRef = useRef<number>(Math.random())

  // 当 count 变化时，更新 prevCountRef
  useEffect(() => {
    prevCountRef.current = count
  }, [count])

  // 自动聚焦输入框
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // 启动定时器
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setCount((prev) => prev + 1)
    }, 1000)
  }

  // 停止定时器
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // 重置计数
  const resetCount = () => {
    stopTimer()
    setCount(0)
  }

  // 聚焦输入框
  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px 0' }}>
      <h2>useRef 示例</h2>

      {/* 1. 访问 DOM 元素 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>DOM 元素访问</h3>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="输入一些内容..."
          style={{ padding: '8px', width: '200px' }}
        />
        <button onClick={focusInput} style={{ marginLeft: '10px', padding: '8px 16px' }}>
          聚焦输入框
        </button>
        <p>输入值: {inputValue}</p>
      </div>

      {/* 2. 存储定时器 ID */}
      <div style={{ marginBottom: '20px' }}>
        <h3>定时器示例</h3>
        <p>计数: {count}</p>
        <p>前一个计数: {prevCountRef.current}</p>
        <button onClick={startTimer} style={{ margin: '0 5px', padding: '8px 16px' }}>
          启动定时器
        </button>
        <button onClick={stopTimer} style={{ margin: '0 5px', padding: '8px 16px' }}>
          停止定时器
        </button>
        <button onClick={resetCount} style={{ margin: '0 5px', padding: '8px 16px' }}>
          重置
        </button>
      </div>

      {/* 3. 存储任意值 */}
      <div>
        <h3>存储任意值</h3>
        <p>随机值 (跨渲染周期持久化): {randomValueRef.current}</p>
        <button
          onClick={() => {
            // 更新 ref 的值不会触发重新渲染
            randomValueRef.current = Math.random()
            console.log('随机值已更新:', randomValueRef.current)
          }}
          style={{ padding: '8px 16px' }}
        >
          更新随机值 (查看控制台)
        </button>
        <p>注意: 随机值已更新，但组件不会重新渲染</p>
      </div>
    </div>
  )
}

export default UseRefExample
