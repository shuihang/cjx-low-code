<template>
  <div class="form-design-container">
    <el-container class="h-100% form-design-el-container">
      <div
        class="fd-left-cluster flex flex-row items-stretch h-full min-h-0 shrink-0 bg-white border border-solid border-gray-200 border-l-none border-t-none border-b-none"
      >
        <div
          class="flex flex-col items-center p-12px shrink-0 border-r border-solid border-gray-200"
        >
          <el-tooltip content="组件列表" transition="slide-fade" placement="right">
            <el-button
              text
              circle
              class="p-0! min-h-auto! m-b-12px"
              :type="leftToolPanel === 'components' ? 'primary' : 'default'"
              aria-label="组件列表"
              @click="leftToolPanel = 'components'"
            >
              <el-icon :size="20"><Grid /></el-icon>
            </el-button>
          </el-tooltip>

          <el-tooltip content="智能助理" color="#409eff" transition="slide-fade" placement="right">
            <el-button
              text
              circle
              class="p-0! min-h-auto!"
              :type="leftToolPanel === 'assistant' ? 'primary' : 'default'"
              aria-label="智能助理"
              @click="leftToolPanel = 'assistant'"
            >
              <el-icon :size="20"
                ><svg
                  class="icon"
                  style="
                    width: 1.189453125em;
                    height: 1em;
                    vertical-align: middle;
                    fill: currentColor;
                    overflow: hidden;
                  "
                  viewBox="0 0 1218 1024"
                  p-id="1036"
                >
                  <path
                    d="M326.183722 206.500257c19.568414 0 36.788619 9.523295 47.529504 24.177863a41.528523 41.528523 0 0 1 17.394146 18.698707l1.348046 3.391858 249.910392 711.072687c8.088278 22.916787-6.348863 48.529667-32.17917 57.22674-24.525746 8.262219-50.529994-1.652444-60.009803-22.351478l-1.304561-3.348373-64.793194-184.247491H160.460996l-64.706223 184.247491c-8.088278 22.916787-35.527543 34.440409-61.314364 25.699851-24.569231-8.262219-38.788945-31.787802-33.222819-53.791396l1.000164-3.47883L252.08466 252.81217a43.267938 43.267938 0 0 1 30.439756-26.91744A58.574787 58.574787 0 0 1 326.140237 206.500257h0.043485z m459.553336 201.511181c25.960763 0 47.225106 12.958639 49.312404 29.396106l0.130456 2.609122v549.046217c0 17.698544-22.177536 32.005229-49.44286 32.005229-25.960763 0-47.225106-12.915153-49.268918-29.396107l-0.217427-2.609122V440.060152c0-17.698544 22.177536-32.005229 49.486345-32.005229zM322.226554 350.741212l-127.760002 363.494165h255.563489L322.226554 350.697727zM1038.430514 105.52724a14.958966 14.958966 0 0 1 9.697236 9.56678l38.658489 117.801853 120.889315 42.87657a14.958966 14.958966 0 0 1-0.869708 28.482914l-118.410648 33.266304-36.658163 116.018954a14.958966 14.958966 0 0 1-28.439428 0.130456l-38.701975-117.758368-117.323515-37.223473a14.958966 14.958966 0 0 1-0.217426-28.395943l115.975468-39.049858 36.658162-115.975468a14.958966 14.958966 0 0 1 18.742193-9.740721zM772.387051 0.553569a10.436488 10.436488 0 0 1 6.653261 6.827202l22.04708 70.489776 72.490103 24.569232a10.436488 10.436488 0 0 1-0.391368 19.959782l-72.185706 21.48177-23.569067 70.794174a10.436488 10.436488 0 0 1-19.872812-0.173941l-22.04708-70.489777-70.228865-21.220858a10.436488 10.436488 0 0 1-0.434853-19.872811l70.794174-24.873629 23.525582-70.881145a10.436488 10.436488 0 0 1 13.219551-6.609775z"
                    p-id="1037"
                  />
                </svg>
              </el-icon>
            </el-button>
          </el-tooltip>
        </div>

        <el-aside
          v-show="leftToolPanel === 'components'"
          width="300px"
          class="fd-components-aside"
          :style="{ ...siderStyle, padding: '20px' }"
        >
          <ComponentsList @add-item="addItem" />
        </el-aside>

        <DesignerAiAssistantPanel
          v-show="leftToolPanel === 'assistant'"
          ref="aiPanelRef"
          :model-value="leftToolPanel === 'assistant'"
          @update:model-value="onAssistantPanelVisible"
          @send="onAiAssistantSend"
        />
      </div>

      <el-main>
        <div id="editorContainer" class="h-100% w-100%">
          <PreviewMenu />

          <el-row id="canvas-area" class="bg-white w-100% h-[calc(100%-20px)] box-border p-20px">
            <DropZone />
          </el-row>
        </div>
      </el-main>

      <el-aside width="310px" :style="{ ...siderStyle, padding: '20px' }">
        <PropsTable
          v-if="currentForProps"
          :key="currentForProps.name"
          :data="currentForProps"
          @change="handleChange"
        />
        <div v-else class="text-14px text-gray-400 text-left p-12px"
          >点击画布中的表单项以编辑属性</div
        >
      </el-aside>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { Grid } from '@element-plus/icons-vue'
import PreviewMenu from './components/PreviewMenu.vue'
import DropZone from './components/DropZone.vue'
import PropsTable from './components/PropsTable.vue'
import DesignerAiAssistantPanel from './components/DesignerAiAssistantPanel.vue'
import { requestFormAiGenerate, serializeFormForAi } from './formAiApi'
import type { DesignerAiAssistantPanelExpose } from './components/DesignerAiAssistantPanel.vue'
import type { TabsPaneContext } from 'element-plus'
import type { CSSProperties } from 'vue'
import type { FormComponentProps } from '@/defaultFormTemplates'
import ComponentsList from '@/components/common/ComponentsList.vue'
import useEditorStore from '@/store/modules/editor'

const { getCurrentElement } = storeToRefs(useEditorStore())

/** 规避 FormComponentProps 与 Schema 联合类型过深导致的 PropsTable 赋值报错 */
const currentForProps = computed(() => getCurrentElement.value as FormComponentProps | undefined)

const siderStyle: CSSProperties = {
  textAlign: 'center',
  minHeight: '100%',
  color: '#fff',
  backgroundColor: '#fff'
}

const activeName = ref('control')
const activeKeyRight = ref('prop')
/** 左侧工具区：组件列表与智能助理互斥，同一时刻只显示其一 */
const leftToolPanel = ref<'components' | 'assistant'>('components')

const aiPanelRef = ref<DesignerAiAssistantPanelExpose | null>(null)

function onAssistantPanelVisible(open: boolean) {
  if (!open) {
    leftToolPanel.value = 'components'
  }
}

const onAiAssistantSend = async (payload: {
  text: string
  messages: { role: string; content: string }[]
}) => {
  const editor = useEditorStore()
  const panel = aiPanelRef.value
  const prior = payload.messages.slice(0, -1)
  const history =
    prior.length > 0
      ? prior
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(-8)
          .map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content
          }))
      : undefined
  try {
    const { components, notes } = await requestFormAiGenerate({
      userMessage: payload.text,
      existingForm: serializeFormForAi(editor.components as unknown[]),
      history
    })
    editor.replaceComponentsFromAi(components)
    const lines = [
      notes ? `说明：${notes}` : '',
      `已生成 ${components.length} 个表单项并应用到画布。`
    ].filter(Boolean)
    panel?.finishAssistant(lines.join('\n'))
    ElMessage.success('表单已更新')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    panel?.failAssistant(msg)
    ElMessage.error(msg)
  }
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const addItem = (row: FormComponentProps & { insertIndex?: number; insertType?: string }) => {
  useEditorStore().addComponents(row)
}

const handleChange = ({ key, value }) => {
  console.log(key, value)
  useEditorStore().updateComponents({ key, value })
}
</script>

<style lang="scss" scoped>
.form-design-container {
  height: 100%;
  width: 100%;
  background-color: #f0f2f5;
}

.form-design-el-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  min-height: 0;
}

.fd-components-aside {
  flex-shrink: 0;
  box-sizing: border-box;
  border-right: 1px solid var(--el-border-color);
}
</style>
