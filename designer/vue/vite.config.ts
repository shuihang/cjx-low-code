import { resolve } from 'path'
import { loadEnv } from 'vite'
import { createVitePlugins } from './build/vite'
import { exclude, include } from "./build/vite/optimize"
import type { ConfigEnv, UserConfig } from 'vite'
// 当前执行node命令时文件夹的地址(工作目录)
const root = process.cwd()

// 路径查找
function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  let env = {} as any
  const isBuild = command === 'build'
  if (!isBuild) {
    env = loadEnv((process.argv[3] === '--mode' ? process.argv[4] : process.argv[3]), root)
  } else {
    env = loadEnv(mode, root)
  }
  return {
    base: env.VITE_BASE_PATH || '/',
    root,
    // 指定静态资源目录
    // publicDir: 'public',
    // 如果需要指定 HTML 入口文件位置，可以使用以下配置：
    // root: pathResolve('src'), // 将根目录设置为 src
    // 或者使用插件来指定 HTML 文件位置
    // 服务端渲染
    server: {
      // 是否开启 https
      https: false,
      // 端口号
      port: env.VITE_PORT,
      host: "0.0.0.0",
      open: env.VITE_OPEN === 'true',
      // 本地跨域代理. 目前注释的原因：暂时没有用途，server 端已经支持跨域
      // proxy: {
      //   ['/admin-api']: {
      //     target: env.VITE_BASE_URL,
      //     ws: false,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(new RegExp(`^/admin-api`), ''),
      //   },
      // },
    },
    // 项目使用的vite插件。 单独提取到build/vite/plugin中管理
    plugins: createVitePlugins(),
    css: {
    preprocessorOptions: {
      scss: {
        // 告诉 Sass 编译器使用现代 API
        api: 'modern-compiler',
        // （可选）如果你不希望看到 legacy-js-api 警告，可以取消下面这行的注释
        // silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
      alias: [
        // {
        //   find: 'vue-i18n',
        //   replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        // },
        {
          find: /\@\//,
          replacement: `${pathResolve('src')}/`
        }
      ]
    },
    build: {
      minify: 'terser',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'inline' : false,
      // brotliSize: false,
      terserOptions: {
        compress: {
          drop_debugger: env.VITE_DROP_DEBUGGER === 'true',
          drop_console: env.VITE_DROP_CONSOLE === 'true'
        }
      }
    },
    optimizeDeps: { include, exclude }
  }
}
