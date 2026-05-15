import { Module } from '@nestjs/common'
import { FormAiController } from './form-ai.controller'
import { FormAiService } from './form-ai.service'

@Module({
  controllers: [FormAiController],
  providers: [FormAiService]
})
export class FormAiModule {}
