<template>
  <aside class="designer-ai-assistant-panel" role="complementary" aria-label="AI 智能助理">
    <header class="ai-assistant-header">
      <span class="ai-assistant-title">AI 智能助理</span>
      <div class="ai-assistant-header-actions">
        <el-tooltip content="清空对话" placement="bottom">
          <el-button
            :icon="Delete"
            circle
            text
            type="danger"
            aria-label="清空对话"
            @click.stop="clearChat"
          />
        </el-tooltip>
        <el-tooltip content="收起" placement="bottom">
          <el-button :icon="Close" circle text type="primary" aria-label="收起" @click="close" />
        </el-tooltip>
      </div>
    </header>

    <div class="ai-assistant-body">
      <el-scrollbar ref="scrollbarRef" class="ai-assistant-scroll">
        <div class="ai-assistant-scroll-inner">
          <section v-if="showWelcomeBoard" class="ai-welcome" aria-label="使用引导">
            <div class="ai-welcome-logo" aria-hidden="true">AI</div>
            <h2 class="ai-welcome-title">欢迎使用 AI 助理</h2>
            <p class="ai-welcome-desc">
              用自然语言描述表单即可生成画布结构；支持在现有表单上继续修改。生成结果会替换当前画布。
            </p>
            <p class="ai-welcome-hint">
              提示：使用 <strong>FormItem</strong> 时，必填与校验应写在
              <strong>decoratorProps</strong> 中（后端已自动规范，模型也会按此约定输出）。
            </p>
            <div class="ai-welcome-suggest-head">
              <span class="ai-welcome-suggest-label">试着问我</span>
              <el-button
                text
                type="primary"
                size="small"
                :icon="RefreshRight"
                @click="rotateSuggestions"
              >
                换一换
              </el-button>
            </div>
            <div class="ai-welcome-grid" role="list">
              <button
                v-for="(line, idx) in activeSuggestionBlock"
                :key="`${suggestionBlockIndex}-${idx}`"
                type="button"
                class="ai-welcome-chip"
                role="listitem"
                :disabled="thinking"
                @click="useSuggestion(line)"
              >
                {{ line }}
              </button>
            </div>
            <p class="ai-welcome-foot"
              >点击示例将<strong>直接发送</strong>给模型并更新画布；也可在下方输入框自行描述需求。</p
            >
          </section>

          <div class="ai-assistant-messages">
            <template v-for="m in messages" :key="m.id">
              <div v-if="m.role === 'assistant'" class="ai-msg ai-msg--assistant">
                <div class="ai-msg-avatar" aria-hidden="true">
                  <span class="ai-msg-avatar-text">AI</span>
                </div>
                <div class="ai-msg-bubble ai-msg-bubble--assistant">
                  <div class="ai-msg-text ai-msg-text--assistant">{{ m.content }}</div>
                </div>
              </div>
              <div v-else class="ai-msg ai-msg--user">
                <div class="ai-msg-bubble ai-msg-bubble--user">
                  <div class="ai-msg-text ai-msg-text--user">{{ m.content }}</div>
                </div>
              </div>
            </template>
            <div v-if="thinking" class="ai-msg ai-msg--assistant">
              <div class="ai-msg-avatar" aria-hidden="true">
                <span class="ai-msg-avatar-text">AI</span>
              </div>
              <div class="ai-msg-bubble ai-msg-bubble--assistant ai-msg-bubble--thinking">
                <el-icon class="is-loading ai-thinking-icon"><Loading /></el-icon>
                <span>正在分析需求…</span>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>

      <div class="ai-assistant-composer">
        <el-input
          v-model="draft"
          type="textarea"
          :rows="2"
          resize="none"
          maxlength="2000"
          show-word-limit
          placeholder="请描述您的需求…"
          class="ai-assistant-input"
          @keydown.enter.exact.prevent="onEnterSend"
        />
        <el-button
          type="primary"
          circle
          class="ai-assistant-send"
          :icon="Top"
          :loading="thinking"
          :disabled="!draftTrimmed || thinking"
          aria-label="发送"
          @click="send"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { Close, Delete, Loading, RefreshRight, Top } from '@element-plus/icons-vue'

export type AiChatRole = 'user' | 'assistant'

export interface AiChatMessage {
  id: string
  role: AiChatRole
  content: string
}

export interface DesignerAiAssistantPanelExpose {
  finishAssistant: (content: string) => void
  failAssistant: (content: string) => void
}

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  send: [payload: { text: string; messages: AiChatMessage[] }]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

function close() {
  visible.value = false
}

const scrollbarRef = ref<any>(null)
const messages = ref<AiChatMessage[]>([])
const draft = ref('')
const thinking = ref(false)

/** 示例问题分组，「换一换」轮换 */
const SUGGESTION_BLOCKS: string[][] = [
  [
    '生成一个就诊满意度问卷表单，含评分与开放建议',
    '做一个登录表单：用户名、密码、确认密码，均为必填',
    '在当前表单上追加一行：联系电话，手机号格式校验',
    '生成员工信息登记：姓名、部门下拉、入职日期、备注多行文本'
  ],
  [
    '创建一个意见收集表单：联系人、邮箱、问题分类、详细描述',
    '生成预约表单：姓名、预约日期、时段单选、人数数字框',
    '把表单改成调研：性别单选、年龄数字、是否愿意回访开关',
    '添加收货地址：省市区三级用三个下拉（可先占位选项）'
  ],
  [
    '生成简单反馈表：标题单行、满意度 1-5 数字、意见建议多行',
    '做一个注册页：账号、密码、确认密码、同意协议复选框必填',
    '追加紧急联系人：姓名、与本人关系、手机号',
    '生成课程报名表：课程名下拉、学号、备注'
  ]
]

const suggestionBlockIndex = ref(0)
const activeSuggestionBlock = computed(
  () => SUGGESTION_BLOCKS[suggestionBlockIndex.value % SUGGESTION_BLOCKS.length]!
)

const showWelcomeBoard = computed(() => messages.value.length === 0 && !thinking.value)

function rotateSuggestions() {
  suggestionBlockIndex.value = (suggestionBlockIndex.value + 1) % SUGGESTION_BLOCKS.length
}

function useSuggestion(text: string) {
  submitUserQuery(text)
}

let msgId = 0
function nextId() {
  msgId += 1
  return `ai-msg-${msgId}`
}

const draftTrimmed = computed(() => draft.value.trim())

function scrollToBottom() {
  nextTick(() => {
    const wrap = scrollbarRef.value?.wrapRef
    if (wrap) {
      wrap.scrollTop = wrap.scrollHeight
    }
  })
}

function clearChat() {
  messages.value = []
  thinking.value = false
  draft.value = ''
}

/** 提交用户文案（输入框发送或示例一键发送） */
function submitUserQuery(text: string) {
  const t = text.trim()
  if (!t || thinking.value) return

  messages.value.push({ id: nextId(), role: 'user', content: t })
  draft.value = ''
  thinking.value = true
  emit('send', { text: t, messages: [...messages.value] })
  scrollToBottom()
}

function send() {
  submitUserQuery(draftTrimmed.value)
}

defineExpose<DesignerAiAssistantPanelExpose>({
  finishAssistant(content: string) {
    thinking.value = false
    messages.value.push({ id: nextId(), role: 'assistant', content })
    scrollToBottom()
  },
  failAssistant(content: string) {
    thinking.value = false
    messages.value.push({
      id: nextId(),
      role: 'assistant',
      content
    })
    scrollToBottom()
  }
})

function onEnterSend() {
  send()
}

watch(visible, (open) => {
  if (!open) {
    thinking.value = false
  } else {
    scrollToBottom()
  }
})

watch(
  () => messages.value.length,
  () => scrollToBottom()
)
</script>

<style scoped>
.designer-ai-assistant-panel {
  display: flex;
  flex-direction: column;
  width: 400px;
  min-width: 400px;
  height: 100%;
  min-height: 0;
  flex-shrink: 0;
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
  box-sizing: border-box;
}

.ai-assistant-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 14px 12px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.ai-assistant-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.ai-assistant-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ai-assistant-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 0 12px 12px;
}

.ai-assistant-scroll {
  flex: 1;
  min-height: 0;
}

.ai-assistant-scroll-inner {
  min-height: 100%;
  box-sizing: border-box;
}

.ai-welcome {
  padding: 20px 12px 4px;
  text-align: center;
  border-bottom: 1px dashed var(--el-border-color-lighter);
  margin-bottom: 8px;
}

.ai-welcome-logo {
  width: 48px;
  height: 48px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.02em;
}

.ai-welcome-title {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.ai-welcome-desc,
.ai-welcome-hint,
.ai-welcome-foot {
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.55;
  color: var(--el-text-color-secondary);
  text-align: left;
}

.ai-welcome-hint {
  font-size: 12px;
  padding: 8px 10px;
  border-radius: 8px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
}

.ai-welcome-foot {
  margin-bottom: 0;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.ai-welcome-suggest-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 4px;
}

.ai-welcome-suggest-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.ai-welcome-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 8px;
}

.ai-welcome-chip {
  display: block;
  width: 100%;
  padding: 10px 10px;
  border-radius: 10px;
  border: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-blank);
  color: var(--el-text-color-primary);
  font-size: 12px;
  line-height: 1.45;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;
  box-sizing: border-box;
}

.ai-welcome-chip:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.ai-welcome-chip:not(:disabled):hover {
  border-color: var(--el-color-primary-light-5);
  background: var(--el-color-primary-light-9);
  box-shadow: 0 1px 4px rgba(64, 158, 255, 0.12);
}

.ai-assistant-messages {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px 10px 16px;
  box-sizing: border-box;
}

.ai-msg {
  display: flex;
  gap: 10px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

.ai-msg--assistant {
  align-self: flex-start;
  align-items: flex-start;
  justify-content: flex-start;
}

.ai-msg--user {
  align-self: stretch;
  justify-content: flex-end;
  align-items: flex-start;
}

.ai-msg-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-msg-avatar-text {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.ai-msg-bubble {
  border-radius: 14px;
  padding: 10px 14px;
  line-height: 1.55;
  font-size: 13px;
  box-sizing: border-box;
  min-width: 0;
}

/* 助手侧：头像 + 气泡，气泡上限为列宽减头像 */
.ai-msg--assistant .ai-msg-bubble {
  flex: 1;
  max-width: calc(100% - 42px);
}

/* 用户侧：无头像，气泡贴右且随内容变宽，避免 max-width 百分比参考异常导致一字一行 */
.ai-msg--user .ai-msg-bubble {
  flex: 0 1 auto;
  width: fit-content;
  max-width: min(100%, 18rem);
  border-radius: 14px 14px 4px 14px;
}

.ai-msg-text--assistant {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.ai-msg-text--user {
  white-space: pre-wrap;
  overflow-wrap: break-word;
  word-break: normal;
}

.ai-msg-bubble--assistant {
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.ai-msg-bubble--user {
  background: linear-gradient(
    180deg,
    var(--el-color-primary-light-3) 0%,
    var(--el-color-primary) 100%
  );
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 1px 4px rgba(64, 158, 255, 0.35);
}

.ai-msg-bubble--thinking {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.ai-thinking-icon {
  font-size: 14px;
}

.ai-assistant-composer {
  position: relative;
  flex-shrink: 0;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.ai-assistant-input :deep(.el-textarea__inner) {
  border-radius: 12px;
  padding-right: 48px;
  padding-bottom: 28px;
}

.ai-assistant-send {
  position: absolute;
  right: 10px;
  bottom: 14px;
}
</style>
