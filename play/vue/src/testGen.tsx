import { defineComponent, h } from 'vue'
import type { DefineSetupFnComponent } from 'vue'

type ObjMap = {
  input: {
    componentProps: {
      /**
       * 测试
       */
      placeholder: string
    }
  }
  select: {
    componentProps: {
      options: string[]
    }
  }
}

class Helper<Props> {
  Return = defineComponent((() => ({})) as <T = keyof Props>(props: {
    component: T
    componentProps?: T extends keyof Props ? Props[T] : never
  }) => any)
}

type ComponentMap = {
  input: { componentProps: { placeholder: string } }
  select: { componentProps: { options: string[] } }
}

type TypeMap = {
  text: { typeProps: { maxLength: number } }
  number: { typeProps: { min: number; max: number } }
}

export const MyComponent = defineComponent(
  <T extends keyof ComponentMap, K extends keyof TypeMap>(props: {
    component?: T
    componentProps?: ComponentMap[T]['componentProps']
    type?: K
    typeProps?: TypeMap[K]['typeProps']
  }) => {
    return () => h('div')
  }
)

type TestOptions = {
  components: Record<string, any>
}

export function createTest<T extends TestOptions, Components = T['components']>(options: T) {
  const Test = defineComponent(
    <T extends keyof Components, K extends keyof TypeMap>(props: {
      component: T
      componentProps?: Components[T]
      type: K
      typeProps?: TypeMap[K]['typeProps']
    }) => {
      return () => h('div')
    }
  )
  return Test
}

export const Df = <T extends 'number' | 'string'>(props: { type: T }) => {
  return <div>hello</div>
}
