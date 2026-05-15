import { join } from 'path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { FormAiModule } from './form-ai/form-ai.module'
import { LlmModule } from './llm/llm.module'

/** 与源码/编译产物位置无关，始终指向 form-ai-api 包根目录下的 env 文件 */
const formAiApiRoot = join(__dirname, '..')

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(formAiApiRoot, '.env.local'), join(formAiApiRoot, '.env')]
    }),
    LlmModule,
    FormAiModule
  ],
  controllers: [AppController]
})
export class AppModule {}
