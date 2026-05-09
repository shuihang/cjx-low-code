import baseConfig, {
  removeImportStyleFromInputFilePlugin,
} from '../../scripts/rollup.base.js'

import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import VueJsx from '@vitejs/plugin-vue-jsx'

const libPresets = () => [
  typescript({
    tsconfig: './tsconfig.build.json',
    tsconfigOverride: {
      compilerOptions: {
        declaration: true,
        module: 'esnext'
      }
    },
    include: ['**/*.ts', '**/*.tsx']
  }),
  VueJsx(),
  resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'] }),
  commonjs()
]

const libConfig = [
  {
    input: 'src/index.ts',
    output: {
      format: 'cjs',
      dir: 'lib',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].js',
      exports: 'named'
    },
    external: ['vue', /^@cjx-low-code\//],
    plugins: libPresets()
  },
  {
    input: 'src/index.ts',
    output: {
      format: 'es',
      dir: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].js'
    },
    external: ['vue', /^@cjx-low-code\//],
    plugins: libPresets()
  }
]

export default [...libConfig, ...baseConfig('cjx-low-code.element-plus', 'CjxLowCode.ElementPlus', VueJsx())]

