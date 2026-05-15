import { Type } from 'class-transformer'
import { IsArray, IsIn, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator'

export class AiHistoryTurnDto {
  @IsIn(['user', 'assistant'])
  role!: 'user' | 'assistant'

  @IsString()
  @MaxLength(4000)
  content!: string
}

export class GenerateFormDto {
  @IsString()
  @MaxLength(4000)
  userMessage!: string

  @IsOptional()
  @IsArray()
  existingForm?: unknown[]

  /** 最近若干轮对话，用于多轮改表单（服务端会截断长度） */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AiHistoryTurnDto)
  history?: AiHistoryTurnDto[]
}
