import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { LangchainModule } from './langchain/langchain.module';
import { KnowledgeModule } from './knowledge/knowledge.module';
import { DocumentProcessorModule } from './document-processor/document-processor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
    LangchainModule,
    KnowledgeModule,
    DocumentProcessorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}