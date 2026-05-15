import { Inject, Injectable, Logger, type OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ChatOpenAI } from '@langchain/openai'
import type { BaseMessageLike } from '@langchain/core/messages'

/**
 * 大模型统一请求适配器：OpenAI 兼容协议 → DeepSeek。
 * LangChain {@link ChatOpenAI} + 自定义 baseURL。
 */
@Injectable()
export class DeepseekChatService implements OnModuleInit {
  private readonly logger = new Logger(DeepseekChatService.name)
  private model!: ChatOpenAI

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  onModuleInit() {
    const apiKey = this.config.get<string>('DEEPSEEK_API_KEY')?.trim()
    if (!apiKey) {
      this.logger.warn('DEEPSEEK_API_KEY 未配置，/form-ai/generate 将不可用')
    }
    const baseURL = this.config.get<string>('BASE_URL') ?? 'https://api.deepseek.com'
    const model = this.config.get<string>('MODEL_NAME') ?? 'deepseek-chat'

    this.model = new ChatOpenAI({
      model,
      apiKey: apiKey ?? 'missing',
      temperature: 0.2,
      configuration: {
        baseURL: baseURL.replace(/\/$/, '')
      }
    })
  }

  isConfigured(): boolean {
    const k = this.config.get<string>('DEEPSEEK_API_KEY')?.trim()
    return !!k && k !== 'missing'
  }

  /** 原始对话（便于后续多轮、工具调用扩展） */
  async invoke(messages: BaseMessageLike[]): Promise<string> {
    const res = await this.model.invoke(messages)
    const text = typeof res.content === 'string' ? res.content : JSON.stringify(res.content)
    return text
  }

  getModel(): ChatOpenAI {
    return this.model
  }
}
