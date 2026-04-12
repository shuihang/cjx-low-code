/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { rollup } from 'rollup'
import postcss from 'rollup-plugin-postcss'
import NpmImport from 'less-plugin-npm-import'
import resolve from 'rollup-plugin-node-resolve'
import type { OutputOptions, RollupOptions } from 'rollup'

export const getRollupBasePlugin = () => [
  resolve({ mainFields: ['module', 'main'], extensions: ['.mjs', '.js', '.ts', '.json'] }),
  postcss({
    extract: true,
    minimize: true,
    sourceMap: true,
    // extensions: ['.css', '.less', '.sass'],
    use: {
      less: {
        plugins: [new NpmImport({ prefix: '~' })],
        javascriptEnabled: true
      },
      sass: {},
      stylus: {}
    }
  })
]

export const build = async (
  rollupConfig: Omit<RollupOptions, 'output'> & { output: OutputOptions }
) => {
  const { output, ...input } = rollupConfig
  const bundle = await rollup(input)

  return bundle.write(output as OutputOptions)
}
