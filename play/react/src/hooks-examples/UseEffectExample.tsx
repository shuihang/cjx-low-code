import { useEffect, useState } from 'react'

/**
 * useEffect Hook 示例
 *
 * useEffect 用于处理组件的副作用，如：
 * 1. 数据获取
 * 2. 订阅
 * 3. 手动修改 DOM
 * 4. 清理操作
 *
 * 语法：useEffect(() => {
 *   // 副作用代码
 *   return () => {
 *     // 清理代码
 *   };
 * }, [dependencies]);
 *
 * 依赖数组：
 * - 空数组 []: 只在组件挂载时执行一次
 * - 包含值: 当依赖值变化时执行
 * - 无依赖: 每次渲染都执行
 */

function UseEffectExample() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState<{ id: number; title: string }[]>([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // 1. 基本用法：每次 count 变化时执行
  useEffect(() => {
    document.title = `你点击了 ${count} 次`
  }, [count])

  // 2. 数据获取：组件挂载时执行一次
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('获取数据错误:', error)
      }
    }

    fetchData()
  }, []) // 空依赖数组，只执行一次

  // 3. 订阅和清理：监听网络状态
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
    }

    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 清理函数：组件卸载时执行
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, []) // 空依赖数组

  // 4. 定时器示例
  useEffect(() => {
    const timer = setInterval(() => {
      // console.log('定时器 tick:', new Date().toLocaleTimeString())
    }, 1000)

    // 清理定时器
    return () => clearInterval(timer)
  }, [])

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px 0' }}>
      <h2>useEffect 示例</h2>

      {/* 文档标题更新示例 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>文档标题更新</h3>
        <p>你点击了 {count} 次</p>
        <button onClick={() => setCount((prev) => prev + 1)}>点击我</button>
      </div>

      {/* 数据获取示例 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>数据获取</h3>
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      </div>

      {/* 网络状态示例 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>网络状态</h3>
        <p>你当前处于 {isOnline ? '在线' : '离线'} 状态</p>
      </div>

      {/* 定时器示例 */}
      <div>
        <h3>定时器示例</h3>
        <p>查看控制台，每秒会有定时器 tick 输出</p>
      </div>
    </div>
  )
}

export default UseEffectExample
