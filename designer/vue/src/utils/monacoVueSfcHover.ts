let registered = false

function blocksFor(
  text: string
): Array<{ start: number; end: number; json: string; attr: string }> {
  const r: Array<{ start: number; end: number; json: string; attr: string }> = []
  for (const attr of [':component-props', ':decorator-props'] as const) {
    const needle = attr === ':component-props' ? ":component-props='" : ":decorator-props='"
    let from = 0
    while (from < text.length) {
      const i = text.indexOf(needle, from)
      if (i === -1) break
      const brace = text.indexOf('{', i + needle.length)
      if (brace === -1) {
        from = i + needle.length
        continue
      }
      let depth = 0
      let j = brace
      for (; j < text.length; j++) {
        const c = text[j]
        if (c === '{') depth++
        else if (c === '}') {
          depth--
          if (depth === 0) {
            r.push({ start: brace, end: j + 1, json: text.slice(brace, j + 1), attr })
            from = j + 1
            break
          }
        }
      }
      if (j >= text.length) break
    }
  }
  return r
}

/** 根据 JSON 值给出类似 TS 的简短类型描述（Formily 里来自接口；这里来自运行时 JSON） */
function jsonValueTypeDesc(v: unknown, depth = 0): string {
  if (v === null) return 'null'
  const t = typeof v
  if (t !== 'object') return t
  if (Array.isArray(v)) {
    if (v.length === 0) return 'unknown[]'
    const el0 = v[0]
    if (el0 !== null && typeof el0 === 'object' && !Array.isArray(el0)) {
      const keys = Object.keys(el0 as object)
      if (depth >= 2 || keys.length > 10) return '{ ... }[]'
      const inner = keys
        .map((k) => `${k}: ${jsonValueTypeDesc((el0 as Record<string, unknown>)[k], depth + 1)}`)
        .join('; ')
      return `{ ${inner} }[]`
    }
    return `${jsonValueTypeDesc(el0, depth + 1)}[]`
  }
  const o = v as Record<string, unknown>
  const keys = Object.keys(o)
  if (depth >= 2 || keys.length > 10) return '{ ... }'
  const inner = keys.map((k) => `${k}: ${jsonValueTypeDesc(o[k], depth + 1)}`).join('; ')
  return `{ ${inner} }`
}

function findJsonKeyNameAtColumn(line: string, col1: number): string | null {
  const re = /"((?:[^"\\]|\\.)*)"\s*:/g
  let m: RegExpExecArray | null
  while ((m = re.exec(line)) !== null) {
    const keyStart = m.index + 1
    const keyEnd = m.index + 1 + m[1]!.length
    if (col1 >= keyStart && col1 <= keyEnd) return m[1]!.replace(/\\"/g, '"')
  }
  return null
}

const ATTR_DOC: Record<string, string> = {
  title: `### (property) \`title\`\n表单项标题。\n\n\`\`\`ts\ntitle?: string\n\`\`\``,
  name: `### (property) \`name\`\n字段名 / 路径。\n\n\`\`\`ts\nname: string\n\`\`\``,
  decorator: `### (property) \`decorator\`\n装饰器组件，一般为 \`FormItem\`。\n\n\`\`\`ts\ndecorator?: string\n\`\`\``,
  component: `### (property) \`component\`\n实际控件，需在 \`createSchemaField\` 中注册。\n\n\`\`\`ts\ncomponent: string\n\`\`\``,
  'decorator-props': `### (property) \`:decorator-props\`\n传给 FormItem 等装饰器的 props（如 \`rules\`）。`,
  'component-props': `### (property) \`:component-props\`\n传给当前 \`component\` 的 props。`
}

function findAttrNameAtColumn(
  line: string,
  col1: number
): { name: string; s0: number; e0: number } | null {
  const re = /(\s*)(:)?([\w.-]+)\s*=\s*['"{]/g
  let m: RegExpExecArray | null
  while ((m = re.exec(line)) !== null) {
    const name = (m[2] ?? '') + m[3]!
    const s0 = m.index + m[1]!.length + (m[2]?.length ?? 0)
    const e0 = s0 + name.length
    if (col1 > s0 && col1 <= e0) {
      const n = name.startsWith(':') ? name.slice(1) : name
      return { name: n, s0, e0 }
    }
  }
  return null
}

function findSchemaFieldTagPos(
  line: string,
  col1: number
): { tag: string; s0: number; e0: number } | null {
  const re = /<\s*(SchemaField(?:\.\w+)?)\b/g
  let m: RegExpExecArray | null
  while ((m = re.exec(line)) !== null) {
    const tag = m[1]!
    const rel = m[0].indexOf(tag)
    const s0 = m.index + rel
    const e0 = s0 + tag.length
    if (col1 > s0 && col1 <= e0) return { tag, s0, e0 }
  }
  return null
}

/**
 * Formily：TSX + **TypeScript 语言服务**根据 **props 类型定义** 显示 `(property) xxx: Type`，不是单独插件「读值猜类型」。
 *
 * Vue SFC 在 Monaco 的 `html` 模式没有 TS，这里用 HoverProvider：
 * - 常见属性名：静态说明
 * - `:component-props` / `:decorator-props` 内 **JSON 键名**：`JSON.parse` 后用值推断 `string | object | { a: string }[]` 等（嵌套数组首项对象会展开一层；更深层的键需以后再做路径解析）。
 */
export function ensureVueSfcMonacoHover(m: typeof import('monaco-editor')): void {
  if (registered) return
  registered = true

  m.languages.registerHoverProvider('html', {
    provideHover(model, position) {
      const text = model.getValue()
      const offset = model.getOffsetAt(position)
      const line = model.getLineContent(position.lineNumber)
      const col1 = position.column
      const ln = position.lineNumber

      const blocks = blocksFor(text)
      for (const b of blocks) {
        if (offset < b.start || offset > b.end) continue
        let parsed: Record<string, unknown>
        try {
          parsed = JSON.parse(b.json) as Record<string, unknown>
        } catch {
          continue
        }
        const key = findJsonKeyNameAtColumn(line, col1)
        if (key) {
          const attrLabel = b.attr === ':component-props' ? 'component-props' : 'decorator-props'
          const word = model.getWordAtPosition(position)
          const range = word
            ? new m.Range(ln, word.startColumn, ln, word.endColumn)
            : new m.Range(ln, col1, ln, col1)
          if (key in parsed) {
            const val = parsed[key]
            const desc = jsonValueTypeDesc(val)
            const md = `### (property)\n\n\`\`\`ts\n${key}: ${desc}\n\`\`\`\n\n>`
            return { range, contents: [{ value: md, isTrusted: true }] }
          }
          return { range, contents: [{ value: 'any' }] }
        }
      }

      const tagPos = findSchemaFieldTagPos(line, col1)
      if (tagPos) {
        return {
          range: new m.Range(ln, tagPos.s0 + 1, ln, tagPos.e0 + 1),
          contents: [{ value: 'any' }]
        }
      }

      const attrPos = findAttrNameAtColumn(line, col1)
      if (attrPos) {
        const doc = ATTR_DOC[attrPos.name]
        if (doc) {
          return {
            range: new m.Range(ln, attrPos.s0 + 1, ln, attrPos.e0 + 1),
            contents: [{ value: doc, isTrusted: true }]
          }
        }
        return {
          range: new m.Range(ln, attrPos.s0 + 1, ln, attrPos.e0 + 1),
          contents: [{ value: 'any' }]
        }
      }

      return null
    }
  })
}
