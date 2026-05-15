import { Injectable, BadRequestException, ServiceUnavailableException } from '@nestjs/common'
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages'
import type { BaseMessageLike } from '@langchain/core/messages'
import { DeepseekChatService } from '../llm/deepseek-chat.service'
import {
  buildFormGenerationSystemPrompt,
  buildFormGenerationUserPrompt,
  buildJsonRepairPrompt
} from './prompts/form-generation.prompt'
import type { GenerateFormDto } from './dto/generate-form.dto'
import { normalizeFormComponentsOrThrow } from './form-normalize'

export interface GenerateFormResult {
  components: Record<string, unknown>[]
  notes?: string
  rawText: string
}

@Injectable()
export class FormAiService {
  constructor(private readonly llm: DeepseekChatService) {}

  async generateForm(dto: GenerateFormDto): Promise<GenerateFormResult> {
    if (!this.llm.isConfigured()) {
      throw new ServiceUnavailableException('未配置 DEEPSEEK_API_KEY')
    }

    const system = buildFormGenerationSystemPrompt()
    const user = buildFormGenerationUserPrompt(dto.userMessage, dto.existingForm)

    const historyMessages = this.buildHistoryMessages(dto)
    const rawText = await this.llm.invoke([
      new SystemMessage(system),
      ...historyMessages,
      new HumanMessage(user)
    ])

    let parsed = this.parseJsonEnvelope(rawText)
    if (!parsed || !Array.isArray(parsed.components)) {
      parsed = await this.tryRepairJson(rawText, '无法解析为包含 components 数组的 JSON')
    }
    if (!parsed || !Array.isArray(parsed.components)) {
      throw new BadRequestException('模型返回无法解析为 { components: [] }，请重试或缩短描述')
    }

    let components: Record<string, unknown>[]
    try {
      components = normalizeFormComponentsOrThrow(parsed.components)
    } catch (e) {
      const hint = e instanceof BadRequestException ? e.message : String(e)
      const retry = await this.tryRepairJson(JSON.stringify(parsed), hint)
      if (!retry || !Array.isArray(retry.components)) {
        throw e instanceof Error ? e : new BadRequestException(String(e))
      }
      components = normalizeFormComponentsOrThrow(retry.components)
    }

    return {
      components,
      notes: typeof parsed.notes === 'string' ? parsed.notes : undefined,
      rawText
    }
  }

  private buildHistoryMessages(dto: GenerateFormDto): BaseMessageLike[] {
    const list = dto.history ?? []
    const out: BaseMessageLike[] = []
    for (const t of list.slice(-8)) {
      if (t.role === 'user') out.push(new HumanMessage(t.content))
      else out.push(new AIMessage(t.content))
    }
    return out
  }

  private async tryRepairJson(
    rawText: string,
    hint: string
  ): Promise<{ components: unknown[]; notes?: string } | null> {
    const fixPrompt = buildJsonRepairPrompt(rawText, hint)
    const text = await this.llm.invoke([new HumanMessage(fixPrompt)])
    return this.parseJsonEnvelope(text)
  }

  /** 从模型输出中提取 JSON（兼容少量 markdown 围栏） */
  private parseJsonEnvelope(text: string): { components: unknown[]; notes?: string } | null {
    let t = text.trim()
    const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t)
    if (fence) {
      t = fence[1].trim()
    }
    const start = t.indexOf('{')
    const end = t.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) return null
    t = t.slice(start, end + 1)
    try {
      return JSON.parse(t) as { components: unknown[]; notes?: string }
    } catch {
      return null
    }
  }
}
