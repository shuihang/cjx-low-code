import { Body, Controller, Post } from '@nestjs/common'
import { FormAiService } from './form-ai.service'
import { GenerateFormDto } from './dto/generate-form.dto'

@Controller('form-ai')
export class FormAiController {
  constructor(private readonly formAi: FormAiService) {}

  /** 自然语言 → 结构化表单 JSON（自有协议） */
  @Post('generate')
  async generate(@Body() dto: GenerateFormDto) {
    return this.formAi.generateForm(dto)
  }
}
