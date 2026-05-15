import ejs from 'ejs'

/** 与画布 store 中 components 项一致的可序列化字段（避免 FormComponentProps 泛型在调用处实例化过深） */
export type DesignSchemaRow = {
  name: string
  title?: string
  /** 与 defaultFormTemplates / json-schema 一致，如 string、number、boolean */
  type?: string
  decorator?: string
  component: string
  componentProps?: Record<string, unknown>
  decoratorProps?: Record<string, unknown>
  icon?: unknown
}

export type SchemaMarkupRow = {
  fieldTag: string
  titleAttr: string
  name: string
  decorator: string
  hasDecoratorProps: boolean
  /** `v-bind` 内可用的 JS 对象字面量（非 JSON 字符串） */
  decoratorPropsLiteral: string
  componentAttr: string
  hasComponentProps: boolean
  componentPropsLiteral: string
}

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

/** 与 createSchemaField 中 createTypedSchemaField(type) 一致；无 type 时用 Markup */
const SCHEMA_TYPE_TO_FIELD_TAG: Record<string, string> = {
  string: 'SchemaField.String',
  number: 'SchemaField.Number',
  boolean: 'SchemaField.Boolean',
  object: 'SchemaField.Object',
  array: 'SchemaField.Array',
  void: 'SchemaField.Void',
  date: 'SchemaField.Date',
  datetime: 'SchemaField.DateTime'
}

export function schemaFieldMarkupTag(type: string | undefined | null): string {
  if (type == null || String(type).trim() === '') return 'SchemaField.Markup'
  const key = String(type).trim().toLowerCase()
  return SCHEMA_TYPE_TO_FIELD_TAG[key] ?? 'SchemaField.Markup'
}

function omitDesignOnly(row: DesignSchemaRow): DesignSchemaRow {
  const { icon: _i, ...rest } = row
  return rest
}

function hasPlainObject(o: unknown): o is Record<string, unknown> {
  return !!o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o as object).length > 0
}

/** 与模板中 `          title=` 对齐的缩进前缀 */
const ATTR_INDENT = '          '

const JS_LITERAL_MAX_DEPTH = 14

function escapeJsStringInSingleQuotes(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r/g, '\\r').replace(/\n/g, '\\n')
}

function isJsIdentifierKey(k: string): boolean {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k)
}

/** 生成可在 `:prop="…"` 中使用的 JS 字面量片段（根对象用多行 + 与属性列对齐的缩进） */
function formatValueAsJsLiteral(value: unknown, indent: string, depth: number): string {
  if (depth > JS_LITERAL_MAX_DEPTH) return 'undefined'
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  const t = typeof value
  if (t === 'string') return `'${escapeJsStringInSingleQuotes(value as string)}'`
  if (t === 'number' || t === 'bigint') return String(value)
  if (t === 'boolean') return String(value)
  if (t === 'function' || t === 'symbol') return 'undefined'
  if (value instanceof Date) return `'${escapeJsStringInSingleQuotes(value.toISOString())}'`

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const inner = `${indent}  `
    const items = value.map((v) => formatValueAsJsLiteral(v, inner, depth + 1))
    return `[\n${inner}${items.join(`,\n${inner}`)}\n${indent}]`
  }

  if (typeof value === 'object' && value !== null) {
    const o = value as Record<string, unknown>
    const keys = Object.keys(o).sort()
    if (keys.length === 0) return '{}'
    const inner = `${indent}  `
    const pairs = keys.map((k) => {
      const keyStr = isJsIdentifierKey(k) ? k : `'${escapeJsStringInSingleQuotes(k)}'`
      return `${keyStr}: ${formatValueAsJsLiteral(o[k], inner, depth + 1)}`
    })
    return `{\n${inner}${pairs.join(`,\n${inner}`)}\n${indent}}`
  }

  return 'undefined'
}

function formatRootPropsObjectLiteral(obj: Record<string, unknown>): string {
  return formatValueAsJsLiteral(obj, ATTR_INDENT, 0)
}

export function componentsToMarkupRows(components: DesignSchemaRow[]): SchemaMarkupRow[] {
  return components.map((raw) => {
    const row = omitDesignOnly(raw)
    const dp = row.decoratorProps
    const cp = row.componentProps

    return {
      fieldTag: schemaFieldMarkupTag(row.type),
      titleAttr: escapeHtmlAttr(String(row.title ?? '')),
      name: String(row.name),
      decorator: row.decorator ? String(row.decorator) : 'FormItem',
      hasDecoratorProps: hasPlainObject(dp),
      decoratorPropsLiteral: hasPlainObject(dp) ? formatRootPropsObjectLiteral(dp) : '{}',
      componentAttr: String(row.component),
      hasComponentProps: hasPlainObject(cp),
      componentPropsLiteral: hasPlainObject(cp) ? formatRootPropsObjectLiteral(cp) : '{}'
    }
  })
}

/** 与 play/vue 中 FormProvider + Form + SchemaField 子标签写法一致 */
const SCHEMA_MARKUP_SFC_EJS = `<template>
  <FormProvider :form="form">
    <Form>
      <SchemaField>
<%_ items.forEach(function (row) { _%>
        <<%= row.fieldTag %>
          title="<%= row.titleAttr %>"
          name="<%= row.name %>"
          decorator="<%= row.decorator %>"
<%_ if (row.hasDecoratorProps) { _%>
          :decorator-props="<%- row.decoratorPropsLiteral %>"
<%_ } _%>
          component="<%= row.componentAttr %>"
<%_ if (row.hasComponentProps) { _%>
          :component-props="<%- row.componentPropsLiteral %>"
<%_ } _%>
        />
<%_ }) _%>
      </SchemaField>
    </Form>
  </FormProvider>
</template>

<script setup lang="ts">
import { Form } from '@cjx-low-code/element-plus'
import { createForm } from '@cjx-low-code/core'
import { FormProvider } from '@cjx-low-code/vue'
import { SchemaField } from '@/defaultFormTemplates'

const form = createForm({})
</script>
`

export function renderSchemaMarkupSfcFromComponents(components: DesignSchemaRow[]): string {
  const items = componentsToMarkupRows(components)
  return ejs.render(SCHEMA_MARKUP_SFC_EJS, { items }).trim()
}
