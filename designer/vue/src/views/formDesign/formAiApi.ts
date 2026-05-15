export interface FormAiGenerateResponse {
  components: unknown[]
  notes?: string
  rawText?: string
}

function resolveGenerateUrl(): string {
  const base = (import.meta.env.VITE_FORM_AI_BASE as string | undefined)?.trim()
  if (base) {
    return `${base.replace(/\/$/, '')}/form-ai/generate`
  }
  return '/__form-ai/form-ai/generate'
}

export function serializeFormForAi(components: unknown[]) {
  if (!Array.isArray(components)) return []
  return components.map((c) => {
    if (!c || typeof c !== 'object') return {}
    const o = { ...(c as Record<string, unknown>) }
    delete o.icon
    return o
  })
}

function pickHttpErrorMessage(data: Record<string, unknown>, fallback: string): string {
  const m = data.message
  if (typeof m === 'string' && m.trim()) return m.trim()
  if (Array.isArray(m)) {
    return m
      .map((x) => {
        if (typeof x === 'string') return x
        if (x && typeof x === 'object' && 'message' in x) {
          return String((x as { message: unknown }).message)
        }
        return ''
      })
      .filter(Boolean)
      .join('；')
  }
  return fallback
}

export async function requestFormAiGenerate(body: {
  userMessage: string
  existingForm?: unknown[]
  history?: { role: 'user' | 'assistant'; content: string }[]
}): Promise<FormAiGenerateResponse> {
  const res = await fetch(resolveGenerateUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    const msg = pickHttpErrorMessage(data, res.statusText)
    throw new Error(msg || `HTTP ${res.status}`)
  }
  const components = data.components
  if (!Array.isArray(components)) {
    throw new TypeError('响应缺少 components 数组')
  }
  return {
    components,
    notes: typeof data.notes === 'string' ? data.notes : undefined,
    rawText: typeof data.rawText === 'string' ? data.rawText : undefined
  }
}
