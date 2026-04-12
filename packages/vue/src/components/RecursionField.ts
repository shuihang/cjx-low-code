import { computed, markRaw, provide, shallowRef, watch } from 'vue'
import { Schema } from '@cjx-low-code/json-schema'
import { isFunction, isValid } from '@cjx-low-code/shared'
import { SchemaSymbol } from '../shared'
import { useField, useSchemaOptions } from '../hooks'
import { h } from '../shared/h'
import Field from './Field'
import type { ISchema } from '@cjx-low-code/json-schema'
import type { PropType, VNode } from 'vue'
import type { DefineComponent, IRecursionFieldProps } from '../types'
import type { GeneralField } from '@cjx-low-code/core'

const resolveEmptySlot = (slots: Record<any, (...args: any[]) => any[]>) => {
  return Object.keys(slots).length ? h('div', { style: 'display:contents;' }, slots) : undefined
}

const RecursionField = {
  name: 'RecursionField',
  inheritAttrs: false,
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    name: [String, Number]
  },
  setup(props: IRecursionFieldProps) {
    const parentRef = useField()
    const optionsRef = useSchemaOptions()

    const createSchema = (schemaProp: ISchema[]) => markRaw(new Schema(schemaProp))
    const fieldSchemaRef = computed(() => createSchema(props.schema.schemas as ISchema[]))

    const getPropsFromSchema = (schema: Schema) => {
      return schema?.toFieldProps?.({
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

      const generateSlotsByProperties = () => {
        const schemas = Schema.getSchemas(fieldSchemaRef.value)

        if (!schemas.length) return {}
        const renderMap: Record<string, ((field?: GeneralField) => unknown)[]> = {}
        const setRender = (key: string, value: (field?: GeneralField) => unknown) => {
          if (!renderMap[key]) {
            renderMap[key] = []
          }
          renderMap[key].push(value)
        }

        schemas.forEach((schema, index) => {
          setRender(schema['slots'] ?? 'default', (field?: GeneralField) =>
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
        // console.log(renderMap)
        Object.keys(renderMap).forEach((key) => {
          const renderFns = renderMap[key]
          slots[key] = () => renderFns.map((fn) => fn())
          // slots[key] = scoped
          //   ? ({ field }) => renderFns.map((fn) => fn(field))
          //   : () => renderFns.map((fn) => fn())
        })

        // console.log(slots)
        return slots
      }

      const render = () => {
        //if (!isValid(props.name)) return resolveEmptySlot(generateSlotsByProperties())

        const schemas = Schema.getSchemas(fieldSchemaRef.value)
        if (!schemas.length) return

        const vNode: VNode[] = []
        schemas.forEach((schema, index) => {
          vNode.push(
            h(
              Field,
              {
                attrs: {
                  key: `${index}-${schema.name}`,
                  ...schema
                  // name: props.name
                }
              },
              {
                ...schema.slots
              }
            )
          )
        })

        return vNode

        // console.log(1111, fieldProps, props.name)
        // return h(
        //   Field,
        //   {
        //     ...fieldProps,
        //     name: props.name
        //   },
        //   {}
        // )
      }

      if (!fieldSchemaRef.value) return

      return render()
    }
  }
} as unknown as DefineComponent<IRecursionFieldProps>

export default RecursionField
