#!/usr/bin/env node
/**
 * 在 monorepo + pnpm 下，@nestjs/cli 可能在子包 node_modules 或根目录 node_modules。
 * 找不到时给出明确修复步骤。
 */
const { existsSync } = require('fs')
const { join, dirname } = require('path')
const { spawnSync } = require('child_process')

const args = process.argv.slice(2)
const cwd = __dirname ? join(__dirname, '..') : process.cwd()
const roots = [
  join(cwd, 'node_modules', '@nestjs', 'cli', 'bin', 'nest.js'),
  join(cwd, '..', '..', 'node_modules', '@nestjs', 'cli', 'bin', 'nest.js')
]

let nestJs = roots.find((p) => existsSync(p))
if (!nestJs) {
  try {
    nestJs = require.resolve('@nestjs/cli/bin/nest.js', { paths: [cwd, join(cwd, '..', '..')] })
  } catch {
    nestJs = null
  }
}

if (!nestJs || !existsSync(nestJs)) {
  console.error(`
[form-ai-api] 未找到 @nestjs/cli（依赖未安装或 node_modules 损坏）。

请在仓库根目录执行（会重装依赖）：

  rm -rf node_modules apps/form-ai-api/node_modules
  pnpm install

再执行：

  pnpm form-ai:dev
`)
  process.exit(1)
}

const r = spawnSync(process.execPath, [nestJs, ...args], {
  cwd,
  stdio: 'inherit',
  env: process.env
})
process.exit(r.status ?? 1)
