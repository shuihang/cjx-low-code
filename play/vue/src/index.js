let activeEffect = null
// 副作用函数栈
const effectStack = []
// 依赖桶
const buckets = new WeakMap()

const ITERATE_KEY = Symbol('')

const track = (target, key) => {
  // 如果没有注册的副作用函数，直接返回结果
  if (!activeEffect) {
    return
  }
  // 1. 根据target从依赖桶中获取对应的依赖项Map，保持的类型是key----effects的键值对
  let depsMap = buckets.get(target)
  if (!depsMap) {
    // 如果没有对应的依赖项Map，侧初始化一个depsMap
    buckets.set(target, (depsMap = new Map()))
  }

  // 2. 根据key从depsMap中获取对应的依赖项Set，保持的类型是effect的集合
  let deps = depsMap.get(key)
  if (!deps) {
    // 初始化依赖集合
    depsMap.set(key, (deps = new Set()))
  }

  // 3. 添加当前副作用函数到依赖集合
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
  // console.log(`依赖收集track ${String(key)}`)
}

const trigger = (target, key) => {
  const depsMap = buckets.get(target)
  // 如果没有对应的依赖项Map，直接返回结果
  if (!depsMap) {
    return
  }
  // 2. 根据key从depsMap中获取对应的依赖项Set，保持的类型是effect的集合
  const deps = depsMap.get(key)

  // 避免死循环
  const effectToRun = new Set()

  deps &&
    deps.forEach((effect) => {
      if (effect !== activeEffect) {
        // 如果当前副作用函数不是activeEffect，才添加到effectToRun中
        // 避免死循环
        effectToRun.add(effect)
      }
    })

  // 取得与ITERATE_KEY相关的依赖集合
  const iterateDeps = depsMap.get(ITERATE_KEY)

  iterateDeps &&
    iterateDeps.forEach((effect) => {
      if (effect !== activeEffect) {
        effectToRun.add(effect)
      }
    })

  // console.log('effectToRun', effectToRun)
  // 3. 触发依赖集合中的所有副作用函数
  effectToRun.forEach((effect) => {
    if (effect.options?.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  })
  // console.log(`依赖触发trigger ${String(key)}`)
}

const handler = {
  get(target, key, receiver) {
    const result = Reflect.get(target, key, receiver)
    track(target, key)
    return result
  },
  set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    trigger(target, key)
    return result
  },
  ownKeys(target) {
    // console.log('----ownKeys----')
    track(target, ITERATE_KEY)
    return Reflect.ownKeys(target)
  }
}

const obj = {
  age: 18,
  name: 'cjx',
  flag: true
  // sex: 'male',
  // address: 'beijing'
}

const proxy = new Proxy(obj, handler)

function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    // 压栈
    effectStack.push(effectFn)
    fn()
    // 弹栈
    effectStack.pop()
    // 更新activeEffect
    // 如果栈为空，说明当前副作用函数是最后一个执行的，将activeEffect设置为null
    activeEffect = effectStack[effectStack.length - 1] || null
  }
  effectFn.deps = []
  effectFn.options = options
  effectFn()
}

function cleanup(effect) {
  const { deps } = effect

  if (!deps.length) {
    return
  }
  for (const dep of deps) {
    dep.delete(effect)
  }
  deps.length = 0
}

let isFlushing = false
// 微任务队列 new Set可以避免重复添加任务
const jobQueue = new Set()
const p = Promise.resolve()
// 利用Promise.resolve()实现微任务队列的执行 优化重复执行
function flushJob() {
  if (isFlushing) {
    // 如果isFlushing为true，说明当前正在执行微任务队列中的任务，直接返回
    return
  }

  isFlushing = true

  // 1. 执行微任务队列中的所有任务
  p.then(() => {
    jobQueue.forEach((job) => job())
  }).finally(() => {
    // 2. 微任务队列执行完成后，将isFlushing设置为false，等待下一次执行
    isFlushing = false
  })
}

const age = document.querySelector('.age')
const sex = document.querySelector('.sex')
const name = document.querySelector('.name')

const sexBtn = document.querySelector('.sex-btn')
const nameBtn = document.querySelector('.name-btn')
const bucketsBtn = document.querySelector('.buckets')

bucketsBtn.addEventListener('click', () => {
  console.log('buckets', buckets)
})

// effect(() => {
//   name.textContent = proxy.flag ? proxy.name : proxy.age
//   if (proxy.flag) {
//     sex.textContent = proxy.sex
//   }
// })

// effect(() => {
//   console.log('effect 外层')
//   effect(() => {
//     console.log('effect 内层')
//     sex.textContent = proxy.sex
//   })
//   name.textContent = proxy.name
// })

// effect(() => {
//   proxy.age = proxy.age + 1
// })

// effect(() => {
//   console.log('effect 迭代')
//   for (const key in proxy) {
//     console.log(key)
//   }
// })
// proxy.test = 'test'

// effect(() => {
//   age.textContent = proxy.age
//   console.log('age', proxy.age)
// })

// proxy.age++

effect(
  () => {
    age.textContent = proxy.age
    console.log(proxy.age)
  },
  {
    scheduler: (effect) => {
      jobQueue.add(effect)
      flushJob(effect)
    }
  }
)
proxy.age++
proxy.age++
proxy.age++
proxy.age++
proxy.age++
proxy.age++
console.log(jobQueue.size)
console.log('结束了')

sexBtn.addEventListener('click', () => {
  proxy.sex = `${proxy.sex}-${Date.now()}`
})

nameBtn.addEventListener('click', () => {
  proxy.name = `cjx-new${Date.now()}`
})

const flagBtn = document.querySelector('.flag-btn')

flagBtn.addEventListener('click', () => {
  proxy.flag = !proxy.flag
})
