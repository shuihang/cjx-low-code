# CJX Low Code 组件库使用说明

## 安装

```bash
npm install cjx-low-code
# 或
yarn add cjx-low-code
# 或
pnpm add cjx-low-code
```

## 依赖要求

由于本组件库是基于 Element Plus 二次封装的，您需要安装以下依赖：

```bash
npm install vue@^3.5.0 element-plus@^2.8.0 @element-plus/icons-vue@^2.1.0 vue-draggable-plus@^0.5.0 sortablejs@^1.15.0
```

## 使用方式

### 完整引入

```javascript
import { createApp } from 'vue'
import CjxLowCode from 'cjx-low-code'
import 'cjx-low-code/dist/index.css'

const app = createApp(App)
app.use(CjxLowCode)
```

### 按需引入

```javascript
import { XCrud, XForm, XDialog, XEditTable } from 'cjx-low-code'
import 'cjx-low-code/dist/index.css'

// 在组件中使用
export default {
  components: {
    XCrud,
    XForm,
    XDialog,
    XEditTable
  }
}
```

### 单独引入组件

```javascript
// 引入单个组件
import { XCrud } from 'cjx-low-code/es/components/crud'
import { XForm } from 'cjx-low-code/es/components/form'
import { XDialog } from 'cjx-low-code/es/components/dialog'
import { XEditTable } from 'cjx-low-code/es/components/editTable'
```

## 组件列表

- **XCrud**: 增删改查组件
- **XForm**: 表单组件
- **XDialog**: 对话框组件
- **XEditTable**: 可编辑表格组件

## 注意事项

1. 确保已安装 Vue 3.5.0 或更高版本
2. 确保已安装 Element Plus 2.8.0 或更高版本
3. 确保已安装 vue-draggable-plus 和 sortablejs（用于拖拽功能）
4. 需要引入样式文件 `cjx-low-code/dist/index.css`

## 目录结构

构建后的包结构：

```
cjx-low-code/
├── es/                    # ES 模块
│   ├── components/        # 组件目录
│   ├── hooks/            # 钩子函数
│   ├── locale/           # 国际化
│   ├── index.mjs         # 主入口文件
│   └── ...
├── lib/                   # CommonJS 模块
├── dist/                  # 完整构建版本
└── package.json
```
