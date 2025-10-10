# 自定义 Rollup 插件

## ImportPathRewriter 插件

### 功能
将 `@cjx-low-code/components` 开头的导入路径转换为相对路径，同时支持 ESM 和 CJS 格式。

### 转换示例

#### ESM 格式 (.mjs 文件)
```typescript
// 转换前
import XSearchForm from '@cjx-low-code/components/form/src/search';
import { formColumnValues } from '@cjx-low-code/components/form/src/interface';
import pick from '@cjx-low-code/components/_util/pick';

// 转换后
import XSearchForm from '../../../form/src/search.mjs';
import { formColumnValues } from '../../../form/src/interface.mjs';
import pick from '../../../_util/pick.mjs';
```

#### CJS 格式 (.js 文件)
```javascript
// 转换前
var XSearchForm = require('@cjx-low-code/components/form/src/search');
var _interface = require('@cjx-low-code/components/form/src/interface');
var pick = require('@cjx-low-code/components/_util/pick');

// 转换后
var XSearchForm = require('../../../form/src/search.js');
var _interface = require('../../../form/src/interface.js');
var pick = require('../../../_util/pick.js');
```

### 工作原理
1. 检测文件类型（`.mjs` 或 `.js`）
2. 使用正则表达式匹配 `@cjx-low-code/components` 开头的导入语句
   - ESM: 匹配 `import ... from '...'` 语法
   - CJS: 匹配 `require('...')` 语法
3. 根据当前文件位置和目标文件位置计算相对路径
4. 根据文件类型自动添加对应的扩展名（`.mjs` 或 `.js`）
5. 确保相对路径以 `./` 开头

### 配置位置
- 插件文件：`/internal/build/src/plugins/import-path-rewriter.ts`
- 构建配置：`/internal/build/src/tasks/modules.ts`

### 优势
- 同时支持 ESM 和 CJS 格式
- 精确控制路径转换逻辑
- 动态计算相对路径
- 智能扩展名处理
- 避免 source map 警告
- 代码简洁，易于维护

### 使用场景
适用于需要将包内导入路径转换为相对路径的场景，特别是构建多格式（ESM + CJS）的组件库。
