import { PKG_PREFIX } from '@cjx-low-code/build-constants'
import path from 'path'

import type { Plugin } from 'rollup'

export function ImportPathRewriter(): Plugin {
  return {
    name: 'import-path-rewriter',
    renderChunk(code, chunk) {
      // 处理 .mjs 和 .js 文件
      const isMjsFile = chunk.fileName.endsWith('.mjs')
      const isJsFile = chunk.fileName.endsWith('.js')
      
      if (!isMjsFile && !isJsFile) {
        return null
      }

      // 替换 @cjx-low-code/components 开头的导入路径为相对路径
      let updatedCode = code
      
      // 处理 import 语句 (ESM)
      updatedCode = updatedCode.replace(
        /import\s+([^'"]*)\s+from\s+['"]@cjx-low-code\/components\/([^'"]*)['"]/g,
        (match, importName, importPath) => {
          // 计算相对路径 - 现在 components 直接放在 es 目录下，不需要 packages 前缀
          const currentDir = path.dirname(chunk.fileName)
          const targetPath = `components/${importPath}`
          
          // 计算从当前文件到目标文件的相对路径
          const relativePath = path.relative(currentDir, targetPath)
          
          // 确保路径以 ./ 开头
          const normalizedPath = relativePath.startsWith('.') 
            ? relativePath 
            : `./${relativePath}`
          
          // 根据当前文件类型添加对应的扩展名
          const extension = isMjsFile ? '.mjs' : '.js'
          const finalPath = `${normalizedPath}${extension}`
          
          return `import ${importName} from '${finalPath}'`
        }
      )
      
      // 处理 require 语句 (CJS)
      updatedCode = updatedCode.replace(
        /require\(['"]@cjx-low-code\/components\/([^'"]*)['"]\)/g,
        (match, importPath) => {
          // 计算相对路径 - 现在 components 直接放在 es 目录下，不需要 packages 前缀
          const currentDir = path.dirname(chunk.fileName)
          const targetPath = `components/${importPath}`
          
          // 计算从当前文件到目标文件的相对路径
          const relativePath = path.relative(currentDir, targetPath)
          
          // 确保路径以 ./ 开头
          const normalizedPath = relativePath.startsWith('.') 
            ? relativePath 
            : `./${relativePath}`
          
          // 根据当前文件类型添加对应的扩展名
          const extension = isMjsFile ? '.mjs' : '.js'
          const finalPath = `${normalizedPath}${extension}`
          
          return `require('${finalPath}')`
        }
      )

      // 处理错误的相对路径 - 修复 ../components/ 为 ./components/
      updatedCode = updatedCode.replace(
        /from\s+['"]\.\.\/components\/([^'"]*)['"]/g,
        (match, importPath) => {
          // 如果路径已经包含扩展名，就不添加
          const hasExtension = /\.(mjs|js)$/.test(importPath)
          if (hasExtension) {
            return `from './components/${importPath}'`
          }
          const extension = isMjsFile ? '.mjs' : '.js'
          return `from './components/${importPath}${extension}'`
        }
      )

      // 处理错误的相对路径 - 修复 ../hooks/ 为 ./hooks/
      updatedCode = updatedCode.replace(
        /from\s+['"]\.\.\/hooks\/([^'"]*)['"]/g,
        (match, importPath) => {
          // 如果路径已经包含扩展名，就不添加
          const hasExtension = /\.(mjs|js)$/.test(importPath)
          if (hasExtension) {
            return `from './hooks/${importPath}'`
          }
          const extension = isMjsFile ? '.mjs' : '.js'
          return `from './hooks/${importPath}${extension}'`
        }
      )

      // 处理错误的相对路径 - 修复 ../locale/ 为 ./locale/
      updatedCode = updatedCode.replace(
        /from\s+['"]\.\.\/locale\/([^'"]*)['"]/g,
        (match, importPath) => {
          // 如果路径已经包含扩展名，就不添加
          const hasExtension = /\.(mjs|js)$/.test(importPath)
          if (hasExtension) {
            return `from './locale/${importPath}'`
          }
          const extension = isMjsFile ? '.mjs' : '.js'
          return `from './locale/${importPath}${extension}'`
        }
      )

      // 通用规则：处理所有错误的相对路径 - 修复 ../ 为 ./
      // 这个规则应该放在最后，因为它会匹配所有 ../ 开头的路径
      updatedCode = updatedCode.replace(
        /from\s+['"]\.\.\/([^'"]*)['"]/g,
        (match, importPath) => {
          // 如果路径已经包含扩展名，就不添加
          const hasExtension = /\.(mjs|js)$/.test(importPath)
          if (hasExtension) {
            return `from './${importPath}'`
          }
          const extension = isMjsFile ? '.mjs' : '.js'
          return `from './${importPath}${extension}'`
        }
      )

      // 处理 import 语句中的 ../ 路径（不包含 from 关键字的情况）
      updatedCode = updatedCode.replace(
        /import\s+['"]\.\.\/([^'"]*)['"]/g,
        (match, importPath) => {
          // 如果路径已经包含扩展名，就不添加
          const hasExtension = /\.(mjs|js)$/.test(importPath)
          if (hasExtension) {
            return `import './${importPath}'`
          }
          const extension = isMjsFile ? '.mjs' : '.js'
          return `import './${importPath}${extension}'`
        }
      )

      // 处理所有 @cjx-low-code/components 的导入和导出（包括 export 语句）
      updatedCode = updatedCode.replace(
        /@cjx-low-code\/components\/([^'"]*)/g,
        (match, importPath) => {
          // 计算相对路径 - 现在 components 直接放在 es 目录下，不需要 packages 前缀
          const currentDir = path.dirname(chunk.fileName)
          const targetPath = `components/${importPath}`
          
          // 计算从当前文件到目标文件的相对路径
          const relativePath = path.relative(currentDir, targetPath)
          
          // 确保路径以 ./ 开头
          const normalizedPath = relativePath.startsWith('.') 
            ? relativePath 
            : `./${relativePath}`
          
          // 根据当前文件类型添加对应的扩展名
          const extension = isMjsFile ? '.mjs' : '.js'
          const finalPath = `${normalizedPath}${extension}`
          
          return finalPath
        }
      )

      // 处理 @element-plus/icons-vue 的 node_modules 路径导入
      updatedCode = updatedCode.replace(
        /from\s+['"][^'"]*node_modules[^'"]*@element-plus\/icons-vue[^'"]*['"]/g,
        () => {
          return `from '@element-plus/icons-vue'`
        }
      )

      // 如果代码有变化，返回更新后的代码
      if (updatedCode !== code) {
        return {
          code: updatedCode,
          map: null // 不生成 source map，避免警告
        }
      }
      
      return null
    }
  }
}