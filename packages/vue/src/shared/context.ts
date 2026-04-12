import type { Schema } from '@cjx-low-code/json-schema'
import type { InjectionKey, Ref } from 'vue'
import type { Form, GeneralField } from '@cjx-low-code/core'
import type { SchemaVueComponents } from '../types'

export const SchemaSymbol: InjectionKey<Ref<Schema>> = Symbol('schema')

export interface ISchemaFieldVueFactoryOptions<Components extends SchemaVueComponents = any> {
  components?: Components
  scope?: any
}

export const SchemaMarkupSymbol: InjectionKey<Ref<Schema>> = Symbol('schemaMarkup')

export const FormSymbol: InjectionKey<Ref<Form>> = Symbol('form')

export const SchemaOptionsSymbol: InjectionKey<Ref<ISchemaFieldVueFactoryOptions>> =
  Symbol('SchemaSymbol')

export const FieldSymbol: InjectionKey<Ref<GeneralField>> = Symbol('field')
