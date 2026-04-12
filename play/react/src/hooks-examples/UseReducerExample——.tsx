import React, { useReducer } from 'react'

/**
 * useReducer Hook 示例
 *
 * useReducer 用于管理复杂的状态逻辑，类似于 Redux 的 reducer 模式
 *
 * 语法：const [state, dispatch] = useReducer(reducer, initialState);
 *
 * 应用场景：
 * 1. 复杂的状态逻辑
 * 2. 多个状态之间相互关联
 * 3. 状态更新依赖于之前的状态
 *
 * 优势：
 * - 集中管理状态逻辑
 * - 更易于测试
 * - 更好的代码组织
 */

// 1. 定义状态类型
interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
}

// 2. 定义 Action 类型
type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' }

// 3. 定义初始状态
const initialState: TodoState = {
  todos: [
    { id: 1, text: '学习 React', completed: false },
    { id: 2, text: '掌握 Hooks', completed: true },
    { id: 3, text: '构建项目', completed: false }
  ],
  filter: 'all'
}

// 4. 定义 reducer 函数
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: action.payload,
            completed: false
          }
        ]
      }

    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        )
      }

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload)
      }

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload
      }

    default:
      return state
  }
}

function UseReducerExample() {
  // 5. 使用 useReducer
  const [state, dispatch] = useReducer(todoReducer, initialState)

  // 根据 filter 过滤 todos
  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === 'active') return !todo.completed
    if (state.filter === 'completed') return todo.completed
    return true
  })

  // 处理添加 todo
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    const input = e.target as HTMLFormElement
    const text = input.elements.namedItem('todo') as HTMLInputElement

    if (text.value.trim()) {
      dispatch({ type: 'ADD_TODO', payload: text.value.trim() })
      text.value = ''
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px 0' }}>
      <h2>useReducer 示例</h2>

      {/* 添加 todo 表单 */}
      <form onSubmit={handleAddTodo} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          name="todo"
          placeholder="添加新任务"
          style={{ padding: '8px', width: '200px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', marginLeft: '10px' }}>
          添加任务
        </button>
      </form>

      {/* Todo 列表 */}
      <div style={{ marginBottom: '20px' }}>
        <h3>任务列表</h3>
        <ul>
          {filteredTodos.map((todo) => (
            <li key={todo.id} style={{ margin: '5px 0' }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
              />
              <span
                style={{
                  marginLeft: '10px',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  opacity: todo.completed ? 0.6 : 1
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                style={{
                  marginLeft: '10px',
                  padding: '2px 8px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                删除
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 过滤器 */}
      <div>
        <h3>过滤器</h3>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
          style={{
            margin: '0 5px',
            padding: '5px 10px',
            backgroundColor: state.filter === 'all' ? '#3498db' : '#ecf0f1',
            color: state.filter === 'all' ? 'white' : '#333',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          全部
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'active' })}
          style={{
            margin: '0 5px',
            padding: '5px 10px',
            backgroundColor: state.filter === 'active' ? '#3498db' : '#ecf0f1',
            color: state.filter === 'active' ? 'white' : '#333',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          未完成
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}
          style={{
            margin: '0 5px',
            padding: '5px 10px',
            backgroundColor: state.filter === 'completed' ? '#3498db' : '#ecf0f1',
            color: state.filter === 'completed' ? 'white' : '#333',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          已完成
        </button>
      </div>
    </div>
  )
}

export default UseReducerExample
