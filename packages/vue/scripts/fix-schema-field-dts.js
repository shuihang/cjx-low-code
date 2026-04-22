/**
 * 从 SchemaField.ts 源码中自动提取 createSchemaField 的声明，
 * 替换到编译后的 .d.ts 文件中，保证 d.ts 与源码始终同步。
 */
const fs = require('fs')
const path = require('path')
const colors = require('colors')

const srcFile = path.resolve(__dirname, '../src/components/SchemaField.tsx')
const dtsFiles = [
  path.resolve(__dirname, '../esm/components/SchemaField.d.ts'),
  path.resolve(__dirname, '../lib/components/SchemaField.d.ts')
]

/**
 * 从源码文本中提取 export function createSchemaField 的完整函数体，
 * 并转换为 export declare function ...
 */
function extractCreateSchemaFieldDeclare(source) {
  const startMarker = 'export function createSchemaField'
  const startIdx = source.indexOf(startMarker)
  if (startIdx === -1) {
    throw new Error(`[fix-dts] Cannot find "${startMarker}" in ${srcFile}`)
  }

  // 找到函数体起始的 "{"
  let braceStart = startIdx + startMarker.length
  while (braceStart < source.length && source[braceStart] !== '{') {
    braceStart++
  }
  if (braceStart >= source.length) {
    throw new Error('[fix-dts] Cannot find opening brace of createSchemaField')
  }

  // 括号计数，找到配对的 "}"
  let depth = 1
  let end = braceStart + 1
  while (depth > 0 && end < source.length) {
    if (source[end] === '{') depth++
    else if (source[end] === '}') depth--
    end++
  }

  if (depth !== 0) {
    throw new Error('[fix-dts] Unbalanced braces in createSchemaField')
  }

  const funcSource = source.slice(startIdx, end)
  // 把 export function 改成 export declare function
  return funcSource.replace(/^export\s+function\b/, 'export declare function')
}

// 读取源码并提取声明
const sourceContent = fs.readFileSync(srcFile, 'utf-8')
const replacement = extractCreateSchemaFieldDeclare(sourceContent)

for (const file of dtsFiles) {
  if (!fs.existsSync(file)) continue

  let content = fs.readFileSync(file, 'utf-8')

  // 避免重复插入
  if (content.includes('type ComponentPropsMap = {')) {
    console.log(colors.brightYellow(`[fix-dts] Already patched, skip ${file}`.bold))
    continue
  }

  // 删掉旧的 createSchemaField 声明行（包括带 ; 的版本）
  content = content.replace(/export declare function createSchemaField[\s\S]*?;\n?$/, '')

  // 追加新的
  content = content + replacement

  fs.writeFileSync(file, content)
  console.log(colors.brightCyan.bgGrey.underline(`[fix-dts] Patched ${file}`.bold))
}
