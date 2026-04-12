import { computed, defineComponent, h, provide, shallowRef, watch } from 'vue'
import { Schema } from '@cjx-low-code/json-schema'
import { Fragment } from '../shared/fragment'
import { useSchemaMarkup } from '../hooks'
import { SchemaMarkupSymbol, SchemaOptionsSymbol } from '../shared/context'
import _h from '../shared/h'
import RecursionField from './RecursionField'
import type { DefineComponent, PropType, VNode } from 'vue'
import type {
  ComponentClass,
  ComponentKeys,
  FlattenedComponents,
  ISchemaMarkupFieldProps,
  SchemaFieldConfig,
  SchemaFieldProps,
  VueComponentPath
} from '../types'
import type { ISchema } from '@cjx-low-code/json-schema'

const markupProps = {
  version: String,
  name: String,
  title: String,
  description: String,
  default: {},
  readOnly: {
    type: Boolean,
    default: undefined
  },
  writeOnly: {
    type: Boolean,
    default: undefined
  },
  enum: {},
  multipleOf: Number,
  maximum: Number,
  exclusiveMaximum: Number,
  minimum: Number,
  exclusiveMinimum: Number,
  maxLength: Number,
  minLength: Number,
  maxItems: Number,
  minItems: Number,
  required: {
    type: [Boolean, Array, String],
    default: undefined
  },
  format: String,
  items: {},
  display: {},
  validator: {},
  decorator: {},
  decoratorProps: {},
  component: {},
  componentProps: {},
  reactions: {},
  // content: {},
  visible: {
    type: Boolean,
    default: undefined
  },
  hidden: {
    type: Boolean,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  editable: {
    type: Boolean,
    default: undefined
  },
  readPretty: {
    type: Boolean,
    default: undefined
  }
}

// 显式定义 createTypedSchemaField 的返回类型，避免 TS2742
type TypedSchemaField<K extends SchemaFieldProps['component']> = <
  P extends ComponentKeys<K> | ComponentClass,
  D extends ComponentKeys<K> | ComponentClass
>(
  props: SchemaFieldConfig<K, P, D>,
  ctx: { slots: any }
) => any

// 显式定义 createSchemaField 的返回类型，避免 TS2742 推断类型错误
type CreateSchemaFieldReturn<K extends SchemaFieldProps['component']> = {
  SchemaField: DefineComponent<{
    schema: ISchema[]
    components: K
    name?: string | number
  }> & {
    [P in ComponentKeys<K>]: FlattenedComponents<K>[P] extends ComponentClass
      ? VueComponentPath<FlattenedComponents<K>[P], FlattenedComponents<K>>
      : never
  }
  StringSchemaField: TypedSchemaField<K>
  NumberSchemaField: TypedSchemaField<K>
  BooleanSchemaField: TypedSchemaField<K>
  ObjectSchemaField: TypedSchemaField<K>
  ArraySchemaField: TypedSchemaField<K>
  VoidSchemaField: TypedSchemaField<K>
  DataSchemaField: TypedSchemaField<K>
}

export const createSchemaField = <T extends SchemaFieldProps, K extends T['component']>(options: {
  components: K extends {
    [K: Capitalize<string>]: abstract new (...args: unknown[]) => any
  }
    ? { [K: Capitalize<string>]: abstract new (...args: unknown[]) => any }
    : K
}): CreateSchemaFieldReturn<K> => {
  const SchemaField = defineComponent({
    name: 'SchemaField',
    props: {
      schema: {
        type: Array as PropType<ISchema[]>,
        default: () => []
      },
      components: {
        type: Object as PropType<K>,
        default: () => ({})
      },
      name: [String, Number]
    },
    setup(props, { slots }) {
      const schemaRef = computed(() =>
        Schema.isSchemaInstance(props.schema) ? props.schema : new Schema(props.schema)
      )

      provide(SchemaMarkupSymbol, schemaRef)
      provide(
        SchemaOptionsSymbol,
        computed(() => ({
          components: {
            ...options.components,
            ...props.components
          }
        }))
      )
      return () => {
        const children: VNode[] = []
        if (slots.default) {
          children.push(
            _h(
              'template',
              {},
              {
                default: () => slots.default!()
              }
            )
          )
        }
        children.push(
          _h(
            RecursionField,
            {
              attrs: {
                ...props,
                schema: schemaRef.value
              }
            },
            {}
          )
        )
        return _h(Fragment, {}, { default: () => children })
      }
    }
  })

  const MarkupField = {
    name: 'MarkupField',
    props: {
      type: String,
      ...markupProps
    },
    setup(props: ISchemaMarkupFieldProps, { slots }) {
      const parentRef = useSchemaMarkup()
      if (!parentRef || !parentRef.value) return () => h('template', {}, {})

      const schemaRef = shallowRef()

      watch(
        parentRef,
        () => {
          console.log(parentRef.value)
          schemaRef.value = parentRef.value?.addSchema({ ...props, slots })
        },
        { immediate: true }
      )
      provide(SchemaMarkupSymbol, schemaRef)

      return () => {
        return h('div', { style: 'display: none;' }, slots)
      }
    }
  }

  for (const key in options.components) {
    ;(SchemaField as any)[key] = (props, { slots }) => {
      return _h(
        MarkupField,
        {
          attrs: {
            ...props,
            component: key
          }
        },
        slots
      )
    }
  }

  const createTypedSchemaField = <Type extends string>(type: Type) => {
    return <
      P extends ComponentKeys<K> | ComponentClass,
      D extends ComponentKeys<K> | ComponentClass
    >(
      props: SchemaFieldConfig<K, P, D>,
      ctx: { slots: any }
    ) => {
      return _h(
        MarkupField,
        {
          attrs: {
            ...props,
            type
          },
          slots: ctx.slots
        },
        ctx.slots
      )
    }
  }

  const StringSchemaField = createTypedSchemaField('string')
  const NumberSchemaField = createTypedSchemaField('number')
  const BooleanSchemaField = createTypedSchemaField('boolean')
  const ObjectSchemaField = createTypedSchemaField('object')
  const ArraySchemaField = createTypedSchemaField('array')
  const VoidSchemaField = createTypedSchemaField('void')
  const DataSchemaField = createTypedSchemaField('data')

  return {
    SchemaField: SchemaField as unknown as DefineComponent<{
      schema: ISchema[]
      components: K
      name?: string | number
    }> & {
      [P in ComponentKeys<K>]: FlattenedComponents<K>[P] extends ComponentClass
        ? VueComponentPath<FlattenedComponents<K>[P], FlattenedComponents<K>>
        : never
    },
    StringSchemaField,
    NumberSchemaField,
    BooleanSchemaField,
    ObjectSchemaField,
    ArraySchemaField,
    VoidSchemaField,
    DataSchemaField
  }
}
