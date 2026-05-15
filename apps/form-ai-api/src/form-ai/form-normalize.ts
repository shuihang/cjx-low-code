import { BadRequestException } from '@nestjs/common'

const ALLOWED = new Set([
  'Input',
  'Input.Textarea',
  'Select',
  'Radio',
  'RadioGroup',
  'Checkbox',
  'CheckboxGroup',
  'InputNumber',
  'Switch'
])

const TYPE_SET = new Set(['string', 'number', 'boolean'])

function sanitizePlainObject(input: unknown): Record<string, unknown> | undefined {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined
  try {
    return JSON.parse(JSON.stringify(input)) as Record<string, unknown>
  } catch {
    return undefined
  }
}

function normalizeComponentAlias(raw: string): string | null {
  const c = raw.trim()
  if (ALLOWED.has(c)) return c
  if (c === 'Textarea' || c === 'TextArea') return 'Input.Textarea'
  if (c === 'textarea') return 'Input.Textarea'
  return null
}

function normalizeRulesArray(raw: unknown): Record<string, unknown>[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((r) => r && typeof r === 'object' && !Array.isArray(r))
    .map((r) => sanitizePlainObject(r))
    .filter((x): x is Record<string, unknown> => !!x)
}

const FIELD_NAME_RE = /^[a-zA-Z_][a-zA-Z0-9_]*$/

function isValidFieldName(s: string): boolean {
  return FIELD_NAME_RE.test(s) && s.length <= 64
}

/** 模型未给合法 name 时，用序号兜底（中文 title 无法安全转标识符） */
function deriveFallbackFieldName(index: number): string {
  return `field_${index + 1}`
}

/** 将模型输出的单条表单项规范为设计器可消费的 JSON（丢弃无法识别的项）。 */
export function normalizeFormComponent(item: unknown, index: number): Record<string, unknown> | null {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null
  const o = item as Record<string, unknown>
  const comp = normalizeComponentAlias(String(o.component ?? ''))
  if (!comp) return null

  const title = typeof o.title === 'string' && o.title.trim() ? o.title.trim() : '未命名'
  const decorator =
    typeof o.decorator === 'string' && o.decorator.trim() ? o.decorator.trim() : 'FormItem'

  const rawName = typeof o.name === 'string' ? o.name.trim() : ''
  const name = rawName && isValidFieldName(rawName) ? rawName : deriveFallbackFieldName(index)

  const out: Record<string, unknown> = {
    name,
    title,
    decorator,
    component: comp
  }

  if (typeof o.type === 'string' && TYPE_SET.has(o.type)) {
    out.type = o.type
  }

  const cp = sanitizePlainObject(o.componentProps)
  if (cp) out.componentProps = cp

  const isFormItem = decorator === 'FormItem'

  if (isFormItem) {
    const dp: Record<string, unknown> = { ...(sanitizePlainObject(o.decoratorProps) ?? {}) }

    if (typeof o.required === 'boolean' && dp.required === undefined) {
      dp.required = o.required
    }

    const rulesFromDp = normalizeRulesArray(dp.rules)
    const rulesFromTop = normalizeRulesArray(o.rules)
    const mergedRules = [...rulesFromDp, ...rulesFromTop]
    if (mergedRules.length) {
      dp.rules = mergedRules
    } else {
      delete dp.rules
    }

    if (Object.keys(dp).length) {
      out.decoratorProps = dp
    }
  } else {
    if (typeof o.required === 'boolean') {
      out.required = o.required
    }
    const rules = normalizeRulesArray(o.rules)
    if (rules.length) {
      out.rules = rules
    }

    const dp = sanitizePlainObject(o.decoratorProps)
    if (dp) out.decoratorProps = dp
  }

  return out
}

export function normalizeFormComponentsOrThrow(components: unknown): Record<string, unknown>[] {
  if (!Array.isArray(components)) {
    throw new BadRequestException('components 必须是数组')
  }
  const out: Record<string, unknown>[] = []
  for (let i = 0; i < components.length; i++) {
    const row = normalizeFormComponent(components[i], i)
    if (row) out.push(row)
  }
  const seen = new Set<string>()
  for (const row of out) {
    const n = String(row.name ?? '')
    if (seen.has(n)) {
      let k = 2
      let next = `${n}_${k}`
      while (seen.has(next)) {
        k += 1
        next = `${n}_${k}`
      }
      row.name = next
    }
    seen.add(String(row.name))
  }
  if (out.length === 0) {
    throw new BadRequestException(
      '没有可用的表单项：请确保每条含合法 component（Input、Select、InputNumber 等），并检查 JSON 结构'
    )
  }
  return out
}
