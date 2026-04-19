import { computed, defineComponent, h, provide, shallowRef, watch } from 'vue'
import type {} from '@vue/shared'
import { Schema } from '@cjx-low-code/json-schema'
import { Fragment } from '../shared/fragment'
import { useSchemaMarkup } from '../hooks'
import { SchemaMarkupSymbol, SchemaOptionsSymbol } from '../shared/context'
import _h from '../shared/h'
import RecursionField from './RecursionField'
import type {
  ComponentClass,
  ComponentPathToVueComponentPath,
  ComponentPropsMapValue,
  ComponentSlotsMapValue,
  ISchemaMarkupFieldProps,
  SchemaFieldOptions,
  SchemaType,
  SchemaVueComponents,
  VueComponent,
  VueComponentPath
} from '../types'
import type { CreateComponentPublicInstanceWithMixins, PropType, VNode } from 'vue'
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
  slots: {},
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

function transformComponent<T extends VueComponent>(component: T, type: SchemaTypes): T {
  return {
    ...component,
    setup(props, { slots }) {
      return () => _h(component, { attrs: { ...props, type } }, slots)
    }
  }
}

export function _createSchemaField<
  ComponentPropsMap extends Record<string, any>,
  ComponentSlotsMap extends Record<string, any>,
  Components extends SchemaVueComponents
>(options: SchemaFieldOptions<Components>) {
  const SchemaField = defineComponent({
    name: 'SchemaField',
    props: {
      schema: {
        type: Array as PropType<ISchema[]>,
        default: () => []
      },
      components: {
        type: Object as PropType<any>,
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

  const MarkupField = defineComponent({
    name: 'MarkupField',
    props: {
      type: String,
      ...markupProps
    },
    setup(props, { slots }) {
      const parentRef = useSchemaMarkup()
      if (!parentRef || !parentRef.value) return () => h('template', {}, {})

      const schemaRef = shallowRef()

      watch(
        parentRef,
        () => {
          // console.log(parentRef.value)
          schemaRef.value = parentRef.value?.addSchema({
            ...props
          })
        },
        { immediate: true }
      )
      provide(SchemaMarkupSymbol, schemaRef)

      return () => {
        return h('div', { style: 'display: none;' }, slots)
      }
    }
    // 通过泛型配合vue3的CreateComponentPublicInstanceWithMixins类型 来实现泛型组件 vue3目前的泛型组件太弱
  }) as new <
    Decorator extends keyof ComponentPropsMap | ComponentClass,
    Component extends keyof ComponentPropsMap | ComponentClass
  >(
    props: ISchemaMarkupFieldProps<Decorator, Component, ComponentPropsMap, ComponentSlotsMap>
  ) => CreateComponentPublicInstanceWithMixins<
    ISchemaMarkupFieldProps<Decorator, Component, ComponentPropsMap, ComponentSlotsMap>
  >

  const createTypedSchemaField = (type?: SchemaTypes) => {
    return transformComponent(MarkupField, type)
    // return <
    //   Component extends keyof ComponentPropsMap | ComponentClass,
    //   Decorator extends keyof ComponentPropsMap | ComponentClass
    // >(
    //   props: ISchemaMarkupFieldProps<Decorator, Component, ComponentPropsMap, ComponentSlotsMap>,
    //   ctx: { slots: any }
    // ) => {
    //   const attrs = type
    //     ? {
    //         ...props,
    //         type
    //       }
    //     : props
    //   return _h(
    //     MarkupField,
    //     {
    //       attrs,
    //       slots: ctx.slots
    //     },
    //     ctx.slots
    //   )
    // }
  }

  const SchemaFieldMarkup = createTypedSchemaField()
  const SchemaFieldString = createTypedSchemaField('string')
  const SchemaFieldNumber = createTypedSchemaField('number')
  const SchemaFieldBoolean = createTypedSchemaField('boolean')
  const SchemaFieldObject = createTypedSchemaField('object')
  const SchemaFieldArray = createTypedSchemaField('array')
  const SchemaFieldVoid = createTypedSchemaField('void')
  const SchemaFieldDate = createTypedSchemaField('date')
  const SchemaFieldDateTime = createTypedSchemaField('datetime')

  SchemaField.Markup = SchemaFieldMarkup
  SchemaField.String = SchemaFieldString
  SchemaField.Number = SchemaFieldNumber
  SchemaField.Boolean = SchemaFieldBoolean
  SchemaField.Object = SchemaFieldObject
  SchemaField.Array = SchemaFieldArray
  SchemaField.Void = SchemaFieldVoid
  SchemaField.Date = SchemaFieldDate
  SchemaField.DateTime = SchemaFieldDateTime

  function defineSchema<Component extends keyof ComponentPropsMap>(
    schemas: SchemaType<{
      [P in Component]: ComponentPathToVueComponentPath<Components, P & string>
    }>[]
  ) {
    return schemas
  }

  return {
    defineSchema,
    SchemaFieldMarkup,
    SchemaFieldString,
    SchemaFieldNumber,
    SchemaFieldBoolean,
    SchemaFieldObject,
    SchemaFieldArray,
    SchemaFieldVoid,
    SchemaFieldDate,
    SchemaFieldDateTime,
    SchemaField: SchemaField as typeof SchemaField & {
      Markup: typeof SchemaFieldMarkup
      String: typeof SchemaFieldString
      Number: typeof SchemaFieldNumber
      Boolean: typeof SchemaFieldBoolean
      Object: typeof SchemaFieldObject
      Array: typeof SchemaFieldArray
      Void: typeof SchemaFieldVoid
      Date: typeof SchemaFieldDate
      DateTime: typeof SchemaFieldDateTime
    }
  }
}

export function createSchemaField<Components extends SchemaVueComponents>(
  options: SchemaFieldOptions<Components>
) {
  type ComponentPropsMap = {
    [P in VueComponentPath<Components>]: ComponentPropsMapValue<Components, P>
  }

  type ComponentSlotsMap = {
    [P in VueComponentPath<Components>]: ComponentSlotsMapValue<Components, P>
  }
  return _createSchemaField<ComponentPropsMap, ComponentSlotsMap, Components>(options)
}
