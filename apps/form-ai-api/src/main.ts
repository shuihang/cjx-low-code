import 'reflect-metadata'
import * as net from 'node:net'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { buildFormAiCorsOptions } from './cors-options'

/**
 * 监听端口：优先专用变量，避免与 monorepo / shell 里通用的 `PORT`（Vite 等）冲突。
 * dotenv 不会覆盖已在环境中的键，故仅改子包 `.env` 里的 `PORT` 可能无效。
 */
function resolveListenPort(): number {
  const raw =
    process.env.FORM_AI_API_PORT?.trim() ||
    process.env.FORM_AI_PORT?.trim() ||
    process.env.PORT?.trim() ||
    '3088'
  return Number(raw)
}

/** 探测本机该 TCP 端口是否可 bind（与 Nest 默认监听方式一致，不指定 host）。 */
function isTcpPortFree(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.once('error', (e: NodeJS.ErrnoException) => {
      if (e.code === 'EADDRINUSE' || e.code === 'EACCES') resolve(false)
      else reject(e)
    })
    server.listen(port, () => {
      server.once('close', () => resolve(true))
      server.close()
    })
  })
}

/** 从首选端口起向后查找第一个空闲端口（仅用于非严格模式，便于本地多开）。 */
async function pickFirstFreePort(preferred: number, spread = 128): Promise<number> {
  const end = Math.min(preferred + spread, 65535)
  for (let p = preferred; p <= end; p++) {
    // 顺序探测；端口冲突时通常只尝试少数几次
    // eslint-disable-next-line no-await-in-loop
    if (await isTcpPortFree(p)) return p
  }
  throw new Error(`未在 ${preferred}–${end} 范围内找到可用 TCP 端口`)
}

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)
  app.enableCors(buildFormAiCorsOptions(logger))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  )
  const preferred = resolveListenPort()
  if (!Number.isFinite(preferred) || preferred < 1 || preferred > 65535) {
    throw new Error(
      `无效监听端口（请检查 FORM_AI_API_PORT / FORM_AI_PORT / PORT）：${JSON.stringify({
        FORM_AI_API_PORT: process.env.FORM_AI_API_PORT,
        FORM_AI_PORT: process.env.FORM_AI_PORT,
        PORT: process.env.PORT
      })}`
    )
  }

  const strict =
    process.env.FORM_AI_API_STRICT_PORT === '1' || process.env.NODE_ENV === 'production'

  let listenPort = preferred
  if (!strict) {
    listenPort = await pickFirstFreePort(preferred)
    if (listenPort !== preferred) {
      logger.warn(
        `首选端口 ${preferred} 已被占用，开发环境已自动改用 ${listenPort}。 生产环境请设置 NODE_ENV=production（或 FORM_AI_API_STRICT_PORT=1）并保证 FORM_AI_API_PORT 可用。`
      )
    }
  }

  try {
    await app.listen(listenPort)
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException
    if (err?.code === 'EADDRINUSE') {
      logger.error(
        `端口 ${listenPort} 仍无法监听（可能与探测竞态或其它进程有关）。 请执行：lsof -nP -iTCP:${listenPort} -sTCP:LISTEN${
          strict ? '' : ' 或设置更大的 FORM_AI_API_PORT 区间后再试。'
        }`
      )
    }
    throw e
  }
  logger.log(`form-ai-api listening on http://localhost:${listenPort}`)
}

bootstrap()
