import type { AllowedComponentProps, ComponentCustomProps, VNodeProps } from 'vue'

export type EmitsAddArgs<
  T extends object,
  ArgsGroups extends readonly unknown[][] = [],
  Position extends 'start' | 'end' = 'start'
> = {
  [K in keyof T]-?: T[K] extends ((...args: infer Args) => infer Return) | undefined
    ? Args extends []
      ? (...args: [...ArgsGroups[number]]) => Return
      : Position extends 'start'
      ? (...args: [...ArgsGroups[number], ...Args]) => Return
      : (...args: [...Args, ...ArgsGroups[number]]) => Return
    : T[K]
}

export type IsEmptyToNeverObj<T> = T extends object
  ? keyof T extends never
    ? { [key in string]: never }
    : T
  : never

type RemoveFunctions<T> = {
  [K in keyof T as T[K] extends ((...args: any[]) => any) | undefined ? never : K]-?: T[K]
}

type PropsAndEmits<T> = Omit<T, keyof (VNodeProps & AllowedComponentProps & ComponentCustomProps)>

export type ExtractComponentProps<T> = RemoveFunctions<PropsAndEmits<T>>

export type ExtractComponentsEmits<
  T,
  ArgsGroups extends readonly unknown[][] = [],
  Position extends 'start' | 'end' = 'start'
> = IsEmptyToNeverObj<
  EmitsAddArgs<Omit<PropsAndEmits<T>, keyof ExtractComponentProps<T>>, ArgsGroups, Position>
>
