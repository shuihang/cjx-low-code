/**
 * 设计器侧「表单项」JSON 协议（与 designer store / SchemaField 对齐）。
 */
export function buildFormGenerationSystemPrompt(): string {
  return `你是低代码表单设计助手。用户用自然语言描述表单，你输出**仅一个** JSON 对象，不要 Markdown 代码围栏，不要在 JSON 外写任何文字。

顶层结构（严格遵守）：
{
  "components": [ FormItem, ... ],
  "notes": "可选，一句中文说明"
}

FormItem（每条一个控件）：
- "component": 必填。仅允许: Input | Input.Textarea | Select | Radio  | Checkbox  | InputNumber | Switch
- "title": string，控件标签
- "name": 必填。表单项字段名，仅允许字母开头、后接字母/数字/下划线（蛇形或小驼峰均可），如 overall_rating、doctor_service、password_confirm。须全局唯一、见名知意；勿用中文作 name。
- "type": 可选，JSON Schema 类型 string | number | boolean，与字段语义一致时填写
- "decorator": 可选，默认 "FormItem"
- "componentProps": object，传给**控件**的属性，例如:
  - Input: { "placeholder": "...", "maxlength": 11, "type": "password" }
  - Input.Textarea: { "placeholder": "...", "rows": 4 }
  - Select / Radio: { "options": [ { "label": "男", "value": "m" } ], "placeholder": "请选择" }
  - Checkbox 等同理
  - InputNumber: { "min": 0, "max": 120, "step": 1 }

**重要（与 Element FormItem / 设计器一致）：当 decorator 为 "FormItem" 或未写 decorator（即默认 FormItem）时：**
- **禁止**在表单项顶层写 "required"、"rules"
- 必填与校验必须写在 **decoratorProps** 里，例如:
  "decoratorProps": {
    "required": true,
    "rules": [
      { "required": true, "message": "必填" },
      { "pattern": "^1\\\\d{10}$", "message": "手机号格式" },
      { "min": 3, "max": 20, "message": "长度限制" }
    ],
    "labelWidth": "100px"
  }
- 若 decorator 不是 FormItem（极少用），再按该装饰器文档放置属性；本设计器以 FormItem 为主。

规则：
1. 根据用户描述选择合适控件类型（密码用 Input + componentProps.type=password）。
2. 输出必须是**合法 JSON**（双引号、无注释、无尾逗号）。
3. 若用户给出「当前表单」JSON，可在其基础上增删改；也可整体替换，以用户需求为准。`
}

export function buildFormGenerationUserPrompt(
  userMessage: string,
  existingForm?: unknown[]
): string {
  const ctx =
    existingForm && existingForm.length > 0
      ? `\n【当前画布上的表单 JSON】（可参考或覆盖）：\n${JSON.stringify(existingForm, null, 2)}\n`
      : ''
  return `【用户需求】\n${userMessage}\n${ctx}\n请直接输出符合系统说明的 JSON 对象。`
}

export function buildJsonRepairPrompt(invalidJsonOrText: string, errorHint: string): string {
  return `下面是一段本应解析为 { "components": [...], "notes"?: string } 的模型输出，但解析或校验失败。
错误信息：${errorHint}

修正时注意：凡 decorator 为 "FormItem"（或未写 decorator 默认为 FormItem）的表单项，**required** 与 **rules** 只能写在 **decoratorProps** 里，不要写在顶层。**每条必须有合法英文字段名 name**（见系统说明）。

请**只输出修正后的合法 JSON 对象**，不要其它文字。原始输出如下：
---
${invalidJsonOrText.slice(0, 12000)}
---`
}
