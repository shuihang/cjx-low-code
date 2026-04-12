import path from 'path'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import externalGlobals from 'rollup-plugin-external-globals'
import injectProcessEnv from 'rollup-plugin-inject-process-env'
import { dts } from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

const presets = () => {
  const externals = {
    antd: 'antd',
    vue: 'Vue',
    react: 'React',
    moment: 'moment',
    'react-is': 'ReactIs',
    'react-dom': 'ReactDOM',
    'element-plus': 'ElementPlus',
    'ant-design-vue': 'AntDesignVue',
    '@ant-design/icons': 'icons',
    '@cjx-low-code/reactivity-react': 'CJXLowCode.ReactivityReact',
    '@cjx-low-code/reactivity-vue': 'CJXLowCode.ReactivityVue',
    '@cjx-low-code/reactivity': 'CJXLowCode.Reactivity',
    '@cjx-low-code/path': 'CJXLowCode.Path',
    '@cjx-low-code/shared': 'CJXLowCode.Shared',
    '@cjx-low-code/core': 'CJXLowCode.Core',
    '@cjx-low-code/json-schema': 'CJXLowCode.JSONSchema',
    '@cjx-low-code/react': 'CJXLowCode.React',
    '@cjx-low-code/vue': 'CJXLowCode.Vue'
  }
  return [
    typescript({
      tsconfig: './tsconfig.build.json',
      compilerOptions: {
        declaration: false
      }
    }),
    resolve(),
    commonjs(),
    externalGlobals(externals, {
      exclude: ['**/*.{less,sass,scss}']
    })
  ]
}

const createEnvPlugin = (env) => {
  return injectProcessEnv(
    {
      NODE_ENV: env
    },
    {
      exclude: '**/*.{css,less,sass,scss}',
      verbose: false
    }
  )
}

const inputFilePath = path.join(process.cwd(), 'src/index.ts')

const noUIDtsPackages = [
  'cjx-low-code.core',
  'cjx-low-code.shared',
  'cjx-low-code.path',
  'cjx-low-code.json-schema',
  'cjx-low-code.reactivity'
]

export const removeImportStyleFromInputFilePlugin = () => ({
  name: 'remove-import-style-from-input-file',
  transform(code, id) {
    // 样式由 build:style 进行打包，要删所以除入口文件上的 `import './style'`
    if (inputFilePath === id) {
      return code.replace(`import './style';`, '')
    }

    return code
  }
})

export default (filename, targetName, ...plugins) => {
  const base = [
    {
      input: 'src/index.ts',
      output: {
        format: 'umd',
        file: `dist/${filename}.umd.development.js`,
        name: targetName,
        sourcemap: true,
        amd: {
          id: filename
        },
        globals: {
          '@cjx-low-code/json-schema': 'CJXLowCode.JSONSchema'
        }
      },
      external: ['react', 'react-dom', 'react-is', '@cjx-low-code/json-schema'],
      plugins: [...presets(), ...plugins, createEnvPlugin('development')]
    },
    {
      input: 'src/index.ts',
      output: {
        format: 'umd',
        file: `dist/${filename}.umd.production.js`,
        name: targetName,
        sourcemap: true,
        amd: {
          id: filename
        },
        globals: {
          '@cjx-low-code/json-schema': 'CJXLowCode.JSONSchema'
        }
      },
      external: ['react', 'react-dom', 'react-is', '@cjx-low-code/json-schema'],
      plugins: [...presets(), terser(), ...plugins, createEnvPlugin('production')]
    }
  ]

  if (noUIDtsPackages.includes(filename)) {
    base.push({
      input: 'esm/index.d.ts',
      output: {
        format: 'es',
        file: `dist/${filename}.d.ts`
      },
      plugins: [dts(), ...plugins]
    })
    base.push({
      input: 'esm/index.d.ts',
      output: {
        format: 'es',
        file: `dist/${filename}.all.d.ts`
      },
      plugins: [
        dts({
          respectExternal: true
        }),
        ...plugins
      ]
    })
  }

  return base
}
