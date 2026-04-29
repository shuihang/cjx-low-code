# 安装

## 环境要求

- Vue `^3.5.4`
- Element Plus `^2.13.2`

## 包管理器安装

::: code-group

```bash [npm]
npm install @cjx-low-code/element-plus
```

```bash [yarn]
yarn add @cjx-low-code/element-plus
```

```bash [pnpm]
pnpm add @cjx-low-code/element-plus
```

:::

## 依赖说明

`@cjx-low-code/element-plus` 内部依赖以下核心包，安装时会自动解析：

| 包名 | 说明 |
|------|------|
| `@cjx-low-code/core` | 低代码核心模型与状态管理 |
| `@cjx-low-code/vue` | Vue 3 适配层 API（connect、mapProps、createSchemaField 等） |
| `@cjx-low-code/reactivity` | 响应式系统 |
| `@cjx-low-code/json-schema` | JSON Schema 支持 |

## 样式引入

本包不包含额外样式，直接使用 Element Plus 的样式即可：

```ts
import 'element-plus/dist/index.css'
```

如果你使用按需引入（如 `unplugin-element-plus`），则无需手动引入全量样式。
