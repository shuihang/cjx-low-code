import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import glob from 'fast-glob'
import { epRoot, excludeFiles, pkgRoot } from '@cjx-low-code/build-utils'
import { generateExternal, writeBundles } from '../utils'
import { ElementPlusAlias } from '../plugins/element-plus-alias'
import { ImportPathRewriter } from '../plugins/import-path-rewriter'
import { buildConfigEntries, target } from '../build-info'

import type { OutputOptions } from 'rollup'

export const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue,tsx}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  console.log(`Building modules...`, input)
  const bundle = await rollup({
    input,
    plugins: [
      ElementPlusAlias(),
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue({
            isProduction: true,
          }),
          vueJsx: vueJsx({
            babelPlugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }]
            ]
          }),
        },
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target,
        loaders: {
          '.vue': 'ts',
        },
      }),
      // ImportPathRewriter(),
    ],
    external: await generateExternal({ full: false }),
    treeshake: false,
  })
  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: pkgRoot, // 使用 pkgRoot 作为根目录，这样所有包都会保持相对路径
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}
