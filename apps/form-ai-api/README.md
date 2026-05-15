# form-ai-api（**NestJS**，不是 Next.js + DeepSeek + LangChain）

为设计器「智能表单」准备的 **最小可运行后端**：统一 LLM 适配器、结构化 Prompt、解析 `{ components: [] }` JSON。

## 启动失败 / 找不到 @nestjs/cli

多为 **依赖未装全** 或根目录 **`node_modules` 损坏**（例如 `resolve/package.json` ENOENT）。请在**仓库根目录**执行：

```bash
rm -rf node_modules apps/form-ai-api/node_modules
pnpm install
pnpm form-ai:dev
```

`start:dev` / `build` 已通过 `scripts/run-nest.cjs` 在 **子包 `node_modules` 与仓库根 `node_modules`** 两处查找 `nest`；若依赖未安装仍会报错，按上面重装即可。

### `ENOENT ... resolve@1.22.12/.../resolve/package.json`

表示 **根目录 `node_modules/.pnpm` 已损坏或与当前锁文件不一致**（常见：安装中断、同步盘干扰、目录里出现本不该有的文件）。

在**仓库根目录**执行：

```bash
cd /Users/xiejie/Desktop/code/cjx-low-code

rm -rf node_modules .pnpm-store
rm -rf apps/*/node_modules designer/*/node_modules play/*/node_modules packages/*/node_modules docs/node_modules internal/*/node_modules 2>/dev/null

pnpm store prune
pnpm install
```

仍失败时，把 **`pnpm install` 完整报错**（从第一行 `ERR`/`WARN` 起）贴出再排查。若团队未把 `pnpm-lock.yaml` 纳入版本管理，重装后依赖解析可能变化，需自行评估。

## 安全说明

**切勿在聊天、截图、PR 中泄露 API Key。** 若 Key 已暴露，请立即在 DeepSeek 控制台作废并换新。本地仅使用 `.env`（已加入根目录 `.gitignore`），从 `.env.example` 复制填写。

## 开发与构建

```bash
# 在仓库根目录安装依赖
pnpm install

# 启动（热重载）
pnpm form-ai:dev

# 或
pnpm run -C apps/form-ai-api start:dev
```

复制环境变量：

```bash
cp apps/form-ai-api/.env.example apps/form-ai-api/.env
# 编辑 .env 填入 DEEPSEEK_API_KEY
```

### 端口一直被占用（EADDRINUSE）

- **开发**：`NODE_ENV` 不是 `production` 时，若 `FORM_AI_API_PORT`（或回退的 `PORT`）已被占用，会在其后**自动顺延**到下一个空闲端口，并在日志里 `WARN` 提示实际端口。
- **生产**：请设 `NODE_ENV=production`（或 `FORM_AI_API_STRICT_PORT=1`），**不会**自动换端口，占用则直接失败，便于编排与负载均衡。

`@nestjs/config` 的 dotenv **不会覆盖**已在 shell 里的变量。根目录若已 `export PORT=…`，子包 `.env` 里的 `PORT` 可能不生效；请优先用 **`FORM_AI_API_PORT`**。

## API

- `GET /health` — 健康检查  
- `POST /form-ai/generate` — 请求体：
  ```json
  {
    "userMessage": "做一个用户信息表单，含姓名手机邮箱",
    "existingForm": [],
    "history": [{ "role": "user", "content": "上次说的改成下拉框" }]
  }
  ```
  `existingForm`：当前画布序列化（无 icon）；`history` 可选，最近多轮由设计器自动带上。  
  返回：`{ components, notes?, rawText }`（`components` 已按设计器协议做白名单与字段清洗）

## CORS（部署必读）

- **生产**（`NODE_ENV=production`）：必须在环境变量中配置 **`FORM_AI_CORS_ORIGINS`**，值为逗号分隔的**完整 Origin**（含协议与主机，**不要**路径和尾斜杠），例如：  
  `FORM_AI_CORS_ORIGINS=https://designer.example.com,https://admin.example.com`  
  未配置时进程**启动即失败**，避免误把 API 暴露给任意网站。
- **仅排障**：可临时设置 `FORM_AI_CORS_ALLOW_ALL=1`，对任意 Origin 放行；日志会告警，排完请关闭并改回白名单。
- **本地 / 非生产**：未设置 `FORM_AI_CORS_ORIGINS` 时仍为宽松模式（等价于原先 `origin: true`），便于 Vite 代理与多端口调试；若你希望本地也走白名单，设置 `FORM_AI_CORS_ORIGINS=http://127.0.0.1:5173,http://localhost:5173` 等即可。
- **`FORM_AI_CORS_CREDENTIALS`**：设为 `0` 或 `false` 时关闭 `Access-Control-Allow-Credentials`（默认开启，与前端带 Cookie 场景兼容）。

预检请求支持方法：`GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS`；常用请求头已放行。

**设计器联调**：`designer/vue` 开发时默认请求同源路径 `/__form-ai/form-ai/generate`，由 Vite 代理到 `http://127.0.0.1:3088`（可用环境变量 `VITE_FORM_AI_PROXY_TARGET` 改目标）。若直连 API，在 `designer/vue/.env` 中设置 `VITE_FORM_AI_BASE=http://127.0.0.1:实际端口`（不要尾斜杠）。

## 模型名

`MODEL_NAME` 须与官方文档一致。若使用不存在的名称（例如误写 `deepseek-v4-pro`）会返回 4xx，请以控制台或文档为准（常见为 `deepseek-chat`、`deepseek-reasoner`）。

## 后续可扩展

- LangChain `withStructuredOutput(Zod)` 或官方 `response_format: json_schema`（视模型支持）  
- 对话记忆、会话表、流式 SSE  
- Zod 校验后写入设计器 store 的严格类型  
- 鉴权（JWT）、限流、审计日志  

---

## 工期粗估（单人、已熟悉 Nest + Vue）

| 阶段 | 内容 | 粗估 |
|------|------|------|
| A | 本仓库内 API 骨架 + 单接口打通 DeepSeek + 解析 JSON | **0.5～1 天** |
| B | Prompt 迭代、失败重试、与前端字段协议对齐、Zod 强校验 | **1～2 天** |
| C | 多轮上下文、流式输出、与设计器 UI 联调 | **1～2 天** |
| D | 鉴权、配置中心、观测与限流 | **0.5～1 天** |

**合计 MVP（可用自然语言生成一版表单并落到画布）**：约 **3～6 个工作日**；若只做「能调通 + 返回 JSON」的演示，**1 天内**可收敛。

以上为经验值，随需求范围、联调环境、模型稳定性波动。
