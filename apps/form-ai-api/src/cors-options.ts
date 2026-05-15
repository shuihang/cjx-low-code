import type { Logger } from '@nestjs/common'
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'

/** 逗号分隔，须含协议与主机，无路径无尾斜杠，如 https://app.example.com */
export function parseFormAiCorsOrigins(): string[] {
  const raw = process.env.FORM_AI_CORS_ORIGINS?.trim()
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

const defaultCorsMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'] as const

const defaultAllowedHeaders = [
  'Content-Type',
  'Authorization',
  'Accept',
  'X-Requested-With'
] as const

/**
 * 生产：必须配置 FORM_AI_CORS_ORIGINS，或显式 FORM_AI_CORS_ALLOW_ALL=1（仅排障）。
 * 非生产：未配置白名单时等价于 origin: true，便于本地与 Vite 代理联调。
 */
export function buildFormAiCorsOptions(logger: Logger): CorsOptions {
  const isProd = process.env.NODE_ENV === 'production'
  const allowAll =
    process.env.FORM_AI_CORS_ALLOW_ALL === '1' || process.env.FORM_AI_CORS_ALLOW_ALL === 'true'
  const list = parseFormAiCorsOrigins()
  const credentials =
    process.env.FORM_AI_CORS_CREDENTIALS !== '0' && process.env.FORM_AI_CORS_CREDENTIALS !== 'false'

  const base: Pick<CorsOptions, 'methods' | 'allowedHeaders' | 'maxAge'> = {
    methods: [...defaultCorsMethods],
    allowedHeaders: [...defaultAllowedHeaders],
    maxAge: 86400
  }

  if (isProd) {
    if (allowAll) {
      logger.warn(
        'FORM_AI_CORS_ALLOW_ALL 已开启：任意 Origin 可跨域访问本 API，仅限排障，上线请改回白名单并关闭此开关。'
      )
      return { ...base, origin: true, credentials }
    }
    if (list.length === 0) {
      throw new Error(
        '生产环境 CORS：请设置 FORM_AI_CORS_ORIGINS（逗号分隔完整 Origin，如 https://designer.example.com），或临时设置 FORM_AI_CORS_ALLOW_ALL=1 排障。'
      )
    }
    logger.log(`CORS（生产）：已启用白名单（${list.length} 个 Origin）`)
    return {
      ...base,
      credentials,
      origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
        if (!origin) {
          cb(null, true)
          return
        }
        cb(null, list.includes(origin))
      }
    }
  }

  if (list.length > 0) {
    logger.log(`CORS 白名单（非生产）：${list.join(', ')}`)
    return {
      ...base,
      credentials,
      origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => {
        if (!origin) {
          cb(null, true)
          return
        }
        cb(null, list.includes(origin))
      }
    }
  }

  return { ...base, origin: true, credentials }
}
