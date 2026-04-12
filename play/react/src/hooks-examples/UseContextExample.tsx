import { createContext, useContext, useState } from 'react'

/**
 * useContext Hook 示例
 *
 * useContext 用于在组件树中共享状态，避免 props drilling
 *
 * 步骤：
 * 1. 创建 Context: const MyContext = createContext(initialValue);
 * 2. 提供 Context: <MyContext.Provider value={value}>
 * 3. 消费 Context: const value = useContext(MyContext);
 *
 * 应用场景：
 * 1. 主题切换
 * 2. 用户认证状态
 * 3. 全局配置
 */

// 1. 创建主题 Context
const ThemeContext = createContext<'light' | 'dark'>('light')

// 2. 创建用户 Context
const UserContext = createContext<{ name: string; age: number } | null>(null)

// 子组件：使用主题
function ThemedButton() {
  const theme = useContext(ThemeContext)

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: theme === 'light' ? '#3498db' : '#2c3e50',
    color: theme === 'light' ? '#fff' : '#ecf0f1',
    cursor: 'pointer'
  }

  return <button style={buttonStyle}>主题按钮</button>
}

// 子组件：使用用户信息
function UserProfile() {
  const user = useContext(UserContext)

  if (!user) {
    return <p>没有可用的用户信息</p>
  }

  return (
    <div>
      <p>姓名: {user.name}</p>
      <p>年龄: {user.age}</p>
    </div>
  )
}

// 孙子组件：同时使用多个 Context
function DeepComponent() {
  const theme = useContext(ThemeContext)
  const user = useContext(UserContext)

  const containerStyle = {
    padding: '15px',
    borderRadius: '4px',
    backgroundColor: theme === 'light' ? '#f8f9fa' : '#34495e',
    color: theme === 'light' ? '#333' : '#ecf0f1',
    marginTop: '10px'
  }

  return (
    <div style={containerStyle}>
      <h4>深层组件</h4>
      <p>主题: {theme}</p>
      {user && <p>用户: {user.name}</p>}
    </div>
  )
}

function UseContextExample() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [user, setUser] = useState<{ name: string; age: number }>({
    name: '张三',
    age: 30
  })

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px 0' }}>
      <h2>useContext 示例</h2>

      {/* 3. 提供 Context */}
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={user}>
          <div style={{ marginBottom: '20px' }}>
            <h3>主题切换</h3>
            <p>当前主题: {theme}</p>
            <button onClick={toggleTheme}>切换主题</button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>用户信息</h3>
            <UserProfile />
            <button onClick={() => setUser({ name: `李四-${Date.now()}`, age: 25 })}>
              切换用户
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3>主题组件</h3>
            <ThemedButton />
          </div>

          <div>
            <h3>嵌套组件</h3>
            <div style={{ padding: '10px', border: '1px solid #ccc' }}>
              <p>父组件</p>
              <DeepComponent />
            </div>
          </div>
        </UserContext.Provider>
      </ThemeContext.Provider>
    </div>
  )
}

export default UseContextExample
