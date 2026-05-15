import { Global, Module } from '@nestjs/common'
import { DeepseekChatService } from './deepseek-chat.service'

@Global()
@Module({
  providers: [DeepseekChatService],
  exports: [DeepseekChatService]
})
export class LlmModule {}
