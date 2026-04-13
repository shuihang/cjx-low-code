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
  FieldVueComponents,
  FlattenedComponents,
  ISchemaMarkupFieldProps,
  SchemaFieldOptions,
  SchemaVueComponents,
  ShallowFlattenLevel,
  VueComponentPath
} from '../types'
import type { ISchema, SchemaTypes } from '@cjx-low-code/json-schema'

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

type TypedSchemaField<_Type, Components extends SchemaVueComponents> = <
  Component extends FieldVueComponents<Components>,
  Decorator extends FieldVueComponents<Components>
>(
  props: ISchemaMarkupFieldProps<Components, Decorator, Component>,
  ctx: { slots: any }
) => any

// 显式定义 createSchemaField 的返回类型，避免 TS2742 推断类型错误
type CreateSchemaFieldReturn<
  Components extends SchemaVueComponents,
  Type = keyof (Components & ShallowFlattenLevel<Components>)
> = {
  SchemaField: DefineComponent<{
    schema?: ISchema[]
    components?: Components
    name?: string | number
  }> & {
    Markup: TypedSchemaField<Type, Components>
    String: TypedSchemaField<Type, Components>
    Number: TypedSchemaField<Type, Components>
    Boolean: TypedSchemaField<Type, Components>
    Object: TypedSchemaField<Type, Components>
    Array: TypedSchemaField<Type, Components>
    Void: TypedSchemaField<Type, Components>
    Date: TypedSchemaField<Type, Components>
    DateTime: TypedSchemaField<Type, Components>
    $$types: {
      [P in ComponentKeys<Components>]: FlattenedComponents<Components>[P] extends ComponentClass
        ? VueComponentPath<FlattenedComponents<Components>[P], FlattenedComponents<Components>>
        : never
    }
  }
  MarkupSchemaField: TypedSchemaField<Type, Components>
  StringSchemaField: TypedSchemaField<Type, Components>
  NumberSchemaField: TypedSchemaField<Type, Components>
  BooleanSchemaField: TypedSchemaField<Type, Components>
  ObjectSchemaField: TypedSchemaField<Type, Components>
  ArraySchemaField: TypedSchemaField<Type, Components>
  VoidSchemaField: TypedSchemaField<Type, Components>
  DateSchemaField: TypedSchemaField<Type, Components>
  DateTimeSchemaField: TypedSchemaField<Type, Components>
}

export const createSchemaField = <
  T extends SchemaFieldOptions,
  Components extends T['component']
>(options: {
  components: Components extends {
    [K: Capitalize<string>]: abstract new (...args: unknown[]) => any
  }
    ? { [K: Capitalize<string>]: abstract new (...args: unknown[]) => any }
    : Components
}): CreateSchemaFieldReturn<Components> => {
  const SchemaField = defineComponent({
    name: 'SchemaField',
    props: {
      schema: {
        type: Array as PropType<ISchema[]>,
        default: () => []
      },
      components: {
        type: Object as PropType<Components>,
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
    setup(props: ISchemaMarkupFieldProps<any, any, any>, { slots }) {
      const parentRef = useSchemaMarkup()
      if (!parentRef || !parentRef.value) return () => h('template', {}, {})

      const schemaRef = shallowRef()

      watch(
        parentRef,
        () => {
          // console.log(parentRef.value)
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

  const createTypedSchemaField = <Type extends SchemaTypes>(type?: Type) => {
    return <
      Component extends ComponentKeys<Components> | ComponentClass,
      Decorator extends ComponentKeys<Components> | ComponentClass
    >(
      props: ISchemaMarkupFieldProps<Components, Decorator, Component>,
      ctx: { slots: any }
    ) => {
      const attrs = type
        ? {
            ...props,
            type
          }
        : props
      return _h(
        MarkupField,
        {
          attrs,
          slots: ctx.slots
        },
        ctx.slots
      )
    }
  }

  const MarkupSchemaField = createTypedSchemaField()
  const StringSchemaField = createTypedSchemaField('string')
  const NumberSchemaField = createTypedSchemaField('number')
  const BooleanSchemaField = createTypedSchemaField('boolean')
  const ObjectSchemaField = createTypedSchemaField('object')
  const ArraySchemaField = createTypedSchemaField('array')
  const VoidSchemaField = createTypedSchemaField('void')
  const DateSchemaField = createTypedSchemaField('date')
  const DateTimeSchemaField = createTypedSchemaField('datetime')

  SchemaField.Markup = MarkupSchemaField
  SchemaField.String = StringSchemaField
  SchemaField.Number = NumberSchemaField
  SchemaField.Boolean = BooleanSchemaField
  SchemaField.Object = ObjectSchemaField
  SchemaField.Array = ArraySchemaField
  SchemaField.Void = VoidSchemaField
  SchemaField.Date = DateSchemaField
  SchemaField.DateTime = DateTimeSchemaField

  return {
    SchemaField: SchemaField as unknown as CreateSchemaFieldReturn<Components>['SchemaField'],
    MarkupSchemaField,
    StringSchemaField,
    NumberSchemaField,
    BooleanSchemaField,
    ObjectSchemaField,
    ArraySchemaField,
    VoidSchemaField,
    DateSchemaField,
    DateTimeSchemaField
  }
}
