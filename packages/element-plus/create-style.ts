import path from 'path'
import glob from 'glob'
import fs from 'fs-extra'

glob('./*/style.ts', { cwd: path.resolve(__dirname, './src') }, (err, files) => {
  if (err) return console.error(err)
  fs.writeFile(
    path.resolve(__dirname, './src/style.ts'),
    `// auto generated code
${files
  .map((filePath) => {
    return `import '${filePath.replace(/\.ts$/, '')}'\n`
  })
  .join('')}`,
    'utf8'
  )
})
