import { computed, defineComponent, markRaw, provide, shallowRef, watch } from 'vue'
import { Schema } from '@cjx-low-code/json-schema'
import { isFunction, isValid } from '@cjx-low-code/shared'
import { SchemaSymbol } from '../shared'
import { useField, useSchemaOptions } from '../hooks'
import { h } from '../shared/h'
import Field from './Field'
import ObjectField from './ObjectField'
import RenderSlots from './RenderSlots'
// import ArrayField from './ArrayField'
// import VoidField from './VoidField'
import type { ISchema } from '@cjx-low-code/json-schema'
import type { PropType } from 'vue'
import type { GeneralField } from '@cjx-low-code/core'

const resolveEmptySlot = (slots: Record<any, (...args: any[]) => any[]>) => {
  return Object.keys(slots).length ? h(RenderSlots, {}, slots) : undefined
}

const RecursionField = defineComponent({
  name: 'RecursionField',
  inheritAttrs: false,
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    name: [String, Number],
    basePath: {
      type: String
    }
  },
  setup(props, context) {
    const parentRef = useField()
    const optionsRef = useSchemaOptions()

    const createSchema = (schemaProp: ISchema) => markRaw(new Schema(schemaProp))
    const fieldSchemaRef = computed(() => createSchema(props.schema))

    const getPropsFromSchema = (schema: Schema) => {
      return schema?.getSchema?.({
        ...optionsRef.value
      })
    }

    const fieldPropsRef = shallowRef(getPropsFromSchema(fieldSchemaRef.value))

    watch([fieldSchemaRef, optionsRef], () => {
      fieldPropsRef.value = getPropsFromSchema(fieldSchemaRef.value)
    })

    provide(SchemaSymbol, fieldSchemaRef)

    return () => {
      const fieldProps = fieldPropsRef.value

      const generateSlotsByChildren = () => {
        // console.log(fieldSchemaRef.value)
        const schemaList = fieldSchemaRef.value.children || []

        if (!schemaList.length) return {}

        const renderMap: Record<string, ((field?: GeneralField) => unknown)[]> = {}
        const setRender = (key: string, value: (field?: GeneralField) => unknown) => {
          if (!renderMap[key]) {
            renderMap[key] = []
          }
          renderMap[key].push(value)
        }

        schemaList.forEach((schema, index) => {
          setRender('default', (field?: GeneralField) =>
            h(
              RecursionField,
              {
                key: `${index}-${schema.name}`,
                attrs: {
                  schema,
                  name: schema.name
                },
                slots: schema['slots']
              },
              {}
            )
          )
        })
        const slots = {}
        Object.keys(renderMap).forEach((key) => {
          const renderFns = renderMap[key]
          slots[key] = () => renderFns.map((fn) => fn())
        })

        // console.log(slots)
        return slots
      }

      const getBasePath = () => {
        return props.basePath ?? parentRef?.value?.address
      }

      const render = () => {
        const basePath = getBasePath()

        if (!isValid(props.name)) return resolveEmptySlot(generateSlotsByChildren())
        // console.log(fieldSchemaRef.value)
        if (fieldSchemaRef.value.type === 'object') {
          return h(
            ObjectField,
            {
              attrs: {
                ...fieldProps,
                name: props.name,
                basePath
              }
            },
            generateSlotsByChildren()
          )
        } else if (fieldSchemaRef.value.type === 'array') {
          // return h(
          //   ArrayField,
          //   {
          //     attrs: {
          //       ...fieldProps,
          //       name: props.name,
          //       basePath
          //     }
          //   },
          //   {}
          // )
        } else if (fieldSchemaRef.value.type === 'void') {
          // return h(
          //   VoidField,
          //   {
          //     attrs: {
          //       ...fieldProps,
          //       name: props.name,
          //       basePath
          //     }
          //   },
          //   slots
          // )
        }

        return h(
          Field,
          {
            attrs: {
              ...fieldProps,
              name: props.name,
              basePath
            }
          },
          {}
        )
      }

      if (!fieldSchemaRef.value) return

      return render()
    }
  }
})
export default RecursionField
