import { useCallback, useEffect, useState } from 'react'

/**
 * 自定义 Hook 示例
 *
 * 自定义 Hook 是一种重用状态逻辑的方式，它允许你在多个组件之间共享逻辑
 *
 * 命名规则：自定义 Hook 必须以 "use" 开头
 *
 * 应用场景：
 * 1. 表单处理
 * 2. 数据获取
 * 3. 订阅管理
 * 4. 动画逻辑
 * 5. 任何需要在多个组件中重用的逻辑
 */

// 1. 自定义 Hook: useLocalStorage - 用于在 localStorage 中存储和获取数据
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // 从 localStorage 中获取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('Error reading localStorage:', error)
      return initialValue
    }
  })

  // 更新 localStorage 和状态
  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value)
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error('Error writing to localStorage:', error)
      }
    },
    [key]
  )

  return [storedValue, setValue]
}

// 2. 自定义 Hook: useCounter - 用于计数器逻辑
function useCounter(initialValue = 0, step = 1) {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => {
    setCount((prev) => prev + step)
  }, [step])

  const decrement = useCallback(() => {
    setCount((prev) => prev - step)
  }, [step])

  const reset = useCallback(() => {
    setCount(initialValue)
  }, [initialValue])

  return { count, increment, decrement, reset }
}

// 3. 自定义 Hook: useFetch - 用于数据获取
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // 清理函数
    return () => {
      isMounted = false
    }
  }, [url])

  return { data, loading, error }
}

// 主组件
function CustomHooksExample() {
  // 使用 useLocalStorage
  const [name, setName] = useLocalStorage<string>('name', '张三')

  // 使用 useCounter
  const { count, increment, decrement, reset } = useCounter(0, 1)

  // 使用 useFetch
  interface Todo {
    id: number
    title: string
    completed: boolean
  }
  const {
    data: todos,
    loading,
    error
  } = useFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=5')

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px 0' }}>
      <h2>自定义 Hooks 示例</h2>

      {/* 使用 useLocalStorage */}
      <div style={{ marginBottom: '20px' }}>
        <h3>useLocalStorage</h3>
        <p>姓名: {name}</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="输入你的姓名"
          style={{ padding: '8px', width: '200px' }}
        />
        <p>注意: 姓名存储在 localStorage 中，页面刷新后依然保持</p>
      </div>

      {/* 使用 useCounter */}
      <div style={{ marginBottom: '20px' }}>
        <h3>useCounter</h3>
        <p>计数: {count}</p>
        <button onClick={increment} style={{ margin: '0 5px', padding: '8px 16px' }}>
          增加
        </button>
        <button onClick={decrement} style={{ margin: '0 5px', padding: '8px 16px' }}>
          减少
        </button>
        <button onClick={reset} style={{ margin: '0 5px', padding: '8px 16px' }}>
          重置
        </button>
      </div>

      {/* 使用 useFetch */}
      <div>
        <h3>useFetch</h3>
        {loading && <p>加载中...</p>}
        {error && <p>错误: {error.message}</p>}
        {todos && (
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {todo.title} - {todo.completed ? '已完成' : '未完成'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default CustomHooksExample
