import { useState } from 'react'

/**
 * useState Hook 示例
 *
 * useState 是最基本的 Hook，用于在函数组件中添加状态管理
 *
 * 语法：const [state, setState] = useState(initialState);
 *
 * 应用场景：
 * 1. 管理组件的内部状态
 * 2. 处理用户输入
 * 3. 跟踪 UI 状态（如开关、计数器等）
 */

function UseStateExample() {
  // 1. 基本用法：计数器
  const [count, setCount] = useState(0)

  // 2. 管理对象状态
  const [user, setUser] = useState({
    name: '张三',
    age: 30
  })

  // 3. 管理数组状态
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React', completed: false },
    { id: 2, text: '构建项目', completed: false }
  ])

  // 更新对象状态的正确方式
  const updateUser = () => {
    setUser((prevUser) => ({
      ...prevUser,
      age: prevUser.age + 1
    }))
  }

  // 更新数组状态的正确方式
  const addTodo = () => {
    setTodos((prevTodos) => [
      ...prevTodos,
      {
        id: Date.now(),
        text: `新任务 ${prevTodos.length + 1}`,
        completed: false
      }
    ])
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px 0' }}>
      <h2>useState 示例</h2>

      {/* 计数器示例 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>计数器</h3>
        <p>计数: {count}</p>
        <button onClick={() => setCount((prev) => prev + 1)}>增加</button>
        <button onClick={() => setCount((prev) => prev - 1)}>减少</button>
        <button onClick={() => setCount(0)}>重置</button>
      </div>

      {/* 对象状态示例 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>用户信息</h3>
        <p>姓名: {user.name}</p>
        <p>年龄: {user.age}</p>
        <button onClick={updateUser}>增加年龄</button>
      </div>

      {/* 数组状态示例 */}
      <div>
        <h3>任务列表</h3>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {todo.text} - {todo.completed ? '已完成' : '未完成'}
            </li>
          ))}
        </ul>
        <button onClick={addTodo}>添加任务</button>
      </div>
    </div>
  )
}

export default UseStateExample
